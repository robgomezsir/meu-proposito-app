// API de Integração com Plataformas de RH (GUPY, etc.)
// Gerencia envio de questionários e recebimento de scores

import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config-simple';

// Coleções do Firestore
const candidatosCollection = collection(db, 'candidatos');
const questionariosCollection = collection(db, 'questionarios');
const scoresCollection = collection(db, 'scores');
const integracoesCollection = collection(db, 'integracoes');

// ===== FUNÇÕES PRINCIPAIS =====

/**
 * Criar nova integração com plataforma de RH
 * @param {Object} integracao - Dados da integração
 * @returns {Promise<Object>} - ID da integração criada
 */
export const criarIntegracao = async (integracao) => {
  try {
    console.log('🔗 Criando integração com plataforma de RH:', integracao.plataforma);
    
    const docRef = await addDoc(integracoesCollection, {
      ...integracao,
      status: 'ativa',
      criadaEm: serverTimestamp(),
      atualizadaEm: serverTimestamp()
    });
    
    console.log('✅ Integração criada com sucesso! ID:', docRef.id);
    return { id: docRef.id, ...integracao };
  } catch (error) {
    console.error('❌ Erro ao criar integração:', error);
    throw error;
  }
};

/**
 * Enviar questionário para candidato via plataforma de RH
 * @param {Object} dados - Dados do candidato e questionário
 * @returns {Promise<Object>} - Link do questionário e dados da sessão
 */
export const enviarQuestionario = async (dados) => {
  try {
    console.log('📤 Enviando questionário para candidato:', dados.email);
    
    // Gerar ID único para a sessão
    const sessionId = generateSessionId();
    
    // Criar registro do candidato
    const candidatoRef = await addDoc(candidatosCollection, {
      nome: dados.nome,
      email: dados.email,
      telefone: dados.telefone || '',
      plataforma: dados.plataforma, // GUPY, etc.
      vaga: dados.vaga || '',
      empresa: dados.empresa || '',
      sessionId,
      status: 'questionario_enviado',
      criadoEm: serverTimestamp(),
      atualizadoEm: serverTimestamp()
    });
    
    // Criar registro do questionário
    const questionarioRef = await addDoc(questionariosCollection, {
      candidatoId: candidatoRef.id,
      sessionId,
      tipo: dados.tipoQuestionario || 'proposito',
      link: `${window.location.origin}/questionario/${sessionId}`,
      plataforma: dados.plataforma,
      vaga: dados.vaga || '',
      empresa: dados.empresa || '',
      status: 'enviado',
      enviadoEm: serverTimestamp(),
      expiraEm: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
      criadoEm: serverTimestamp()
    });
    
    // Registrar na integração
    await addDoc(integracoesCollection, {
      tipo: 'questionario_enviado',
      candidatoId: candidatoRef.id,
      questionarioId: questionarioRef.id,
      plataforma: dados.plataforma,
      dados: {
        nome: dados.nome,
        email: dados.email,
        vaga: dados.vaga,
        empresa: dados.empresa
      },
      criadoEm: serverTimestamp()
    });
    
    const resultado = {
      candidatoId: candidatoRef.id,
      questionarioId: questionarioRef.id,
      sessionId,
      link: `${window.location.origin}/questionario/${sessionId}`,
      status: 'enviado',
      expiraEm: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    };
    
    console.log('✅ Questionário enviado com sucesso!', resultado);
    return resultado;
  } catch (error) {
    console.error('❌ Erro ao enviar questionário:', error);
    throw error;
  }
};

/**
 * Receber score finalizado do candidato
 * @param {string} sessionId - ID da sessão do questionário
 * @param {Object} scoreData - Dados do score
 * @returns {Promise<Object>} - Score salvo e dados para plataforma
 */
export const receberScore = async (sessionId, scoreData) => {
  try {
    console.log('📊 Recebendo score para sessão:', sessionId);
    
    // Buscar candidato pela sessão
    const candidatoQuery = query(
      candidatosCollection, 
      where('sessionId', '==', sessionId)
    );
    const candidatoSnapshot = await getDocs(candidatoQuery);
    
    if (candidatoSnapshot.empty) {
      throw new Error('Candidato não encontrado para esta sessão');
    }
    
    const candidatoDoc = candidatoSnapshot.docs[0];
    const candidatoId = candidatoDoc.id;
    const candidatoData = candidatoDoc.data();
    
    // Buscar questionário
    const questionarioQuery = query(
      questionariosCollection,
      where('sessionId', '==', sessionId)
    );
    const questionarioSnapshot = await getDocs(questionarioQuery);
    
    if (questionarioSnapshot.empty) {
      throw new Error('Questionário não encontrado para esta sessão');
    }
    
    const questionarioDoc = questionarioSnapshot.docs[0];
    const questionarioId = questionarioDoc.id;
    
    // Salvar score
    const scoreRef = await addDoc(scoresCollection, {
      candidatoId,
      questionarioId,
      sessionId,
      score: scoreData.score,
      percentual: scoreData.percentual,
      categoria: scoreData.categoria,
      detalhes: scoreData.detalhes || {},
      respostas: scoreData.respostas || [],
      tempoResposta: scoreData.tempoResposta || 0,
      finalizadoEm: serverTimestamp(),
      criadoEm: serverTimestamp()
    });
    
    // Atualizar status do candidato
    await updateDoc(doc(db, 'candidatos', candidatoId), {
      status: 'questionario_finalizado',
      scoreId: scoreRef.id,
      atualizadoEm: serverTimestamp()
    });
    
    // Atualizar status do questionário
    await updateDoc(doc(db, 'questionarios', questionarioId), {
      status: 'finalizado',
      finalizadoEm: serverTimestamp(),
      scoreId: scoreRef.id
    });
    
    // Registrar na integração
    await addDoc(integracoesCollection, {
      tipo: 'score_recebido',
      candidatoId,
      questionarioId,
      scoreId: scoreRef.id,
      plataforma: candidatoData.plataforma,
      dados: {
        nome: candidatoData.nome,
        email: candidatoData.email,
        vaga: candidatoData.vaga,
        empresa: candidatoData.empresa,
        score: scoreData.score,
        percentual: scoreData.percentual,
        categoria: scoreData.categoria
      },
      criadoEm: serverTimestamp()
    });
    
    const resultado = {
      scoreId: scoreRef.id,
      candidatoId,
      questionarioId,
      sessionId,
      score: scoreData.score,
      percentual: scoreData.percentual,
      categoria: scoreData.categoria,
      status: 'finalizado',
      finalizadoEm: new Date()
    };
    
    console.log('✅ Score recebido e salvo com sucesso!', resultado);
    return resultado;
  } catch (error) {
    console.error('❌ Erro ao receber score:', error);
    throw error;
  }
};

/**
 * Buscar scores para plataforma de RH
 * @param {string} plataforma - Nome da plataforma (GUPY, etc.)
 * @param {Object} filtros - Filtros opcionais
 * @returns {Promise<Array>} - Lista de scores
 */
export const buscarScoresParaPlataforma = async (plataforma, filtros = {}) => {
  try {
    console.log('🔍 Buscando scores para plataforma:', plataforma);
    
    let q = query(
      integracoesCollection,
      where('plataforma', '==', plataforma),
      where('tipo', '==', 'score_recebido'),
      orderBy('criadoEm', 'desc')
    );
    
    const snapshot = await getDocs(q);
    const scores = [];
    
    for (const doc of snapshot.docs) {
      const data = doc.data();
      
      // Buscar dados completos do score
      if (data.scoreId) {
        const scoreDoc = await getDoc(doc(db, 'scores', data.scoreId));
        if (scoreDoc.exists()) {
          const scoreData = scoreDoc.data();
          
          // Buscar dados do candidato
          const candidatoDoc = await getDoc(doc(db, 'candidatos', data.candidatoId));
          const candidatoData = candidatoDoc.exists() ? candidatoDoc.data() : {};
          
          scores.push({
            id: doc.id,
            scoreId: data.scoreId,
            candidatoId: data.candidatoId,
            questionarioId: data.questionarioId,
            sessionId: data.sessionId,
            nome: candidatoData.nome,
            email: candidatoData.email,
            vaga: candidatoData.vaga,
            empresa: candidatoData.empresa,
            score: scoreData.score,
            percentual: scoreData.percentual,
            categoria: scoreData.categoria,
            detalhes: scoreData.detalhes,
            finalizadoEm: scoreData.finalizadoEm,
            criadoEm: data.criadoEm
          });
        }
      }
    }
    
    console.log(`✅ ${scores.length} scores encontrados para ${plataforma}`);
    return scores;
  } catch (error) {
    console.error('❌ Erro ao buscar scores:', error);
    throw error;
  }
};

/**
 * Gerar relatório de scores para plataforma
 * @param {string} plataforma - Nome da plataforma
 * @param {Object} filtros - Filtros de data, vaga, etc.
 * @returns {Promise<Object>} - Relatório consolidado
 */
export const gerarRelatorioScores = async (plataforma, filtros = {}) => {
  try {
    console.log('📊 Gerando relatório para plataforma:', plataforma);
    
    const scores = await buscarScoresParaPlataforma(plataforma, filtros);
    
    // Estatísticas
    const totalCandidatos = scores.length;
    const scoresPorCategoria = {};
    const mediaScore = scores.reduce((acc, s) => acc + s.score, 0) / totalCandidatos;
    
    scores.forEach(score => {
      const categoria = score.categoria || 'Sem categoria';
      if (!scoresPorCategoria[categoria]) {
        scoresPorCategoria[categoria] = [];
      }
      scoresPorCategoria[categoria].push(score);
    });
    
    // Calcular estatísticas por categoria
    const estatisticasPorCategoria = {};
    Object.keys(scoresPorCategoria).forEach(categoria => {
      const scoresCat = scoresPorCategoria[categoria];
      estatisticasPorCategoria[categoria] = {
        total: scoresCat.length,
        media: scoresCat.reduce((acc, s) => acc + s.score, 0) / scoresCat.length,
        melhor: Math.max(...scoresCat.map(s => s.score)),
        pior: Math.min(...scoresCat.map(s => s.score))
      };
    });
    
    const relatorio = {
      plataforma,
      periodo: {
        inicio: filtros.dataInicio || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        fim: filtros.dataFim || new Date()
      },
      totalCandidatos,
      mediaGeral: mediaScore,
      estatisticasPorCategoria,
      scores: scores,
      geradoEm: new Date()
    };
    
    console.log('✅ Relatório gerado com sucesso!', relatorio);
    return relatorio;
  } catch (error) {
    console.error('❌ Erro ao gerar relatório:', error);
    throw error;
  }
};

// ===== FUNÇÕES AUXILIARES =====

/**
 * Gerar ID único para sessão
 * @returns {string} - ID único da sessão
 */
const generateSessionId = () => {
  return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

/**
 * Validar dados de entrada
 * @param {Object} dados - Dados a serem validados
 * @returns {boolean} - Se os dados são válidos
 */
export const validarDadosIntegracao = (dados) => {
  const camposObrigatorios = ['nome', 'email', 'plataforma'];
  
  for (const campo of camposObrigatorios) {
    if (!dados[campo] || dados[campo].trim() === '') {
      throw new Error(`Campo obrigatório não preenchido: ${campo}`);
    }
  }
  
  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(dados.email)) {
    throw new Error('Email inválido');
  }
  
  return true;
};

export default {
  criarIntegracao,
  enviarQuestionario,
  receberScore,
  buscarScoresParaPlataforma,
  gerarRelatorioScores,
  validarDadosIntegracao
};


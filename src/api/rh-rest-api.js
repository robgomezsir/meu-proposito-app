// API REST para Integração com Plataformas de RH
// Endpoints para GUPY e outras plataformas consumirem

import { 
  enviarQuestionario, 
  receberScore, 
  buscarScoresParaPlataforma, 
  gerarRelatorioScores,
  validarDadosIntegracao 
} from './rh-integration';

// ===== ENDPOINTS DA API =====

/**
 * Endpoint: POST /api/rh/enviar-questionario
 * Envia questionário para candidato via plataforma de RH
 */
export const apiEnviarQuestionario = async (req, res) => {
  try {
    console.log('📤 API: Recebendo solicitação para enviar questionário');
    
    const { nome, email, telefone, plataforma, vaga, empresa, tipoQuestionario } = req.body;
    
    // Validar dados de entrada
    try {
      validarDadosIntegracao({ nome, email, plataforma });
    } catch (validationError) {
      return res.status(400).json({
        success: false,
        error: 'Dados inválidos',
        message: validationError.message
      });
    }
    
    // Enviar questionário
    const resultado = await enviarQuestionario({
      nome,
      email,
      telefone,
      plataforma,
      vaga,
      empresa,
      tipoQuestionario
    });
    
    // Retornar resposta para plataforma
    res.status(200).json({
      success: true,
      message: 'Questionário enviado com sucesso',
      data: {
        candidatoId: resultado.candidatoId,
        questionarioId: resultado.questionarioId,
        sessionId: resultado.sessionId,
        link: resultado.link,
        status: resultado.status,
        expiraEm: resultado.expiraEm,
        instrucoes: {
          envieEsteLink: resultado.link,
          validade: '7 dias',
          acompanheStatus: `/api/rh/status/${resultado.sessionId}`
        }
      }
    });
    
  } catch (error) {
    console.error('❌ API: Erro ao enviar questionário:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
};

/**
 * Endpoint: POST /api/rh/receber-score
 * Recebe score finalizado do candidato
 */
export const apiReceberScore = async (req, res) => {
  try {
    console.log('📊 API: Recebendo score finalizado');
    
    const { sessionId, score, percentual, categoria, detalhes, respostas, tempoResposta } = req.body;
    
    // Validar dados obrigatórios
    if (!sessionId || score === undefined || percentual === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Dados obrigatórios não fornecidos',
        message: 'sessionId, score e percentual são obrigatórios'
      });
    }
    
    // Receber score
    const resultado = await receberScore(sessionId, {
      score,
      percentual,
      categoria,
      detalhes,
      respostas,
      tempoResposta
    });
    
    // Retornar confirmação
    res.status(200).json({
      success: true,
      message: 'Score recebido e processado com sucesso',
      data: {
        scoreId: resultado.scoreId,
        candidatoId: resultado.candidatoId,
        questionarioId: resultado.questionarioId,
        sessionId: resultado.sessionId,
        score: resultado.score,
        percentual: resultado.percentual,
        categoria: resultado.categoria,
        status: resultado.status,
        finalizadoEm: resultado.finalizadoEm
      }
    });
    
  } catch (error) {
    console.error('❌ API: Erro ao receber score:', error);
    
    if (error.message.includes('não encontrado')) {
      return res.status(404).json({
        success: false,
        error: 'Sessão não encontrada',
        message: 'A sessão do questionário não foi encontrada ou expirou'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
};

/**
 * Endpoint: GET /api/rh/scores/:plataforma
 * Busca scores para uma plataforma específica
 */
export const apiBuscarScores = async (req, res) => {
  try {
    const { plataforma } = req.params;
    const { dataInicio, dataFim, vaga, empresa, limit = 100, offset = 0 } = req.query;
    
    console.log(`🔍 API: Buscando scores para plataforma: ${plataforma}`);
    
    // Validar plataforma
    if (!plataforma) {
      return res.status(400).json({
        success: false,
        error: 'Plataforma não especificada',
        message: 'O parâmetro plataforma é obrigatório'
      });
    }
    
    // Aplicar filtros
    const filtros = {};
    if (dataInicio) filtros.dataInicio = new Date(dataInicio);
    if (dataFim) filtros.dataFim = new Date(dataFim);
    if (vaga) filtros.vaga = vaga;
    if (empresa) filtros.empresa = empresa;
    
    // Buscar scores
    const scores = await buscarScoresParaPlataforma(plataforma, filtros);
    
    // Aplicar paginação
    const scoresPaginados = scores.slice(offset, offset + parseInt(limit));
    
    res.status(200).json({
      success: true,
      message: `${scores.length} scores encontrados para ${plataforma}`,
      data: {
        total: scores.length,
        limit: parseInt(limit),
        offset: parseInt(offset),
        scores: scoresPaginados,
        filtros: filtros
      }
    });
    
  } catch (error) {
    console.error('❌ API: Erro ao buscar scores:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
};

/**
 * Endpoint: GET /api/rh/relatorio/:plataforma
 * Gera relatório consolidado de scores para uma plataforma
 */
export const apiGerarRelatorio = async (req, res) => {
  try {
    const { plataforma } = req.params;
    const { dataInicio, dataFim, vaga, empresa } = req.query;
    
    console.log(`📊 API: Gerando relatório para plataforma: ${plataforma}`);
    
    // Validar plataforma
    if (!plataforma) {
      return res.status(400).json({
        success: false,
        error: 'Plataforma não especificada',
        message: 'O parâmetro plataforma é obrigatório'
      });
    }
    
    // Aplicar filtros
    const filtros = {};
    if (dataInicio) filtros.dataInicio = new Date(dataInicio);
    if (dataFim) filtros.dataFim = new Date(dataFim);
    if (vaga) filtros.vaga = vaga;
    if (empresa) filtros.empresa = empresa;
    
    // Gerar relatório
    const relatorio = await gerarRelatorioScores(plataforma, filtros);
    
    res.status(200).json({
      success: true,
      message: 'Relatório gerado com sucesso',
      data: relatorio
    });
    
  } catch (error) {
    console.error('❌ API: Erro ao gerar relatório:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
};

/**
 * Endpoint: GET /api/rh/status/:sessionId
 * Verifica status de um questionário específico
 */
export const apiVerificarStatus = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    console.log(`🔍 API: Verificando status da sessão: ${sessionId}`);
    
    // Buscar candidato pela sessão
    const { getDocs, query, where, collection } = await import('firebase/firestore');
    const candidatosCollection = collection(db, 'candidatos');
    
    const candidatoQuery = query(
      candidatosCollection, 
      where('sessionId', '==', sessionId)
    );
    const candidatoSnapshot = await getDocs(candidatoQuery);
    
    if (candidatoSnapshot.empty) {
      return res.status(404).json({
        success: false,
        error: 'Sessão não encontrada',
        message: 'A sessão do questionário não foi encontrada'
      });
    }
    
    const candidatoDoc = candidatoSnapshot.docs[0];
    const candidatoData = candidatoDoc.data();
    
    // Buscar questionário
    const questionariosCollection = collection(db, 'questionarios');
    const questionarioQuery = query(
      questionariosCollection,
      where('sessionId', '==', sessionId)
    );
    const questionarioSnapshot = await getDocs(questionarioQuery);
    
    let questionarioData = {};
    if (!questionarioSnapshot.empty) {
      questionarioData = questionarioSnapshot.docs[0].data();
    }
    
    // Buscar score se existir
    let scoreData = null;
    if (candidatoData.scoreId) {
      const { getDoc, doc } = await import('firebase/firestore');
      const scoresCollection = collection(db, 'scores');
      const scoreDoc = await getDoc(doc(scoresCollection, candidatoData.scoreId));
      if (scoreDoc.exists()) {
        scoreData = scoreDoc.data();
      }
    }
    
    res.status(200).json({
      success: true,
      message: 'Status da sessão recuperado com sucesso',
      data: {
        sessionId,
        candidato: {
          nome: candidatoData.nome,
          email: candidatoData.email,
          vaga: candidatoData.vaga,
          empresa: candidatoData.empresa,
          status: candidatoData.status
        },
        questionario: {
          tipo: questionarioData.tipo,
          status: questionarioData.status,
          enviadoEm: questionarioData.enviadoEm,
          expiraEm: questionarioData.expiraEm
        },
        score: scoreData ? {
          score: scoreData.score,
          percentual: scoreData.percentual,
          categoria: scoreData.categoria,
          finalizadoEm: scoreData.finalizadoEm
        } : null
      }
    });
    
  } catch (error) {
    console.error('❌ API: Erro ao verificar status:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
};

/**
 * Endpoint: GET /api/rh/health
 * Verifica saúde da API
 */
export const apiHealthCheck = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'API de Integração RH funcionando normalmente',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      endpoints: {
        'POST /api/rh/enviar-questionario': 'Envia questionário para candidato',
        'POST /api/rh/receber-score': 'Recebe score finalizado',
        'GET /api/rh/scores/:plataforma': 'Busca scores para plataforma',
        'GET /api/rh/relatorio/:plataforma': 'Gera relatório consolidado',
        'GET /api/rh/status/:sessionId': 'Verifica status de sessão'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro na verificação de saúde',
      message: error.message
    });
  }
};

// ===== EXPORTAÇÃO DOS ENDPOINTS =====

export default {
  apiEnviarQuestionario,
  apiReceberScore,
  apiBuscarScores,
  apiGerarRelatorio,
  apiVerificarStatus,
  apiHealthCheck
};


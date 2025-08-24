import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CheckCircle2, Circle, ArrowRight, ArrowLeft, User, FileText, BarChart3, Heart, Users, TrendingUp, UserCheck, Eye, Trash2, Mail } from 'lucide-react';
import { adicionarUsuario, buscarUsuarios, deletarTodosUsuarios, verificarCPFExistente } from '../firebase/services';
import { testarConexaoFirebase, limparDadosTeste } from '../firebase/test-connection';
import RegistrationForm from './RegistrationForm';
import QuestionnaireLayout from './QuestionnaireLayout';
import SuccessScreen from './SuccessScreen';

const SistemaProposito = () => {
  const [currentView, setCurrentView] = useState('formulario'); // formulario, sucesso, dashboard
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([[], [], [], []]);
  const [userInfo, setUserInfo] = useState({ nome: '', cpf: '' });
  const [usuarios, setUsuarios] = useState([]); // Simulando banco de dados
  const [showWelcome, setShowWelcome] = useState(true);
  const [rhEmail, setRhEmail] = useState('');
  const [isRhAuthenticated, setIsRhAuthenticated] = useState(false);
  const [carregandoUsuarios, setCarregandoUsuarios] = useState(false);
  const [dadosEnviados, setDadosEnviados] = useState(false); // Controla se os dados já foram enviados

  // Refs para controle de foco
  const nomeInputRef = useRef(null);
  const cpfInputRef = useRef(null);

  // Carregar dados salvos ao inicializar
  useEffect(() => {
    const carregarUsuarios = async () => {
      setCarregandoUsuarios(true);
      try {
        console.log('🔄 Carregando usuários do Firebase...');
        const usuariosFirebase = await buscarUsuarios();
        console.log('✅ Usuários carregados do Firebase:', usuariosFirebase.length);
        setUsuarios(usuariosFirebase);
        
        // Sincronizar com localStorage como backup
        localStorage.setItem('usuarios', JSON.stringify(usuariosFirebase));
      } catch (error) {
        console.error('❌ Erro ao carregar usuários do Firebase:', error);
        // Fallback para localStorage em caso de erro
        const savedUsuarios = localStorage.getItem('usuarios');
        if (savedUsuarios) {
          console.log('📱 Carregando dados do localStorage como fallback');
          setUsuarios(JSON.parse(savedUsuarios));
        }
      } finally {
        setCarregandoUsuarios(false);
      }
    };
    
    carregarUsuarios();
    
    // Verificar se já está autenticado como RH
    const rhAuth = localStorage.getItem('rhAuthenticated');
    if (rhAuth === 'true') {
      setIsRhAuthenticated(true);
    }
  }, []);

  // Salvar dados sempre que houver mudança (localStorage como backup)
  useEffect(() => {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
  }, [usuarios]);

  // Salvar estado de autenticação RH
  useEffect(() => {
    localStorage.setItem('rhAuthenticated', isRhAuthenticated);
  }, [isRhAuthenticated]);

  // Auto-focus no primeiro input quando o componente carrega
  useEffect(() => {
    if (showWelcome && nomeInputRef.current) {
      nomeInputRef.current.focus();
    }
  }, [showWelcome]);

  // Formatação automática do CPF
  const formatarCPF = (valor) => {
    // Remove tudo que não é dígito
    const somenteDigitos = valor.replace(/\D/g, '');
    
    // Aplica a máscara XXX.XXX.XXX-XX
    if (somenteDigitos.length <= 11) {
      return somenteDigitos
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2');
    }
    return somenteDigitos.slice(0, 11)
      .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  // Validação básica de CPF
  const validarCPF = (cpf) => {
    const somenteDigitos = cpf.replace(/\D/g, '');
    
    if (somenteDigitos.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(somenteDigitos)) return false;
    
    // Validação dos dígitos verificadores
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(somenteDigitos.charAt(i)) * (10 - i);
    }
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(somenteDigitos.charAt(9))) return false;
    
    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(somenteDigitos.charAt(i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(somenteDigitos.charAt(10))) return false;
    
    return true;
  };

  // Validação de nome
  const validarNome = (nome) => {
    const nomeFormatado = nome.trim();
    return nomeFormatado.length >= 2 && /^[a-zA-ZÀ-ÿ\s]+$/.test(nomeFormatado) && nomeFormatado.split(' ').length >= 2;
  };

  // Dados das perguntas (mesmo do código anterior)
  const caracteristicas = [
    'receptiva', 'feliz', 'estudiosa', 'sensata', 'realista', 'racional', 'detalhista', 'perfeccionista',
    'verdadeira', 'confiante', 'inteligente', 'generosa', 'dedicada', 'educada', 'amorosa', 'gentil',
    'rígida', 'paciente', 'comunicativa', 'coerente', 'organizada', 'prática', 'bom humor', 'tímida',
    'prestativa', 'líder', 'respeitadora', 'proativa', 'esforçada', 'sensível', 'responsável',
    'gosta de gente', 'descolada', 'séria', 'engraçada', 'vaidosa'
  ];

  const frasesVida = [
    'Sempre que alguém me procura para contar os problemas eu escuto e ajudo',
    'Meus amigos/familiares podem contar comigo em momentos alegres e tristes',
    'Se vejo alguém derrubando a carteira de dinheiro sem perceber, eu aviso',
    'Sempre vou aos compromissos que combinei (se não houver problema maior)',
    'Ajudo as pessoas que precisam de mim',
    'Consigo entender como os outros se sentem',
    'Minha família é o mais importante para mim',
    'Sou fiel a tudo que eu acredito',
    'Sei reconhecer quando estou errada',
    'Quando preciso resolver um problema, penso em todos os envolvidos',
    'Mesmo com muitas dificuldades eu não desisto fácil',
    'Respeito a opinião das outras pessoas',
    'Não minto para as pessoas'
  ];

  const valores = [
    'Trabalhar com Amor', 'iniciativa', 'crescimento pessoal', 'cuidar/importar-se', 'Respeito',
    'Honestidade/Integridade', 'excelência em servir', 'compaixão', 'empatia', 'aprendizagem contínua',
    'comprometimento', 'responsabilidade', 'ética', 'trabalho produtivo', 'escutar', 'família',
    'generosidade', 'orientar/guiar'
  ];

  const pesosCaracteristicas = {
    'verdadeira': 3, 'amorosa': 3, 'gentil': 3, 'respeitadora': 3, 'gosta de gente': 3, 'generosa': 3,
    'receptiva': 2, 'detalhista': 2, 'dedicada': 2, 'comunicativa': 2, 'prestativa': 2, 'responsável': 2,
    'feliz': 2, 'educada': 2, 'coerente': 2, 'líder': 2, 'organizada': 2, 'sensata': 2, 'inteligente': 2,
    'bom humor': 2, 'esforçada': 2, 'paciente': 2, 'sensível': 2,
    'perfeccionista': 1, 'descolada': 1, 'confiante': 1, 'prática': 1, 'proativa': 1, 'séria': 1,
    'realista': 1, 'rígida': 1, 'engraçada': 1, 'racional': 1, 'tímida': 1, 'vaidosa': 1, 'estudiosa': 1
  };

  const pesosFrases = {
    2: 5, 4: 5, 5: 5, 6: 5, 8: 5,
    11: 4, 12: 4
  };

  const pesosValores = {
    'Trabalhar com Amor': 9, 'Honestidade/Integridade': 9, 'excelência em servir': 9,
    'comprometimento': 9, 'trabalho produtivo': 9,
    'cuidar/importar-se': 8, 'Respeito': 8, 'empatia': 8, 'família': 8, 'generosidade': 8, 'escutar': 8,
    'iniciativa': 7, 'crescimento pessoal': 7, 'compaixão': 7, 'aprendizagem contínua': 7,
    'responsabilidade': 7, 'ética': 7, 'orientar/guiar': 7
  };

  const questions = [
    {
      title: "Como você acha que as pessoas te veem?",
      subtitle: "Escolha exatamente 5 características",
      options: caracteristicas
    },
    {
      title: "E você, como se vê?",
      subtitle: "Escolha exatamente 5 características",
      options: caracteristicas
    },
    {
      title: "Pense em toda sua vida até aqui",
      subtitle: "Assinale as 5 frases mais importantes para você",
      options: frasesVida
    },
    {
      title: "Valores mais importantes",
      subtitle: "Assinale os 5 mais importantes para você",
      options: valores
    }
  ];

  const calculateScore = (userAnswers = answers) => {
    let total = 0;
    
    for (let q = 0; q < 2; q++) {
      userAnswers[q].forEach(answerIndex => {
        const caracteristica = caracteristicas[answerIndex];
        total += pesosCaracteristicas[caracteristica] || 0;
      });
    }
    
    userAnswers[2].forEach(answerIndex => {
      total += pesosFrases[answerIndex] || 3;
    });
    
    userAnswers[3].forEach(answerIndex => {
      const valor = valores[answerIndex];
      total += pesosValores[valor] || 0;
    });
    
    return total;
  };

  const getStatus = (score) => {
    if (score <= 67) return "ABAIXO DA EXPECTATIVA";
    if (score <= 75) return "DENTRO DA EXPECTATIVA";
    if (score <= 90) return "ACIMA DA EXPECTATIVA";
    return "SUPEROU A EXPECTATIVA";
  };

  const getAnaliseClinica = (score, userAnswers) => {
    const status = getStatus(score);
    
    // Análise das características selecionadas
    const caracteristicasSelecionadas = [];
    for (let q = 0; q < 2; q++) {
      userAnswers[q].forEach(index => {
        caracteristicasSelecionadas.push(caracteristicas[index]);
      });
    }
    
    const valoresSelecionados = userAnswers[3].map(index => valores[index]);
    
    let analise = {
      perfil: "",
      competencias: [],
      areasDesenvolvimento: [],
      recomendacoes: [],
      adaptabilidade: "",
      lideranca: "",
      relacionamentoInterpessoal: ""
    };

    if (status === "SUPEROU A EXPECTATIVA") {
      analise.perfil = "Profissional com perfil excepcional, demonstrando alto nível de maturidade emocional e valores sólidos. Apresenta forte alinhamento entre autopercepção e percepção externa, indicando boa autoestima e consciência social.";
      analise.competencias = ["Liderança natural", "Inteligência emocional elevada", "Forte orientação para resultados", "Excelente relacionamento interpessoal"];
      analise.areasDesenvolvimento = ["Manter o alto padrão de performance", "Desenvolver outros profissionais", "Assumir projetos desafiadores"];
      analise.recomendacoes = ["Posições de liderança", "Mentoria de equipes", "Projetos estratégicos", "Representação institucional"];
      analise.adaptabilidade = "Excelente capacidade de adaptação a mudanças e novos cenários organizacionais.";
      analise.lideranca = "Potencial de liderança elevado, com capacidade natural para inspirar e motivar equipes.";
      analise.relacionamentoInterpessoal = "Relacionamento interpessoal exemplar, com alta capacidade de empatia e colaboração.";
    } else if (status === "ACIMA DA EXPECTATIVA") {
      analise.perfil = "Profissional com perfil sólido e valores bem estruturados. Demonstra boa capacidade de autoconhecimento e relacionamento interpessoal, com potencial para crescimento em posições de maior responsabilidade.";
      analise.competencias = ["Boa capacidade analítica", "Relacionamento interpessoal positivo", "Orientação para qualidade", "Responsabilidade e comprometimento"];
      analise.areasDesenvolvimento = ["Desenvolvimento de habilidades de liderança", "Maior proatividade em projetos", "Aprimoramento da comunicação"];
      analise.recomendacoes = ["Participação em projetos multidisciplinares", "Treinamentos de liderança", "Mentoria reversa", "Responsabilidades graduais"];
      analise.adaptabilidade = "Boa capacidade de adaptação, com abertura para aprendizado contínuo.";
      analise.lideranca = "Potencial de liderança em desenvolvimento, adequado para coordenação de pequenas equipes.";
      analise.relacionamentoInterpessoal = "Relacionamento interpessoal positivo, com capacidade de trabalho em equipe.";
    } else if (status === "DENTRO DA EXPECTATIVA") {
      analise.perfil = "Profissional com perfil adequado para as demandas organizacionais básicas. Apresenta valores fundamentais estruturados, mas com oportunidades de desenvolvimento em áreas específicas.";
      analise.competencias = ["Cumprimento de responsabilidades", "Relacionamento cordial", "Orientação básica para resultados"];
      analise.areasDesenvolvimento = ["Maior proatividade", "Desenvolvimento da autoconfiança", "Melhoria na comunicação", "Ampliação da visão estratégica"];
      analise.recomendacoes = ["Programas de desenvolvimento profissional", "Coaching individual", "Participação em grupos de trabalho", "Feedback contínuo"];
      analise.adaptabilidade = "Capacidade moderada de adaptação, necessitando suporte em mudanças significativas.";
      analise.lideranca = "Potencial de liderança limitado no momento atual, mais adequado para funções técnicas.";
      analise.relacionamentoInterpessoal = "Relacionamento interpessoal adequado, com necessidade de maior desenvoltura social.";
    } else {
      analise.perfil = "Profissional em fase de desenvolvimento, necessitando apoio estruturado para alcançar seu potencial. Apresenta oportunidades significativas de crescimento pessoal e profissional.";
      analise.competencias = ["Potencial de crescimento identificado", "Disponibilidade para aprendizado"];
      analise.areasDesenvolvimento = ["Desenvolvimento da autoestima", "Melhoria na comunicação", "Fortalecimento de valores pessoais", "Ampliação da consciência social"];
      analise.recomendacoes = ["Programa intensivo de desenvolvimento", "Mentoria especializada", "Coaching comportamental", "Treinamentos específicos", "Acompanhamento próximo da liderança"];
      analise.adaptabilidade = "Necessita suporte significativo para adaptação a mudanças organizacionais.";
      analise.lideranca = "Não recomendado para posições de liderança no momento, focando primeiro no autodesenvolvimento.";
      analise.relacionamentoInterpessoal = "Necessita desenvolvimento de habilidades sociais e de relacionamento interpessoal.";
    }

    return analise;
  };

  const handleRhLogin = useCallback((e) => {
    e.preventDefault();
    // Verificação discreta para email corporativo da Atento
    if (rhEmail.includes('@atento.com') && rhEmail.trim()) {
      setIsRhAuthenticated(true);
      setCurrentView('dashboard');
    } else {
      // Mensagem genérica sem revelar o domínio específico
      alert('Email não autorizado para acesso ao dashboard.');
    }
  }, [rhEmail]);

  const handleRhLogout = useCallback(() => {
    setIsRhAuthenticated(false);
    setRhEmail('');
    setCurrentView('formulario');
  }, []);

  // Função para atualizar campos do usuário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Função para iniciar o questionário
  const iniciarQuestionario = async (e) => {
    e.preventDefault();
    
    // Verificar se os campos estão preenchidos e válidos
    if (!validarNome(userInfo.nome) || !validarCPF(userInfo.cpf)) {
      alert('Por favor, preencha todos os campos obrigatórios corretamente.');
      return;
    }
    
    // Verificar se o CPF já existe no Firebase
    try {
      const cpfJaExiste = await verificarCPFExistente(userInfo.cpf);
      
      if (cpfJaExiste) {
        alert('Este CPF já foi utilizado para realizar um teste. Não é possível realizar novo teste com o mesmo CPF.');
        return;
      }
    } catch (error) {
      console.error('Erro ao verificar CPF:', error);
      // Fallback para verificação local
      const cpfJaExisteLocal = usuarios.some(usuario => usuario.cpf === userInfo.cpf);
      if (cpfJaExisteLocal) {
        alert('Este CPF já foi utilizado para realizar um teste. Não é possível realizar novo teste com o mesmo CPF.');
        return;
      }
    }
    
    setShowWelcome(false);
  };

  const handleOptionClick = useCallback((optionIndex) => {
    setAnswers(prev => {
      const newAnswers = [...prev];
      const currentAnswers = newAnswers[currentQuestion];
      
      if (currentAnswers.includes(optionIndex)) {
        newAnswers[currentQuestion] = currentAnswers.filter(i => i !== optionIndex);
      } else {
        if (currentAnswers.length < 5) {
          newAnswers[currentQuestion] = [...currentAnswers, optionIndex];
        }
      }
      
      return newAnswers;
    });
  }, [currentQuestion]);

  const nextQuestion = useCallback(() => {
    if (answers[currentQuestion].length === 5) {
      if (currentQuestion < 3) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        // Apenas ir para a tela de sucesso, sem salvar ainda
        setCurrentView('sucesso');
      }
    }
  }, [currentQuestion, answers]);

  const prevQuestion = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  }, [currentQuestion]);

  const resetFormulario = useCallback(() => {
    setCurrentQuestion(0);
    setAnswers([[], [], [], []]);
    setUserInfo({ nome: '', cpf: '' });
    setCurrentView('formulario');
    setShowWelcome(true);
    setDadosEnviados(false); // Resetar estado de dados enviados
  }, []);

  // Função para limpar todos os dados (para RH)
  const limparTodosDados = async () => {
    if (window.confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
      try {
        // Log detalhado da ação de exclusão
        const logExclusao = {
          acao: 'EXCLUSÃO TOTAL DE DADOS',
          usuarioRH: rhEmail,
          timestamp: new Date().toISOString(),
          dataFormatada: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR'),
          totalUsuariosExcluidos: usuarios.length,
          detalhes: 'Todos os dados foram removidos do sistema'
        };
        
        console.log('🚨 AÇÃO CRÍTICA EXECUTADA:', logExclusao);
        console.log('📋 Log de Auditoria:', JSON.stringify(logExclusao, null, 2));
        
        // Executar a exclusão
        await deletarTodosUsuarios();
        setUsuarios([]);
        localStorage.removeItem('usuarios');
        
        // Log de sucesso
        console.log('✅ Exclusão concluída com sucesso');
        console.log('📊 Estatísticas da exclusão:', {
          dadosRemovidos: logExclusao.totalUsuariosExcluidos,
          executadoPor: logExclusao.usuarioRH,
          horario: logExclusao.dataFormatada
        });
        
        alert(`🚨 Dados excluídos com sucesso!\n\nTotal de registros removidos: ${logExclusao.totalUsuariosExcluidos}\nExecutado por: ${logExclusao.usuarioRH}\nData/Hora: ${logExclusao.dataFormatada}\n\n⚠️ Esta ação foi registrada no log de auditoria.`);
        
      } catch (error) {
        console.error('❌ Erro ao limpar dados do Firebase:', error);
        
        // Log de erro
        const logErro = {
          acao: 'TENTATIVA DE EXCLUSÃO FALHOU',
          usuarioRH: rhEmail,
          timestamp: new Date().toISOString(),
          dataFormatada: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR'),
          erro: error.message,
          stack: error.stack
        };
        
        console.log('🚨 ERRO NA EXCLUSÃO:', logErro);
        console.log('📋 Log de Erro:', JSON.stringify(logErro, null, 2));
        
        alert(`❌ Erro ao limpar dados:\n\n${error.message}\n\nTente novamente.`);
      }
    }
  };

  // Função para testar conexão Firebase
  const testarFirebase = async () => {
    try {
      const resultado = await testarConexaoFirebase();
      if (resultado.sucesso) {
        alert(`✅ Teste Firebase bem-sucedido!\n\nDocumento criado com ID: ${resultado.documentoId}\nDocumentos encontrados: ${resultado.documentos.length}`);
      } else {
        alert(`❌ Teste Firebase falhou:\n\n${resultado.erro}`);
      }
    } catch (error) {
      console.error('Erro ao testar Firebase:', error);
      alert(`❌ Erro ao executar teste:\n\n${error.message}`);
    }
  };

  // Função para limpar dados de teste
  const limparTeste = async () => {
    try {
      const resultado = await limparDadosTeste();
      if (resultado.sucesso) {
        alert(`🧹 Dados de teste verificados!\n\nDocumentos encontrados: ${resultado.documentosEncontrados}`);
      } else {
        alert(`❌ Erro ao verificar dados de teste:\n\n${resultado.erro}`);
      }
    } catch (error) {
      console.error('Erro ao limpar dados de teste:', error);
      alert(`❌ Erro ao executar limpeza:\n\n${error.message}`);
    }
  };

  // Função para enviar dados ao RH (salvar no Firebase)
  const salvarDados = async () => {
    try {
      // Calcular score e análise
      const score = calculateScore(answers);
      const analiseClinica = getAnaliseClinica(score, answers);
      
      // Converter arrays aninhados para objetos planos (compatível com Firestore)
      const respostasConvertidas = {
        pergunta1: answers[0] || [],
        pergunta2: answers[1] || [],
        pergunta3: answers[2] || [],
        pergunta4: answers[3] || []
      };
      
      // Preparar dados do usuário
      const novoUsuario = {
        nome: userInfo.nome,
        cpf: userInfo.cpf,
        respostas: respostasConvertidas,
        score: score,
        status: getStatus(score),
        analiseClinica: analiseClinica,
        dataRealizacao: new Date().toLocaleDateString('pt-BR')
      };
      
      console.log('📝 Dados preparados para envio:', novoUsuario);
      
      // Salvar no Firebase
      console.log('🔥 Salvando no Firebase...');
      const usuarioSalvo = await adicionarUsuario(novoUsuario);
      console.log('✅ Usuário salvo com sucesso:', usuarioSalvo);
      
      // Marcar dados como enviados
      setDadosEnviados(true);
      
      // Mostrar mensagem de sucesso simples
      alert(`✅ Dados enviados com sucesso ao RH!\n\nObrigado por participar da avaliação.`);
      
      // Recarregar dados do Firebase para garantir sincronização (sem redirecionar)
      setTimeout(async () => {
        try {
          const usuariosAtualizados = await buscarUsuarios();
          setUsuarios(usuariosAtualizados);
        } catch (error) {
          console.error('Erro ao recarregar dados:', error);
        }
      }, 1000);
      
    } catch (error) {
      console.error('Erro ao enviar dados ao RH:', error);
      alert(`❌ Erro ao enviar dados:\n\n${error.message}\n\nTente novamente.`);
    }
  };

  // Função auxiliar para converter respostas do novo formato para array
  const converterRespostasParaArray = (respostas) => {
    if (Array.isArray(respostas)) {
      // Formato antigo (array de arrays) - manter compatibilidade
      return respostas;
    } else {
      // Novo formato (objeto com pergunta1, pergunta2, etc.)
      return [
        respostas.pergunta1 || [],
        respostas.pergunta2 || [],
        respostas.pergunta3 || [],
        respostas.pergunta4 || []
      ];
    }
  };

  // Função para exportar dados como backup
  const exportarBackup = () => {
    const backup = {
      usuarios: usuarios,
      dataExportacao: new Date().toISOString(),
      totalUsuarios: usuarios.length
    };
    
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_usuarios_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };



  // Componente do Formulário
  const FormularioComponent = useCallback(() => {
    if (showWelcome) {
      return (
        <RegistrationForm
          userInfo={userInfo}
          onInputChange={handleInputChange}
          onSubmit={iniciarQuestionario}
          onRhAccess={() => setCurrentView('dashboard')}
          validarNome={validarNome}
          validarCPF={validarCPF}
          formatarCPF={formatarCPF}
        />
      );
    }

    const currentQuestionData = questions[currentQuestion];
    const currentAnswers = answers[currentQuestion];
    const canProceed = currentAnswers.length === 5;

    return (
      <QuestionnaireLayout
        currentQuestion={currentQuestion}
        totalQuestions={4}
        title={currentQuestionData.title}
        subtitle={currentQuestionData.subtitle}
        options={currentQuestionData.options}
        selectedOptions={currentAnswers}
        onOptionClick={handleOptionClick}
        onNext={nextQuestion}
        onPrevious={prevQuestion}
        canProceed={canProceed}
      />
    );
  }, [showWelcome, userInfo, currentQuestion, answers, questions, handleInputChange, iniciarQuestionario, validarNome, validarCPF, formatarCPF, handleOptionClick, nextQuestion, prevQuestion]);

  // Componente de Sucesso
  const SucessoComponent = useCallback(() => (
    <SuccessScreen
      userName={userInfo.nome}
      dadosEnviados={dadosEnviados}
      onExportarBackup={salvarDados}
      onResetFormulario={resetFormulario}
    />
  ), [userInfo.nome, dadosEnviados, salvarDados, resetFormulario]);

        // Funções de Download
    const downloadIndividual = (usuario) => {
      const respostasArray = converterRespostasParaArray(usuario.respostas);
     
     const content = `
 RELATÓRIO INDIVIDUAL - ANÁLISE DE PROPÓSITO
 =============================================
 
 DADOS PESSOAIS:
 Nome: ${usuario.nome}
 CPF: ${usuario.cpf}
 Data da Avaliação: ${usuario.dataRealizacao}
 
 RESULTADO GERAL:
 Score Final: ${usuario.score} pontos
 Status: ${usuario.status}
 
 PERFIL GERAL:
 ${usuario.analiseClinica.perfil}
 
 COMPETÊNCIAS IDENTIFICADAS:
 ${usuario.analiseClinica.competencias.map(comp => `• ${comp}`).join('\n')}
 
 ANÁLISE COMPORTAMENTAL:
 
 Adaptabilidade:
 ${usuario.analiseClinica.adaptabilidade}
 
 Liderança:
 ${usuario.analiseClinica.lideranca}
 
 Relacionamento Interpessoal:
 ${usuario.analiseClinica.relacionamentoInterpessoal}
 
 ÁREAS DE DESENVOLVIMENTO:
 ${usuario.analiseClinica.areasDesenvolvimento.map(area => `• ${area}`).join('\n')}
 
 RECOMENDAÇÕES:
 ${usuario.analiseClinica.recomendacoes.map(rec => `• ${rec}`).join('\n')}
 
 DETALHAMENTO DAS RESPOSTAS:
 
 Pergunta 1 - Como as pessoas te veem:
 ${respostasArray[0].map(index => `• ${caracteristicas[index]}`).join('\n')}
 
 Pergunta 2 - Como você se vê:
 ${respostasArray[1].map(index => `• ${caracteristicas[index]}`).join('\n')}
 
 Pergunta 3 - Frases importantes:
 ${respostasArray[2].map(index => `• ${frasesVida[index]}`).join('\n')}
 
 Pergunta 4 - Valores importantes:
 ${respostasArray[3].map(index => `• ${valores[index]}`).join('\n')}
 
 ==============================================
 Relatório gerado automaticamente pelo Sistema de Análise de Propósito
 Data de geração: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}
 `;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Relatorio_${usuario.nome.replace(/\s+/g, '_')}_${usuario.cpf}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadConsolidado = () => {
    if (usuarios.length === 0) {
      alert('Não há dados para exportar.');
      return;
    }

    // Dados para CSV
    const csvHeader = 'Nome,CPF,Data Avaliacao,Score,Status,Competencias Principais,Areas Desenvolvimento\n';
    const csvData = usuarios.map(usuario => {
      const competencias = usuario.analiseClinica.competencias.slice(0, 3).join('; ');
      const areas = usuario.analiseClinica.areasDesenvolvimento.slice(0, 3).join('; ');
      return `"${usuario.nome}","${usuario.cpf}","${usuario.dataRealizacao}",${usuario.score},"${usuario.status}","${competencias}","${areas}"`;
    }).join('\n');

    // Relatório detalhado
    const relatorioCompleto = `
RELATÓRIO CONSOLIDADO - ANÁLISE DE PROPÓSITO
============================================

RESUMO EXECUTIVO:
Total de Colaboradores Avaliados: ${usuarios.length}
Score Médio: ${usuarios.length > 0 ? Math.round(usuarios.reduce((acc, u) => acc + u.score, 0) / usuarios.length) : 0} pontos
Data de Geração: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}

DISTRIBUIÇÃO POR STATUS:
• Superou a Expectativa: ${usuarios.filter(u => u.status === "SUPEROU A EXPECTATIVA").length} colaboradores
• Acima da Expectativa: ${usuarios.filter(u => u.status === "ACIMA DA EXPECTATIVA").length} colaboradores
• Dentro da Expectativa: ${usuarios.filter(u => u.status === "DENTRO DA EXPECTATIVA").length} colaboradores
• Abaixo da Expectativa: ${usuarios.filter(u => u.status === "ABAIXO DA EXPECTATIVA").length} colaboradores

RANKING DOS COLABORADORES:
${usuarios
  .sort((a, b) => b.score - a.score)
  .map((usuario, index) => `${index + 1}º. ${usuario.nome} - ${usuario.score} pts (${usuario.status})`)
  .join('\n')
}

DETALHAMENTO INDIVIDUAL:
${'='.repeat(50)}

${usuarios.map(usuario => `
COLABORADOR: ${usuario.nome}
CPF: ${usuario.cpf} | Data: ${usuario.dataRealizacao}
Score: ${usuario.score} pontos | Status: ${usuario.status}

Perfil: ${usuario.analiseClinica.perfil}

Competências: ${usuario.analiseClinica.competencias.join(', ')}

Áreas de Desenvolvimento: ${usuario.analiseClinica.areasDesenvolvimento.join(', ')}

Recomendações: ${usuario.analiseClinica.recomendacoes.join(', ')}

${'-'.repeat(50)}
`).join('')}

DADOS PARA ANÁLISE ESTATÍSTICA (CSV):
${csvHeader}${csvData}

============================================
Relatório gerado automaticamente pelo Sistema de Análise de Propósito
`;

    const blob = new Blob([relatorioCompleto], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Relatorio_Consolidado_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Componente Dashboard RH
  const DashboardComponent = useCallback(() => {
    const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="bg-white shadow-lg border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-4">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Dashboard RH</h1>
                  <p className="text-gray-600">Análise de Propósito - Resultados dos Colaboradores</p>
                </div>
              </div>
              <button
                onClick={handleRhLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Sair do Sistema
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {!usuarioSelecionado ? (
            <div>
              {/* Botões de Gerenciamento */}
              <div className="mb-6 flex flex-wrap gap-4">
                <button
                  onClick={downloadConsolidado}
                  disabled={usuarios.length === 0}
                  className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    usuarios.length > 0
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Download Relatório Consolidado
                </button>
                
                <button
                  onClick={exportarBackup}
                  disabled={usuarios.length === 0}
                  className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    usuarios.length > 0
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Exportar Backup
                </button>
                
                <button
                  onClick={limparTodosDados}
                  className="flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <Trash2 className="w-5 h-5 mr-2" />
                  Limpar Todos os Dados
                </button>
                
                
              </div>
              {/* Informação sobre Persistência */}
              <div className="mb-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-xl">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                                         <p className="text-sm text-blue-700">
                       <strong>💾 Dados Persistidos:</strong> Todos os registros são salvos na (nuvem)!Use "Exportar Backup" para criar cópias de segurança.                     </p>
                  </div>
                </div>
              </div>

              {/* Estatísticas Gerais */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-2xl font-bold text-gray-800">{usuarios.length}</p>
                      <p className="text-gray-600 text-sm">Total de Avaliados</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-2xl font-bold text-gray-800">
                        {usuarios.filter(u => u.status === "SUPEROU A EXPECTATIVA" || u.status === "ACIMA DA EXPECTATIVA").length}
                      </p>
                      <p className="text-gray-600 text-sm">Alto Potencial</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <UserCheck className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-2xl font-bold text-gray-800">
                        {usuarios.filter(u => u.status === "DENTRO DA EXPECTATIVA").length}
                      </p>
                      <p className="text-gray-600 text-sm">Dentro do Esperado</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-2xl font-bold text-gray-800">
                        {usuarios.length > 0 ? Math.round(usuarios.reduce((acc, u) => acc + u.score, 0) / usuarios.length) : 0}
                      </p>
                      <p className="text-gray-600 text-sm">Score Médio</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lista de Usuários */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-800">Colaboradores Avaliados</h2>
                  <p className="text-gray-600">Clique em um colaborador para ver a análise detalhada</p>
                </div>
                
                                 {carregandoUsuarios ? (
                   <div className="p-12 text-center">
                     <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
                       <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
                     </div>
                     <h3 className="text-lg font-medium text-gray-800 mb-2">Carregando dados...</h3>
                     <p className="text-gray-600">Buscando informações do Firebase...</p>
                   </div>
                 ) : usuarios.length === 0 ? (
                   <div className="p-12 text-center">
                     <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                       <Users className="w-8 h-8 text-gray-400" />
                     </div>
                     <h3 className="text-lg font-medium text-gray-800 mb-2">Nenhum colaborador avaliado</h3>
                     <p className="text-gray-600">Os resultados aparecerão aqui assim que os colaboradores completarem o questionário.</p>
                   </div>
                 ) : (
                  <div className="divide-y divide-gray-200">
                    {usuarios.map((usuario) => (
                      <div
                        key={usuario.id}
                        className="p-6 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <div 
                            className="flex items-center cursor-pointer flex-1"
                            onClick={() => setUsuarioSelecionado(usuario)}
                          >
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {usuario.nome.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <h3 className="text-lg font-semibold text-gray-800">{usuario.nome}</h3>
                              <p className="text-gray-600 text-sm">CPF: {usuario.cpf} • {usuario.dataRealizacao}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className="text-2xl font-bold text-gray-800">{usuario.score}</div>
                              <div className={`text-sm font-medium ${
                                usuario.status === "SUPEROU A EXPECTATIVA" ? "text-purple-600" :
                                usuario.status === "ACIMA DA EXPECTATIVA" ? "text-green-600" :
                                usuario.status === "DENTRO DA EXPECTATIVA" ? "text-blue-600" : "text-orange-600"
                              }`}>
                                {usuario.status}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  downloadIndividual(usuario);
                                }}
                                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors duration-200 flex items-center"
                                title="Download Relatório Individual"
                              >
                                <FileText className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setUsuarioSelecionado(usuario)}
                                className="bg-indigo-500 hover:bg-indigo-600 text-white p-2 rounded-lg transition-colors duration-200"
                                title="Visualizar Análise Detalhada"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Análise Detalhada do Usuário */
            <div>
              <div className="mb-6">
                <button
                  onClick={() => setUsuarioSelecionado(null)}
                  className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Voltar à Lista
                </button>
              </div>

              {/* Header do Usuário */}
              <div className="bg-white rounded-xl shadow-lg p-8 mb-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {usuarioSelecionado.nome.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-6">
                      <h1 className="text-3xl font-bold text-gray-800">{usuarioSelecionado.nome}</h1>
                      <p className="text-gray-600 mb-2">CPF: {usuarioSelecionado.cpf}</p>
                      <p className="text-sm text-gray-500">Avaliado em: {usuarioSelecionado.dataRealizacao}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-indigo-600 mb-2">{usuarioSelecionado.score}</div>
                    <div className={`text-lg font-semibold px-4 py-2 rounded-full mb-4 ${
                      usuarioSelecionado.status === "SUPEROU A EXPECTATIVA" ? "bg-purple-100 text-purple-800" :
                      usuarioSelecionado.status === "ACIMA DA EXPECTATIVA" ? "bg-green-100 text-green-800" :
                      usuarioSelecionado.status === "DENTRO DA EXPECTATIVA" ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800"
                    }`}>
                      {usuarioSelecionado.status}
                    </div>
                    <button
                      onClick={() => downloadIndividual(usuarioSelecionado)}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Download Relatório
                    </button>
                  </div>
                </div>
              </div>

              {/* Análise Clínica */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Perfil Geral */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <User className="w-6 h-6 mr-2 text-indigo-600" />
                    Perfil Geral
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{usuarioSelecionado.analiseClinica.perfil}</p>
                </div>

                {/* Competências Identificadas */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <CheckCircle2 className="w-6 h-6 mr-2 text-green-600" />
                    Competências Identificadas
                  </h3>
                  <ul className="space-y-2">
                    {usuarioSelecionado.analiseClinica.competencias.map((comp, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        {comp}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Análise Comportamental */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <h4 className="text-lg font-bold text-gray-800 mb-3">🔄 Adaptabilidade</h4>
                  <p className="text-gray-700 text-sm">{usuarioSelecionado.analiseClinica.adaptabilidade}</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <h4 className="text-lg font-bold text-gray-800 mb-3">👥 Liderança</h4>
                  <p className="text-gray-700 text-sm">{usuarioSelecionado.analiseClinica.lideranca}</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <h4 className="text-lg font-bold text-gray-800 mb-3">🤝 Relacionamento</h4>
                  <p className="text-gray-700 text-sm">{usuarioSelecionado.analiseClinica.relacionamentoInterpessoal}</p>
                </div>
              </div>

              {/* Áreas de Desenvolvimento e Recomendações */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <TrendingUp className="w-6 h-6 mr-2 text-yellow-600" />
                    Áreas de Desenvolvimento
                  </h3>
                  <ul className="space-y-2">
                    {usuarioSelecionado.analiseClinica.areasDesenvolvimento.map((area, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                        {area}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <FileText className="w-6 h-6 mr-2 text-blue-600" />
                    Recomendações
                  </h3>
                  <ul className="space-y-2">
                    {usuarioSelecionado.analiseClinica.recomendacoes.map((rec, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }, [usuarios, carregandoUsuarios, downloadConsolidado, exportarBackup, limparTodosDados, downloadIndividual, handleRhLogout]);

  // Renderização principal
  if (currentView === 'formulario') {
    return <FormularioComponent />;
  } else if (currentView === 'sucesso') {
    return <SucessoComponent />;
  } else if (currentView === 'dashboard') {
    // Verificar se está autenticado como RH
    if (!isRhAuthenticated) {
      // Mostrar modal de login discreto
      return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-indigo-100">
            <div className="text-center mb-8">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-6">
                <BarChart3 className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
              <p className="text-gray-600">Acesso ao sistema de análise</p>
            </div>

            <form onSubmit={handleRhLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={rhEmail}
                    onChange={(e) => setRhEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="Digite seu email"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              >
                Acessar
              </button>
            </form>

            <div className="text-center pt-4">
              <button
                onClick={() => setCurrentView('formulario')}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors duration-200"
              >
                ← Voltar ao Questionário
              </button>
            </div>
          </div>
        </div>
      );
    }
    return <DashboardComponent />;
  }

  return null;
};

export default SistemaProposito;
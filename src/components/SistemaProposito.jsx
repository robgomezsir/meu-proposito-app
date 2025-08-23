import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, ArrowRight, ArrowLeft, User, FileText, BarChart3, Heart, Users, TrendingUp, UserCheck, Eye } from 'lucide-react';

const SistemaProposito = () => {
  const [currentView, setCurrentView] = useState('login'); // login, formulario, sucesso, dashboard
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([[], [], [], []]);
  const [userInfo, setUserInfo] = useState({ nome: '', cpf: '' });
  const [usuarios, setUsuarios] = useState([]); // Simulando banco de dados
  const [showWelcome, setShowWelcome] = useState(true);

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

  const handleLogin = (e) => {
    e.preventDefault();
    if (userInfo.nome.trim() && userInfo.cpf.trim()) {
      setCurrentView('formulario');
    }
  };

  const handleOptionClick = (optionIndex) => {
    const newAnswers = [...answers];
    const currentAnswers = newAnswers[currentQuestion];
    
    if (currentAnswers.includes(optionIndex)) {
      newAnswers[currentQuestion] = currentAnswers.filter(i => i !== optionIndex);
    } else {
      if (currentAnswers.length < 5) {
        newAnswers[currentQuestion] = [...currentAnswers, optionIndex];
      }
    }
    
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (answers[currentQuestion].length === 5) {
      if (currentQuestion < 3) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        // Salvar dados do usuário
        const score = calculateScore();
        const analiseClinica = getAnaliseClinica(score, answers);
        const novoUsuario = {
          id: Date.now(),
          nome: userInfo.nome,
          cpf: userInfo.cpf,
          respostas: answers,
          score: score,
          status: getStatus(score),
          analiseClinica: analiseClinica,
          dataRealizacao: new Date().toLocaleDateString('pt-BR')
        };
        
        setUsuarios(prev => [...prev, novoUsuario]);
        setCurrentView('sucesso');
      }
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const resetFormulario = () => {
    setCurrentQuestion(0);
    setAnswers([[], [], [], []]);
    setUserInfo({ nome: '', cpf: '' });
    setCurrentView('login');
    setShowWelcome(true);
  };

  // Componente de Login
  const LoginComponent = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-indigo-100">
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-6">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Acesso ao Propósito</h1>
          <p className="text-gray-600">Informe seus dados para começar</p>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-xl mb-6">
            <p className="text-blue-700 text-sm">
              <strong>Instruções:</strong> Complete o cadastro rápido para acessar o questionário de autopercepção.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo
              </label>
              <input
                type="text"
                value={userInfo.nome}
                onChange={(e) => setUserInfo({...userInfo, nome: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="Digite seu nome completo"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CPF
              </label>
              <input
                type="text"
                value={userInfo.cpf}
                onChange={(e) => setUserInfo({...userInfo, cpf: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="Digite seu CPF"
              />
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={!userInfo.nome.trim() || !userInfo.cpf.trim()}
            className={`w-full py-3 rounded-xl text-lg font-semibold transition-all duration-200 ${
              userInfo.nome.trim() && userInfo.cpf.trim()
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Acessar Questionário
          </button>

          <div className="text-center pt-4">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors duration-200"
            >
              Acesso para Analista de RH →
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Componente do Formulário (mesmo código anterior mas sem mostrar score)
  const FormularioComponent = () => {
    if (showWelcome) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 border border-indigo-100">
            <div className="text-center">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-6">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Olá, {userInfo.nome}!
              </h1>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                Questionário de Autopercepção
              </h2>
              <div className="space-y-4 text-left bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 mb-8">
                <p className="flex items-start">
                  <span className="text-2xl mr-2">👉</span>
                  <span className="text-gray-700">Este teste é baseado em 4 perguntas simples.</span>
                </p>
                <p className="flex items-start">
                  <span className="text-2xl mr-2">⚠️</span>
                  <span className="text-gray-700">Não existem respostas certas ou erradas – o importante é ser você mesmo(a).</span>
                </p>
                <p className="flex items-start">
                  <span className="text-2xl mr-2">📌</span>
                  <span className="text-gray-700">Em cada pergunta você deverá escolher exatamente 5 opções.</span>
                </p>
                <p className="flex items-start">
                  <span className="text-2xl mr-2">⛔</span>
                  <span className="text-gray-700">Se tentar escolher mais de 5, será necessário desmarcar uma das respostas anteriores.</span>
                </p>
              </div>
              <button
                onClick={() => setShowWelcome(false)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-full text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Começar Questionário
              </button>
            </div>
          </div>
        </div>
      );
    }

    const currentQuestionData = questions[currentQuestion];
    const currentAnswers = answers[currentQuestion];
    const canProceed = currentAnswers.length === 5;

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-indigo-100">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-800">
                Pergunta {currentQuestion + 1} de 4
              </h1>
              <div className="text-sm text-gray-600">
                {Math.round(((currentQuestion + 1) / 4) * 100)}% concluído
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / 4) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border border-indigo-100">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {currentQuestionData.title}
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              {currentQuestionData.subtitle}
            </p>
            
            <div className="mb-6">
              {currentAnswers.length === 5 ? (
                <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-xl">
                  <p className="text-green-700 font-semibold">
                    ✅ Perfeito! Você selecionou exatamente 5 opções.
                  </p>
                </div>
              ) : currentAnswers.length < 5 ? (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-xl">
                  <p className="text-blue-700 font-semibold">
                    📌 Selecione {5 - currentAnswers.length} opção(ões) para continuar.
                  </p>
                </div>
              ) : (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-xl">
                  <p className="text-red-700 font-semibold">
                    ⚠️ Você já marcou 5 opções. Para escolher uma nova, desmarque uma das anteriores.
                  </p>
                </div>
              )}
              
              <div className="mt-2 text-sm text-gray-600">
                Selecionadas: {currentAnswers.length}/5
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {currentQuestionData.options.map((option, index) => {
                const isSelected = currentAnswers.includes(index);
                return (
                  <button
                    key={index}
                    onClick={() => handleOptionClick(index)}
                    className={`p-4 rounded-xl text-left transition-all duration-200 border-2 flex items-center ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-800 shadow-md'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300'
                    }`}
                  >
                    <div className="mr-3">
                      {isSelected ? (
                        <CheckCircle2 className="w-6 h-6 text-indigo-600" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <span className="text-sm font-medium leading-relaxed">{option}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-indigo-100">
            <div className="flex justify-between items-center">
              <button
                onClick={prevQuestion}
                disabled={currentQuestion === 0}
                className={`flex items-center px-6 py-3 rounded-full font-semibold transition-all duration-200 ${
                  currentQuestion === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 shadow-md hover:shadow-lg'
                }`}
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Anterior
              </button>

              <button
                onClick={nextQuestion}
                disabled={!canProceed}
                className={`flex items-center px-6 py-3 rounded-full font-semibold transition-all duration-200 ${
                  canProceed
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {currentQuestion === 3 ? 'Finalizar' : 'Próxima'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Componente de Sucesso
  const SucessoComponent = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 border border-indigo-100">
        <div className="text-center">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">🎉 Propósito Enviado com Sucesso!</h2>
          
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 mb-8">
            <h3 className="text-xl font-semibold text-indigo-800 mb-4">Obrigado, {userInfo.nome}!</h3>
            <p className="text-gray-700 mb-4">
              Suas respostas foram enviadas com sucesso para análise da equipe de RH.
            </p>
            <p className="text-sm text-gray-600">
              Em breve você receberá um retorno sobre seu perfil e recomendações personalizadas.
            </p>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-xl mb-8">
            <p className="text-gray-700 text-center">
              <strong>Lembre-se:</strong> Este processo é uma ferramenta de autoconhecimento e desenvolvimento profissional.
            </p>
          </div>

          <button
            onClick={resetFormulario}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-full text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Realizar Novo Teste
          </button>
        </div>
      </div>
    </div>
  );

  // Funções de Download
  const downloadIndividual = (usuario) => {
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
${usuario.respostas[0].map(index => `• ${caracteristicas[index]}`).join('\n')}

Pergunta 2 - Como você se vê:
${usuario.respostas[1].map(index => `• ${caracteristicas[index]}`).join('\n')}

Pergunta 3 - Frases importantes:
${usuario.respostas[2].map(index => `• ${frasesVida[index]}`).join('\n')}

Pergunta 4 - Valores importantes:
${usuario.respostas[3].map(index => `• ${valores[index]}`).join('\n')}

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
  const DashboardComponent = () => {
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
                onClick={() => setCurrentView('login')}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Voltar ao Login
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {!usuarioSelecionado ? (
            <div>
              {/* Botão de Download Consolidado */}
              <div className="mb-6">
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
                
                {usuarios.length === 0 ? (
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
  };

  // Renderização principal
  if (currentView === 'login') {
    return <LoginComponent />;
  } else if (currentView === 'formulario') {
    return <FormularioComponent />;
  } else if (currentView === 'sucesso') {
    return <SucessoComponent />;
  } else if (currentView === 'dashboard') {
    return <DashboardComponent />;
  }

  return null;
};

export default SistemaProposito;
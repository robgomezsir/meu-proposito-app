import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, ArrowRight, ArrowLeft, Clock, User, FileText } from 'lucide-react';
import { receberScore } from '../api/rh-integration';

const QuestionarioIntegrado = ({ sessionId }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([[], [], [], []]);
  const [userInfo, setUserInfo] = useState({ nome: '', email: '' });
  const [showWelcome, setShowWelcome] = useState(true);
  const [startTime, setStartTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [candidatoData, setCandidatoData] = useState(null);

  // Dados do questionário
  const questions = [
    {
      title: "Propósito e Valores",
      questions: [
        "Qual é o seu propósito principal na vida?",
        "Quais valores são mais importantes para você?",
        "Como você gostaria de impactar o mundo?",
        "O que te motiva a acordar todos os dias?"
      ]
    },
    {
      title: "Habilidades e Competências",
      questions: [
        "Quais são suas principais habilidades técnicas?",
        "Como você se comunica em equipe?",
        "Como você lida com desafios e pressão?",
        "Qual é sua abordagem para resolver problemas?"
      ]
    },
    {
      title: "Experiência e Crescimento",
      questions: [
        "Descreva uma experiência profissional marcante",
        "Como você busca se desenvolver continuamente?",
        "Qual foi seu maior aprendizado profissional?",
        "Como você se vê daqui a 5 anos?"
      ]
    },
    {
      title: "Cultura e Ambiente",
      questions: [
        "Que tipo de ambiente de trabalho você prefere?",
        "Como você contribui para a cultura da empresa?",
        "Qual é sua abordagem para feedback?",
        "Como você promove colaboração em equipe?"
      ]
    }
  ];

  // Carregar dados do candidato ao inicializar
  useEffect(() => {
    if (sessionId) {
      carregarDadosCandidato();
    }
  }, [sessionId]);

  // Carregar dados do candidato pela sessão
  const carregarDadosCandidato = async () => {
    try {
      setLoading(true);
      // Aqui você faria uma chamada para buscar os dados do candidato
      // Por enquanto, vamos simular
      setCandidatoData({
        nome: 'Candidato',
        email: 'candidato@email.com',
        vaga: 'Desenvolvedor',
        empresa: 'Empresa'
      });
    } catch (error) {
      setError('Erro ao carregar dados do candidato');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  // Iniciar questionário
  const iniciarQuestionario = () => {
    setShowWelcome(false);
    setStartTime(Date.now());
  };

  // Navegar entre questões
  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Atualizar respostas
  const updateAnswer = (questionIndex, value) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion][questionIndex] = value;
    setAnswers(newAnswers);
  };

  // Finalizar questionário
  const finalizarQuestionario = async () => {
    try {
      setLoading(true);
      
      // Calcular tempo de resposta
      const tempoResposta = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;
      
      // Calcular score baseado nas respostas
      const scoreData = calcularScore();
      
      // Enviar score para a API
      const resultado = await receberScore(sessionId, {
        ...scoreData,
        tempoResposta,
        respostas: answers
      });
      
      console.log('✅ Questionário finalizado com sucesso!', resultado);
      
      // Redirecionar para tela de sucesso
      window.location.href = `/sucesso/${sessionId}`;
      
    } catch (error) {
      setError('Erro ao finalizar questionário');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calcular score baseado nas respostas
  const calcularScore = () => {
    let totalScore = 0;
    let totalQuestions = 0;
    
    answers.forEach((sectionAnswers, sectionIndex) => {
      sectionAnswers.forEach((answer, questionIndex) => {
        if (answer && answer.trim() !== '') {
          // Score baseado no comprimento e qualidade da resposta
          const length = answer.length;
          let score = 0;
          
          if (length < 20) score = 1;
          else if (length < 50) score = 2;
          else if (length < 100) score = 3;
          else if (length < 200) score = 4;
          else score = 5;
          
          totalScore += score;
          totalQuestions++;
        }
      });
    });
    
    const score = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 20) : 0;
    const percentual = totalQuestions > 0 ? Math.round((totalScore / (totalQuestions * 5)) * 100) : 0;
    
    // Determinar categoria baseada no score
    let categoria = 'Baixo';
    if (score >= 80) categoria = 'Excelente';
    else if (score >= 60) categoria = 'Bom';
    else if (score >= 40) categoria = 'Regular';
    
    return {
      score,
      percentual,
      categoria,
      detalhes: {
        totalRespostas: totalQuestions,
        respostasCompletas: answers.flat().filter(a => a && a.trim() !== '').length,
        tempoMedio: 0
      }
    };
  };

  // Verificar se pode avançar
  const canAdvance = () => {
    const currentAnswers = answers[currentQuestion];
    return currentAnswers && currentAnswers.every(answer => answer && answer.trim() !== '');
  };

  // Verificar se pode finalizar
  const canFinish = () => {
    return answers.every(section => 
      section.every(answer => answer && answer.trim() !== '')
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Carregando questionário...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Erro</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  if (showWelcome) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 border border-indigo-100">
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-6">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Questionário de Propósito</h1>
            <p className="text-gray-600">Complete o questionário para continuar no processo seletivo</p>
          </div>

          {candidatoData && (
            <div className="bg-indigo-50 rounded-xl p-6 mb-6">
              <h2 className="text-lg font-semibold text-indigo-800 mb-3">Informações do Candidato</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Nome:</span>
                  <p className="text-gray-600">{candidatoData.nome}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Vaga:</span>
                  <p className="text-gray-600">{candidatoData.vaga}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Email:</span>
                  <p className="text-gray-600">{candidatoData.email}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Empresa:</span>
                  <p className="text-gray-600">{candidatoData.empresa}</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-blue-50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">Instruções</h3>
            <ul className="text-sm text-blue-700 space-y-2">
              <li>• O questionário tem 4 seções com 4 perguntas cada</li>
              <li>• Responda todas as perguntas de forma detalhada</li>
              <li>• Você pode navegar entre as seções</li>
              <li>• O tempo será registrado para análise</li>
            </ul>
          </div>

          <button
            onClick={iniciarQuestionario}
            className="w-full py-4 rounded-xl text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
          >
            Iniciar Questionário
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-indigo-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Questionário de Propósito</h1>
              <p className="text-gray-600">Seção {currentQuestion + 1} de {questions.length}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-600">
                <Clock className="w-5 h-5 mr-2" />
                <span>{startTime ? Math.round((Date.now() - startTime) / 1000) : 0}s</span>
              </div>
              <div className="flex items-center text-gray-600">
                <User className="w-5 h-5 mr-2" />
                <span>{candidatoData?.nome || 'Candidato'}</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-indigo-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {questions[currentQuestion].title}
          </h2>

          <div className="space-y-6">
            {questions[currentQuestion].questions.map((question, index) => (
              <div key={index} className="space-y-3">
                <label className="block text-lg font-medium text-gray-700">
                  {index + 1}. {question}
                </label>
                <textarea
                  value={answers[currentQuestion][index] || ''}
                  onChange={(e) => updateAnswer(index, e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  rows="4"
                  placeholder="Digite sua resposta aqui..."
                />
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                currentQuestion === 0
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Anterior
            </button>

            <div className="flex space-x-3">
              {Array.from({ length: questions.length }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentQuestion(i)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    i === currentQuestion
                      ? 'bg-indigo-600'
                      : i < currentQuestion
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {currentQuestion < questions.length - 1 ? (
              <button
                onClick={nextQuestion}
                disabled={!canAdvance()}
                className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  canAdvance()
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                Próxima
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            ) : (
              <button
                onClick={finalizarQuestionario}
                disabled={!canFinish() || loading}
                className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  canFinish() && !loading
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Finalizando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Finalizar
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionarioIntegrado;


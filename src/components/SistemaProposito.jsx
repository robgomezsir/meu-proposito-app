import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { CheckCircle2, Circle, ArrowRight, ArrowLeft, User, FileText, BarChart3, Heart, Users, TrendingUp, UserCheck, Eye, Trash2, Mail } from 'lucide-react';
import { adicionarUsuario, buscarUsuarios, deletarTodosUsuarios, verificarCPFExistente } from '../firebase/services';
import { testarConexaoFirebase, limparDadosTeste } from '../firebase/test-connection';
import RegistrationForm from './RegistrationForm';
import QuestionnaireLayout from './QuestionnaireLayout';
import SuccessScreen from './SuccessScreen';

const SistemaProposito = () => {
  const [currentView, setCurrentView] = useState('formulario');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([[], [], [], []]);
  const [userInfo, setUserInfo] = useState({ nome: '', cpf: '' });
  const [usuarios, setUsuarios] = useState([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [rhEmail, setRhEmail] = useState('');
  const [isRhAuthenticated, setIsRhAuthenticated] = useState(false);
  const [carregandoUsuarios, setCarregandoUsuarios] = useState(false);
  const [dadosEnviados, setDadosEnviados] = useState(false);

  // Refs para controle de foco
  const nomeInputRef = useRef(null);
  const cpfInputRef = useRef(null);

  // Arrays e objetos memoizados para evitar recriações
  const caracteristicas = useMemo(() => [
    'receptiva', 'feliz', 'tranquila', 'energética', 'criativa', 'analítica', 'intuitiva', 'prática',
    'sociável', 'introspectiva', 'organizada', 'flexível', 'determinada', 'adaptável', 'paciente', 'dinâmica'
  ], []);

  const frasesVida = useMemo(() => [
    'A vida é uma jornada de descobertas', 'Cada dia é uma nova oportunidade', 'A felicidade está nas pequenas coisas',
    'O sucesso vem da persistência', 'A mudança é a única constante', 'Aprender é crescer', 'Compartilhar é viver',
    'Sonhar é o primeiro passo', 'A gratidão transforma tudo', 'A simplicidade é a sofisticação', 'A coragem supera o medo',
    'A paciência é uma virtude', 'A honestidade é a melhor política', 'A humildade abre portas', 'A fé move montanhas',
    'O amor é a resposta'
  ], []);

  const valores = useMemo(() => [
    'honestidade', 'respeito', 'responsabilidade', 'compromisso', 'excelência', 'inovação', 'colaboração', 'integridade',
    'transparência', 'sustentabilidade', 'diversidade', 'inclusão', 'empatia', 'resiliência', 'criatividade', 'confiança'
  ], []);

  const pesosCaracteristicas = useMemo(() => ({
    'receptiva': 0.8, 'feliz': 0.9, 'tranquila': 0.7, 'energética': 0.8, 'criativa': 0.9, 'analítica': 0.8,
    'intuitiva': 0.7, 'prática': 0.8, 'sociável': 0.8, 'introspectiva': 0.7, 'organizada': 0.8, 'flexível': 0.7,
    'determinada': 0.9, 'adaptável': 0.8, 'paciente': 0.7, 'dinâmica': 0.8
  }), []);

  const pesosFrases = useMemo(() => ({
    'A vida é uma jornada de descobertas': 0.9, 'Cada dia é uma nova oportunidade': 0.8, 'A felicidade está nas pequenas coisas': 0.9,
    'O sucesso vem da persistência': 0.8, 'A mudança é a única constante': 0.7, 'Aprender é crescer': 0.8,
    'Compartilhar é viver': 0.8, 'Sonhar é o primeiro passo': 0.9, 'A gratidão transforma tudo': 0.9,
    'A simplicidade é a sofisticação': 0.8, 'A coragem supera o medo': 0.9, 'A paciência é uma virtude': 0.7,
    'A honestidade é a melhor política': 0.8, 'A humildade abre portas': 0.8, 'A fé move montanhas': 0.8,
    'O amor é a resposta': 0.9
  }), []);

  const pesosValores = useMemo(() => ({
    'honestidade': 0.9, 'respeito': 0.9, 'responsabilidade': 0.8, 'compromisso': 0.8, 'excelência': 0.8,
    'inovação': 0.8, 'colaboração': 0.8, 'integridade': 0.9, 'transparência': 0.8, 'sustentabilidade': 0.7,
    'diversidade': 0.8, 'inclusão': 0.8, 'empatia': 0.8, 'resiliência': 0.8, 'criatividade': 0.8, 'confiança': 0.9
  }), []);

  const questions = useMemo(() => [
    {
      title: 'Características Pessoais',
      description: 'Selecione as 5 características que melhor descrevem você:',
      options: caracteristicas,
      weights: pesosCaracteristicas
    },
    {
      title: 'Frases de Vida',
      description: 'Escolha as 5 frases que mais ressoam com sua visão de vida:',
      options: frasesVida,
      weights: pesosFrases
    },
    {
      title: 'Valores Fundamentais',
      description: 'Selecione os 5 valores que você considera mais importantes:',
      options: valores,
      weights: pesosValores
    },
    {
      title: 'Objetivos Profissionais',
      description: 'Escolha as 5 características que você mais valoriza no ambiente profissional:',
      options: [...caracteristicas, ...valores],
      weights: { ...pesosCaracteristicas, ...pesosValores }
    }
  ], [caracteristicas, frasesVida, valores, pesosCaracteristicas, pesosFrases, pesosValores]);

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
  const formatarCPF = useCallback((valor) => {
    const somenteDigitos = valor.replace(/\D/g, '');
    
    if (somenteDigitos.length <= 11) {
      return somenteDigitos
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2');
    }
    return somenteDigitos.slice(0, 11)
      .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }, []);

  // Validação básica de CPF
  const validarCPF = useCallback((cpf) => {
    const somenteDigitos = cpf.replace(/\D/g, '');
    
    if (somenteDigitos.length !== 11) return false;
    
    if (/^(\d)\1{10}$/.test(somenteDigitos)) return false;
    
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(somenteDigitos.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(somenteDigitos.charAt(9))) return false;
    
    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(somenteDigitos.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(somenteDigitos.charAt(10))) return false;
    
    return true;
  }, []);

  // Validação básica de nome
  const validarNome = useCallback((nome) => {
    return nome.trim().length >= 3 && /^[a-zA-ZÀ-ÿ\s]+$/.test(nome.trim());
  }, []);

  // Manipular mudanças nos inputs
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({ ...prev, [name]: value }));
  }, []);

  // Submissão do formulário
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validarNome(userInfo.nome)) {
      alert('Por favor, insira um nome válido (mínimo 3 caracteres, apenas letras e espaços).');
      return;
    }
    
    if (!validarCPF(userInfo.cpf)) {
      alert('Por favor, insira um CPF válido.');
      return;
    }
    
    // Verificar se CPF já existe
    try {
      const cpfExiste = await verificarCPFExistente(userInfo.cpf);
      if (cpfExiste) {
        alert('Este CPF já foi cadastrado. Por favor, use um CPF diferente.');
        return;
      }
    } catch (error) {
      console.error('Erro ao verificar CPF:', error);
      alert('Erro ao verificar CPF. Tente novamente.');
      return;
    }
    
    setShowWelcome(false);
    setCurrentView('questionario');
  }, [userInfo, validarNome, validarCPF]);

  // Acesso RH
  const handleRhAccess = useCallback(() => {
    const email = prompt('Digite seu email de RH para acesso:');
    if (email && email.includes('@')) {
      setRhEmail(email);
      setIsRhAuthenticated(true);
      setCurrentView('dashboard');
    } else {
      alert('Email inválido. Acesso negado.');
    }
  }, []);

  // Função para salvar dados no Firebase
  const salvarDados = useCallback(async () => {
    try {
      const usuarioCompleto = {
        ...userInfo,
        answers,
        timestamp: new Date().toISOString(),
        score: calcularScore()
      };
      
      await adicionarUsuario(usuarioCompleto);
      console.log('✅ Usuário salvo com sucesso no Firebase');
      
      // Atualizar estado local
      setUsuarios(prev => [...prev, usuarioCompleto]);
      setDadosEnviados(true);
      
      return true;
    } catch (error) {
      console.error('❌ Erro ao salvar usuário:', error);
      alert('Erro ao salvar dados. Tente novamente.');
      return false;
    }
  }, [userInfo, answers]);

  // Função para exportar backup (download de arquivo)
  const exportarBackup = useCallback(() => {
    const dataStr = JSON.stringify(usuarios, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup-usuarios-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [usuarios]);

  // Função para download individual
  const downloadIndividual = useCallback((usuario) => {
    const dataStr = JSON.stringify(usuario, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `usuario-${usuario.nome}-${usuario.cpf}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, []);

  // Calcular score baseado nas respostas
  const calcularScore = useCallback(() => {
    let totalScore = 0;
    let totalWeight = 0;
    
    answers.forEach((answerArray, questionIndex) => {
      const question = questions[questionIndex];
      answerArray.forEach(selectedOption => {
        const weight = question.weights[selectedOption] || 0;
        totalScore += weight;
        totalWeight += weight;
      });
    });
    
    return totalWeight > 0 ? (totalScore / totalWeight) * 100 : 0;
  }, [answers, questions]);

  // Renderizar componente de sucesso
  const SucessoComponent = useCallback(() => (
    <SuccessScreen
      userInfo={userInfo}
      answers={answers}
      score={calcularScore()}
      onExportarBackup={salvarDados}
      onVoltar={() => {
        setCurrentView('formulario');
        setUserInfo({ nome: '', cpf: '' });
        setAnswers([[], [], [], []]);
        setCurrentQuestion(0);
        setShowWelcome(true);
        setDadosEnviados(false);
      }}
    />
  ), [userInfo, answers, salvarDados]);

  // Renderizar dashboard RH
  const DashboardRH = useCallback(() => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Dashboard RH</h1>
              <p className="text-gray-600">Acesso autorizado para: {rhEmail}</p>
            </div>
            <button
              onClick={() => {
                setIsRhAuthenticated(false);
                setRhEmail('');
                setCurrentView('formulario');
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Sair
            </button>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-800">{usuarios.length}</p>
                <p className="text-gray-600">Total de Usuários</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {usuarios.length > 0 ? Math.round(usuarios.reduce((acc, user) => acc + (user.score || 0), 0) / usuarios.length) : 0}%
                </p>
                <p className="text-gray-600">Score Médio</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <UserCheck className="w-8 h-8 text-purple-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {usuarios.filter(user => user.score >= 80).length}
                </p>
                <p className="text-gray-600">Alto Score (≥80%)</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-orange-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {usuarios.filter(user => user.score < 60).length}
                </p>
                <p className="text-gray-600">Baixo Score (&lt;60%)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de usuários */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Usuários Cadastrados</h2>
            <div className="flex gap-3">
              <button
                onClick={exportarBackup}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Mail className="w-4 h-4 mr-2" />
                Exportar Backup
              </button>
              <button
                onClick={async () => {
                  if (confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
                    try {
                      await deletarTodosUsuarios();
                      setUsuarios([]);
                      alert('Todos os dados foram removidos com sucesso.');
                    } catch (error) {
                      alert('Erro ao remover dados: ' + error.message);
                    }
                  }
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Limpar Todos
              </button>
            </div>
          </div>

          {carregandoUsuarios ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Carregando usuários...</p>
            </div>
          ) : usuarios.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhum usuário cadastrado ainda.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Nome</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">CPF</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Score</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Data</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((usuario, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-800">{usuario.nome}</td>
                      <td className="py-3 px-4 text-gray-600">{usuario.cpf}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          (usuario.score || 0) >= 80 ? 'bg-green-100 text-green-800' :
                          (usuario.score || 0) >= 60 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {Math.round(usuario.score || 0)}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(usuario.timestamp).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => downloadIndividual(usuario)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            title="Download individual"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Ferramentas de teste */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Ferramentas de Teste</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={async () => {
                try {
                  const resultado = await testarConexaoFirebase();
                  alert(`Teste de conexão: ${resultado ? 'Sucesso' : 'Falha'}`);
                } catch (error) {
                  alert('Erro no teste: ' + error.message);
                }
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Testar Conexão Firebase
            </button>
            <button
              onClick={async () => {
                try {
                  await limparDadosTeste();
                  setUsuarios([]);
                  alert('Dados de teste removidos com sucesso!');
                } catch (error) {
                  alert('Erro ao limpar dados: ' + error.message);
                }
              }}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Limpar Dados de Teste
            </button>
          </div>
        </div>
      </div>
    </div>
  ), [rhEmail, usuarios, carregandoUsuarios, exportarBackup, downloadIndividual]);

  // Renderização condicional baseada na view atual
  if (currentView === 'dashboard' && isRhAuthenticated) {
    return <DashboardRH />;
  }

  if (currentView === 'questionario') {
    return (
      <QuestionnaireLayout
        questions={questions}
        currentQuestion={currentQuestion}
        answers={answers}
        setAnswers={setAnswers}
        setCurrentQuestion={setCurrentQuestion}
        onComplete={() => setCurrentView('sucesso')}
        onBack={() => setCurrentView('formulario')}
      />
    );
  }

  if (currentView === 'sucesso') {
    return <SucessoComponent />;
  }

  // View padrão: formulário de cadastro
  return (
    <RegistrationForm
      userInfo={userInfo}
      onInputChange={handleInputChange}
      onSubmit={handleSubmit}
      onRhAccess={handleRhAccess}
      validarNome={validarNome}
      validarCPF={validarCPF}
      formatarCPF={formatarCPF}
    />
  );
};

export default SistemaProposito;
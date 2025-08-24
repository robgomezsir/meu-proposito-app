import React, { useState, useRef, useEffect, useCallback } from 'react';
import { User, FileText, Eye } from 'lucide-react';

const RegistrationForm = ({ 
  userInfo, 
  onInputChange, 
  onSubmit, 
  onRhAccess,
  validarNome, 
  validarCPF, 
  formatarCPF 
}) => {
  const [showWelcome, setShowWelcome] = useState(true);
  
  // Refs para controle de foco
  const nomeInputRef = useRef(null);
  const cpfInputRef = useRef(null);

  // Auto-focus no primeiro input quando o componente carrega
  useEffect(() => {
    if (showWelcome && nomeInputRef.current) {
      nomeInputRef.current.focus();
    }
  }, [showWelcome]);

  // Formatação automática do CPF - usando useCallback para evitar re-renders
  const formatarCPFLocal = useCallback((valor) => {
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
  }, []);

  // Validação básica de CPF
  const validarCPFLocal = useCallback((cpf) => {
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
  }, []);

  // Validação de nome
  const validarNomeLocal = useCallback((nome) => {
    const nomeFormatado = nome.trim();
    return nomeFormatado.length >= 2 && /^[a-zA-ZÀ-ÿ\s]+$/.test(nomeFormatado) && nomeFormatado.split(' ').length >= 2;
  }, []);

  // Função para atualizar campos do usuário - usando useCallback
  const handleInputChangeLocal = useCallback((e) => {
    const { name, value } = e.target;
    
    if (name === 'cpf') {
      // Aplicar formatação do CPF sem causar re-render desnecessário
      const cpfFormatado = formatarCPFLocal(value);
      onInputChange({ target: { name, value: cpfFormatado } });
    } else {
      onInputChange({ target: { name, value } });
    }
  }, [formatarCPFLocal, onInputChange]);

  // Função para iniciar o questionário
  const iniciarQuestionarioLocal = useCallback((e) => {
    e?.preventDefault?.();
    
    // Verificar se os campos estão preenchidos e válidos
    if (!validarNomeLocal(userInfo.nome) || !validarCPFLocal(userInfo.cpf)) {
      alert('Por favor, preencha todos os campos obrigatórios corretamente.');
      return;
    }
    
    console.log('Iniciando questionário com:', userInfo);
    onSubmit(e);
  }, [userInfo, validarNomeLocal, validarCPFLocal, onSubmit]);

  const handleRhAccessLocal = useCallback(() => {
    console.log('Acessando dashboard RH');
    onRhAccess();
  }, [onRhAccess]);

  // Verificação em tempo real dos campos
  const nomeValido = validarNomeLocal(userInfo.nome);
  const cpfValido = validarCPFLocal(userInfo.cpf);
  const podeEnviar = nomeValido && cpfValido;

  // Handler para Enter key
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && podeEnviar) {
      iniciarQuestionarioLocal();
    }
  }, [podeEnviar, iniciarQuestionarioLocal]);

  if (!showWelcome) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-indigo-100">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Questionário Iniciado!</h2>
            <p className="text-gray-600 mb-6">Dados cadastrados com sucesso.</p>
            <p><strong>Nome:</strong> {userInfo.nome}</p>
            <p><strong>CPF:</strong> {userInfo.cpf}</p>
            <button 
              onClick={() => setShowWelcome(true)}
              className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Voltar ao Formulário
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl border border-indigo-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6 text-white">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
              <FileText className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Análise de Propósito</h1>
            <p className="text-blue-100">Sistema de Avaliação Comportamental</p>
          </div>
        </div>

        {/* Formulário */}
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Bem-vindo!</h2>
            <p className="text-gray-600">Para começar, precisamos de algumas informações básicas</p>
          </div>

          <div className="space-y-6" onKeyPress={handleKeyPress}>
            {/* Campo Nome */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nome Completo *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  ref={nomeInputRef}
                  type="text"
                  name="nome"
                  value={userInfo.nome}
                  onChange={handleInputChangeLocal}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                    userInfo.nome && !nomeValido 
                      ? 'border-red-300 bg-red-50' 
                      : userInfo.nome && nomeValido 
                      ? 'border-green-300 bg-green-50' 
                      : 'border-gray-300'
                  }`}
                  placeholder="Digite seu nome completo"
                  autoComplete="name"
                />
                {userInfo.nome && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {nomeValido ? (
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    ) : (
                      <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">!</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {userInfo.nome && !nomeValido && (
                <p className="text-red-600 text-sm mt-1">
                  Digite seu nome completo (nome e sobrenome)
                </p>
              )}
            </div>

            {/* Campo CPF */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                CPF *
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  ref={cpfInputRef}
                  type="text"
                  name="cpf"
                  value={userInfo.cpf}
                  onChange={handleInputChangeLocal}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                    userInfo.cpf && !cpfValido 
                      ? 'border-red-300 bg-red-50' 
                      : userInfo.cpf && cpfValido 
                      ? 'border-green-300 bg-green-50' 
                      : 'border-gray-300'
                  }`}
                  placeholder="000.000.000-00"
                  maxLength="14"
                  autoComplete="off"
                />
                {userInfo.cpf && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {cpfValido ? (
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    ) : (
                      <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">!</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {userInfo.cpf && !cpfValido && (
                <p className="text-red-600 text-sm mt-1">
                  CPF inválido. Verifique os números digitados.
                </p>
              )}
            </div>

            {/* Botões */}
            <div className="space-y-4 pt-4">
              <button
                onClick={iniciarQuestionarioLocal}
                disabled={!podeEnviar}
                className={`w-full py-4 rounded-xl text-lg font-semibold transition-all duration-200 transform ${
                  podeEnviar
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-1'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {podeEnviar ? 'Iniciar Questionário' : 'Preencha todos os campos'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleRhAccessLocal}
                  className="inline-flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors duration-200"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Acesso Dashboard RH
                </button>
              </div>
            </div>
          </div>

          {/* Informações de Privacidade */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              ✓ Seus dados são protegidos e utilizados apenas para análise comportamental
              <br />
              ✓ As informações são armazenadas com segurança
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;

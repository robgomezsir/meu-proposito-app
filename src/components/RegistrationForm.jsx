import React, { useRef, useEffect, memo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { User, FileText, Heart, Sparkles, Shield, Clock } from 'lucide-react';

// Componente memoizado para evitar re-renderizações desnecessárias
const RegistrationForm = memo(({ 
  userInfo, 
  onInputChange, 
  onSubmit, 
  onRhAccess,
  validarNome, 
  validarCPF, 
  formatarCPF 
}) => {
  // Refs para controle de foco
  const nomeInputRef = useRef(null);
  const cpfInputRef = useRef(null);

  // Auto-focus no campo nome ao carregar
  useEffect(() => {
    if (nomeInputRef.current) {
      nomeInputRef.current.focus();
    }
  }, []); // Array vazio garante que execute apenas uma vez

  // Validação simples e estática
  const isFormValid = userInfo.nome.trim() !== '' && userInfo.cpf.trim() !== '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Card Principal */}
        <Card className="glass-effect hover-lift shadow-2xl border-0">
          {/* Header com gradiente */}
          <CardHeader className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white rounded-t-xl p-8 md:p-12">
            <div className="text-center">
              <div className="mx-auto w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 shadow-lg">
                <Heart className="w-12 h-12 text-white" />
              </div>
              <CardTitle className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">
                Questionário de Autopercepção
              </CardTitle>
              <p className="text-xl text-blue-100 font-medium">
                Identificação do Participante
              </p>
            </div>
          </CardHeader>

          {/* Conteúdo do formulário */}
          <CardContent className="p-8 md:p-12">
            {/* Formulário de Cadastro */}
            <div className="max-w-2xl mx-auto mb-8">
              <form onSubmit={onSubmit} className="space-y-6">
                {/* Campo Nome */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Nome Completo *
                  </label>
                  <div className="relative">
                    <Input
                      ref={nomeInputRef}
                      type="text"
                      value={userInfo.nome}
                      onChange={onInputChange}
                      name="nome"
                      className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl transition-all duration-200 bg-gray-50/50 hover:bg-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Ex: João Silva Santos"
                      autoComplete="name"
                    />
                  </div>
                </div>
                
                {/* Campo CPF */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    CPF *
                  </label>
                  <div className="relative">
                    <Input
                      ref={cpfInputRef}
                      type="text"
                      value={userInfo.cpf}
                      onChange={(e) => {
                        const valorFormatado = formatarCPF(e.target.value);
                        onInputChange({ target: { name: 'cpf', value: valorFormatado } });
                      }}
                      name="cpf"
                      className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl transition-all duration-200 bg-gray-50/50 hover:bg-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="000.000.000-00"
                      autoComplete="off"
                      maxLength="14"
                    />
                  </div>
                </div>

                {/* Botão de envio */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    variant="gradient"
                    size="xl"
                    disabled={!isFormValid}
                    className="w-full shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                  >
                    {isFormValid ? (
                      <>
                        <span className="mr-2">→</span>
                        Começar Questionário
                      </>
                    ) : (
                      'Preencha todos os campos obrigatórios'
                    )}
                  </Button>
                </div>
              </form>
            </div>

            {/* Instruções com design melhorado */}
            <div className="max-w-3xl mx-auto mb-8">
              <Card className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-indigo-100/50">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800 text-center flex items-center justify-center">
                    <Sparkles className="w-6 h-6 mr-2 text-indigo-600" />
                    📋 Instruções Importantes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start group hover:bg-white/50 rounded-xl p-4 transition-colors duration-200">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4 group-hover:bg-blue-200 transition-colors duration-200">
                          <span className="text-xl">👉</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">4 Perguntas Simples</p>
                          <p className="text-sm text-gray-600 mt-1">Este teste é baseado em questões objetivas e diretas.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start group hover:bg-white/50 rounded-xl p-4 transition-colors duration-200">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4 group-hover:bg-green-200 transition-colors duration-200">
                          <span className="text-xl">✨</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Seja Autêntico</p>
                          <p className="text-sm text-gray-600 mt-1">Não há respostas certas ou erradas. Seja você mesmo!</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start group hover:bg-white/50 rounded-xl p-4 transition-colors duration-200">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-4 group-hover:bg-purple-200 transition-colors duration-200">
                          <span className="text-xl">📌</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">5 Opções por Pergunta</p>
                          <p className="text-sm text-gray-600 mt-1">Escolha exatamente 5 alternativas em cada questão.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start group hover:bg-white/50 rounded-xl p-4 transition-colors duration-200">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-4 group-hover:bg-orange-200 transition-colors duration-200">
                          <span className="text-xl">🔄</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Mudança de Opções</p>
                          <p className="text-sm text-gray-600 mt-1">Você pode alterar suas escolhas antes de prosseguir.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Botões de ação */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Button
                variant="outline"
                size="lg"
                onClick={onRhAccess}
                className="flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Shield className="w-5 h-5 mr-2" />
                Acesso RH
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Rodapé com informações adicionais */}
        <div className="text-center mt-8">
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-1" />
              <span>Suas informações são seguras</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>Processo rápido e simples</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// Adicionar displayName para debugging
RegistrationForm.displayName = 'RegistrationForm';

export default RegistrationForm;

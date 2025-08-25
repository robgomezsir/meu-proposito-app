import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { CheckCircle2, Heart, Sparkles, Shield, RefreshCw } from 'lucide-react';

const SuccessScreen = ({ 
  userName, 
  onResetFormulario 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Card className="glass-effect hover-lift shadow-2xl border-0 overflow-hidden">
          {/* Header com gradiente */}
          <CardHeader className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 text-white text-center p-8">
            <div className="mx-auto w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 shadow-lg animate-bounce-in">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold mb-2">
              🎉 Avaliação Concluída com Sucesso!
            </CardTitle>
            <p className="text-green-100 text-lg">
              Obrigado por participar da avaliação de propósito
            </p>
          </CardHeader>
          
          <CardContent className="p-8">
            {/* Mensagem de agradecimento */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 mb-6 border border-indigo-100/50">
              <h3 className="text-xl font-semibold text-indigo-800 mb-3 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-indigo-600" />
                Obrigado, {userName}!
              </h3>
              <p className="text-gray-700 mb-3 leading-relaxed">
                Suas respostas foram enviadas com sucesso para análise da equipe de RH.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Em breve você receberá um retorno sobre seu perfil e recomendações personalizadas.
              </p>
            </div>

            {/* Confirmação de envio */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <CheckCircle2 className="w-8 h-8 text-green-600 mr-3" />
                <span className="text-lg font-semibold text-green-800">
                  ✅ Dados Enviados com Sucesso!
                </span>
              </div>
              <p className="text-green-700 text-sm">
                Sua avaliação foi salva no sistema e está sendo processada pela equipe de RH.
              </p>
            </div>

            {/* Lembrete importante */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-xl mb-6">
              <div className="flex items-start">
                <Sparkles className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-700 font-medium mb-1">
                    <strong>Lembre-se:</strong>
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Este processo é uma ferramenta de autoconhecimento e desenvolvimento profissional.
                  </p>
                </div>
              </div>
            </div>

            {/* Botão para nova avaliação */}
            <div className="text-center mb-6">
              <Button
                variant="outline"
                size="lg"
                onClick={onResetFormulario}
                className="flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              >
                <RefreshCw className="w-5 h-5" />
                <span>🔄 Fazer Nova Avaliação</span>
              </Button>
            </div>

            {/* Informações adicionais */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center text-blue-800 text-sm">
                <Shield className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>
                  <strong>Segurança:</strong> Suas informações são protegidas e confidenciais
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rodapé */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Sistema de Análise de Propósito • Desenvolvido com ❤️
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessScreen;

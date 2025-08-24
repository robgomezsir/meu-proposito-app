import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { CheckCircle2, Circle, ArrowRight, ArrowLeft, Heart } from 'lucide-react';

const QuestionnaireLayout = ({ 
  currentQuestion, 
  totalQuestions, 
  title, 
  subtitle, 
  options, 
  selectedOptions, 
  onOptionClick, 
  onNext, 
  onPrevious, 
  canProceed 
}) => {
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header com Progresso */}
        <Card className="mb-6 glass-effect hover-lift">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-gray-800">
                    Pergunta {currentQuestion + 1} de {totalQuestions}
                  </CardTitle>
                  <p className="text-gray-600 text-sm">
                    {Math.round(progress)}% concluído
                  </p>
                </div>
              </div>
              <Badge variant="secondary" size="lg">
                {currentQuestion + 1}/{totalQuestions}
              </Badge>
            </div>
            
            {/* Barra de Progresso */}
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </CardHeader>
        </Card>

        {/* Pergunta */}
        <Card className="mb-6 glass-effect hover-lift">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
              {title}
            </CardTitle>
            <p className="text-lg text-gray-600">
              {subtitle}
            </p>
          </CardHeader>
          
          <CardContent>
            {/* Status da Seleção */}
            <div className="mb-6">
              {selectedOptions.length === 5 ? (
                <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-xl animate-fade-in">
                  <p className="text-green-700 font-semibold flex items-center">
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Perfeito! Você selecionou exatamente 5 opções.
                  </p>
                </div>
              ) : selectedOptions.length < 5 ? (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-xl animate-fade-in">
                  <p className="text-blue-700 font-semibold">
                    📌 Selecione {5 - selectedOptions.length} opção(ões) para continuar.
                  </p>
                </div>
              ) : (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-xl animate-fade-in">
                  <p className="text-red-700 font-semibold">
                    ⚠️ Você já marcou 5 opções. Para escolher uma nova, desmarque uma das anteriores.
                  </p>
                </div>
              )}
              
              <div className="mt-3 flex items-center justify-between">
                <Badge variant="info" size="lg">
                  Selecionadas: {selectedOptions.length}/5
                </Badge>
                <div className="text-sm text-gray-500">
                  {selectedOptions.length === 5 ? '✅ Pronto para continuar' : '⏳ Complete a seleção'}
                </div>
              </div>
            </div>

            {/* Opções */}
            <div className="grid gap-3 md:grid-cols-2">
              {options.map((option, index) => {
                const isSelected = selectedOptions.includes(index);
                return (
                  <button
                    key={index}
                    onClick={() => onOptionClick(index)}
                    className={`p-4 rounded-xl text-left transition-all duration-200 border-2 flex items-center group hover-lift ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-800 shadow-md ring-2 ring-indigo-100'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="mr-3 transition-transform duration-200 group-hover:scale-110">
                      {isSelected ? (
                        <CheckCircle2 className="w-6 h-6 text-indigo-600" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-400 group-hover:text-gray-600" />
                      )}
                    </div>
                    <span className="text-sm font-medium leading-relaxed">{option}</span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Navegação */}
        <Card className="glass-effect">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                size="lg"
                onClick={onPrevious}
                disabled={currentQuestion === 0}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Anterior</span>
              </Button>

              <Button
                variant="gradient"
                size="lg"
                onClick={onNext}
                disabled={!canProceed}
                className="flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              >
                <span>{currentQuestion === totalQuestions - 1 ? 'Finalizar' : 'Próxima'}</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuestionnaireLayout;

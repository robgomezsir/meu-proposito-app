import React, { useState } from 'react';

const SistemaProposito = () => {
  const [currentView, setCurrentView] = useState('formulario');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Sistema de Propósito
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Versão de teste - Deploy funcionando!
        </p>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Status: {currentView}
          </h2>
          <p className="text-gray-600 mb-6">
            Se você está vendo esta mensagem, o componente está funcionando corretamente.
          </p>
          
          <button
            onClick={() => setCurrentView(currentView === 'formulario' ? 'sucesso' : 'formulario')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Alternar View
          </button>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          <p>Build: {new Date().toLocaleString()}</p>
          <p>Componente: SistemaProposito Simplificado</p>
        </div>
      </div>
    </div>
  );
};

export default SistemaProposito;
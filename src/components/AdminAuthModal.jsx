import React, { useState } from 'react';
import { X, Shield, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AdminAuthModal = ({ isOpen, onClose, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { checkAuth, ADMIN_EMAIL } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Simular verificação de email (em produção, isso seria feito no backend)
      if (!email || !email.includes('@')) {
        throw new Error('Por favor, insira um email válido');
      }

      // Verificar se o email está autorizado
      checkAuth(email);
      
      // Fechar modal e notificar sucesso
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Painel de Configurações</h2>
              <p className="text-sm text-gray-600">Acesso Restrito</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Info */}
        <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">Acesso Restrito</p>
              <p>Este painel é acessível apenas para usuários autorizados.</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email de Acesso
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu email"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !email}
            className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
              isLoading || !email
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
            }`}
          >
            {isLoading ? 'Verificando...' : 'Acessar Painel'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Apenas emails autorizados podem acessar este painel.
            <br />
            Para solicitar acesso, entre em contato com o administrador.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminAuthModal;

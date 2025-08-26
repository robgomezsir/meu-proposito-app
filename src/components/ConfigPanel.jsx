import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Users, 
  Trash2, 
  BarChart3, 
  Plus, 
  UserMinus,
  Shield,
  LogOut,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ConfigPanel = ({ isOpen, onClose, onExportData, onClearAllData }) => {
  const { 
    isAdmin, 
    currentUser, 
    authorizedEmails, 
    addAuthorizedEmail, 
    removeAuthorizedEmail, 
    logout 
  } = useAuth();
  
  const [newEmail, setNewEmail] = useState('');
  const [isAddingEmail, setIsAddingEmail] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAddEmail = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!newEmail || !newEmail.includes('@')) {
      setError('Por favor, insira um email válido');
      return;
    }

    try {
      setIsAddingEmail(true);
      const result = await addAuthorizedEmail(newEmail);
      
      if (result) {
        setSuccess(`Email ${newEmail} adicionado com sucesso!`);
        setNewEmail('');
      } else {
        setError('Este email já está autorizado');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAddingEmail(false);
    }
  };

  const handleRemoveEmail = async (email) => {
    if (window.confirm(`Tem certeza que deseja remover o acesso de ${email}?`)) {
      try {
        await removeAuthorizedEmail(email);
        setSuccess(`Acesso de ${email} removido com sucesso!`);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleExportData = () => {
    onExportData();
    setSuccess('Dados exportados com sucesso!');
  };

  const handleClearAllData = () => {
    if (window.confirm('⚠️ ATENÇÃO: Tem certeza que deseja limpar TODOS os dados? Esta ação não pode ser desfeita e afetará todos os usuários.')) {
      onClearAllData();
      setSuccess('Todos os dados foram limpos com sucesso!');
    }
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
              <Settings className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Painel de Configurações</h2>
              <p className="text-gray-600">
                Logado como: <span className="font-medium">{currentUser?.email}</span>
                {isAdmin && <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">Admin</span>}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center">
                <div className="w-5 h-5 bg-green-600 rounded-full mr-2 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <p className="text-green-700">{success}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Seção: Gerenciamento de Dados */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                  Gerenciamento de Dados
                </h3>
                
                <div className="space-y-4">
                  <button
                    onClick={handleExportData}
                    className="w-full flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Exportar Dados
                  </button>
                  
                  <button
                    onClick={handleClearAllData}
                    className="w-full flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <Trash2 className="w-5 h-5 mr-2" />
                    Limpar Todos os Dados
                  </button>
                </div>

                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-700">
                    <strong>💾 Dados Persistidos:</strong> Todos os registros são salvos na nuvem! 
                    Use "Exportar dados" para salvar uma cópia do sistema.
                  </p>
                </div>
              </div>
            </div>

            {/* Seção: Gerenciamento de Usuários */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-green-600" />
                  Gerenciamento de Usuários
                </h3>

                {/* Adicionar novo email */}
                <form onSubmit={handleAddEmail} className="mb-4">
                  <div className="flex space-x-2">
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="Digite o email do novo usuário"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <button
                      type="submit"
                      disabled={isAddingEmail || !newEmail}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        isAddingEmail || !newEmail
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {isAddingEmail ? 'Adicionando...' : <Plus className="w-4 h-4" />}
                    </button>
                  </div>
                </form>

                {/* Lista de emails autorizados */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Usuários Autorizados:</h4>
                  {authorizedEmails.map((email) => (
                    <div
                      key={email}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center">
                        <Shield className="w-4 h-4 text-blue-600 mr-2" />
                        <span className="text-sm text-gray-800">{email}</span>
                        {email === 'robgomez.sir@gmail.com' && (
                          <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">Admin</span>
                        )}
                      </div>
                      
                      {isAdmin && email !== 'robgomez.sir@gmail.com' && (
                        <button
                          onClick={() => handleRemoveEmail(email)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          title="Remover acesso"
                        >
                          <UserMinus className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Seção: Ações do Sistema */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                <p>Painel de Configurações - Sistema de Propósito</p>
                <p>Versão 1.0.0</p>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigPanel;

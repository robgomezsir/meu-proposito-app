import React, { useState, useEffect } from 'react';
import { 
  User, 
  Target, 
  TrendingUp, 
  BarChart3, 
  CheckCircle, 
  Plus, 
  Edit3, 
  Trash2,
  LogOut,
  Settings,
  Home,
  Calendar,
  Award,
  Clock
} from 'lucide-react';

const SistemaProposito = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState({
    nome: '',
    cpf: ''
  });
  const [propositos, setPropositos] = useState([]);
  const [currentProposito, setCurrentProposito] = useState({
    titulo: '',
    descricao: '',
    prazo: '',
    prioridade: 'media'
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Carregar dados salvos
  useEffect(() => {
    const savedUser = localStorage.getItem('userData');
    const savedPropositos = localStorage.getItem('propositos');
    
    if (savedUser) {
      setUserData(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
    
    if (savedPropositos) {
      setPropositos(JSON.parse(savedPropositos));
    }
  }, []);

  // Salvar dados
  const saveData = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (userData.nome && userData.cpf) {
      setIsLoggedIn(true);
      saveData('userData', userData);
      setCurrentStep(1);
    }
  };

  const handlePropositoSubmit = (e) => {
    e.preventDefault();
    
    if (editingId !== null) {
      // Editando
      const updated = propositos.map(p => 
        p.id === editingId ? { ...currentProposito, id: editingId } : p
      );
      setPropositos(updated);
      saveData('propositos', updated);
      setEditingId(null);
    } else {
      // Adicionando novo
      const newProposito = {
        ...currentProposito,
        id: Date.now(),
        dataCriacao: new Date().toISOString(),
        status: 'pendente'
      };
      const updated = [...propositos, newProposito];
      setPropositos(updated);
      saveData('propositos', updated);
    }
    
    setCurrentProposito({ titulo: '', descricao: '', prazo: '', prioridade: 'media' });
    setShowAddForm(false);
  };

  const handleEdit = (proposito) => {
    setCurrentProposito(proposito);
    setEditingId(proposito.id);
    setShowAddForm(true);
  };

  const handleDelete = (id) => {
    const updated = propositos.filter(p => p.id !== id);
    setPropositos(updated);
    saveData('propositos', updated);
  };

  const handleStatusChange = (id, newStatus) => {
    const updated = propositos.map(p => 
      p.id === id ? { ...p, status: newStatus } : p
    );
    setPropositos(updated);
    saveData('propositos', updated);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentStep(0);
    setUserData({ nome: '', cpf: '' });
    localStorage.removeItem('userData');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'em_andamento': return 'bg-blue-100 text-blue-800';
      case 'concluido': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (prioridade) => {
    switch (prioridade) {
      case 'baixa': return 'bg-green-100 text-green-800';
      case 'media': return 'bg-yellow-100 text-yellow-800';
      case 'alta': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStats = () => {
    const total = propositos.length;
    const pendentes = propositos.filter(p => p.status === 'pendente').length;
    const emAndamento = propositos.filter(p => p.status === 'em-andamento').length;
    const concluidos = propositos.filter(p => p.status === 'concluido').length;
    
    return { total, pendentes, emAndamento, concluidos };
  };

  const stats = getStats();

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sistema de Propósito</h1>
            <p className="text-gray-600">Faça login para começar sua jornada</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo
              </label>
              <input
                type="text"
                value={userData.nome}
                onChange={(e) => setUserData({...userData, nome: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Digite seu nome"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CPF
              </label>
              <input
                type="text"
                value={userData.cpf}
                onChange={(e) => setUserData({...userData, cpf: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="000.000.000-00"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105"
            >
              Entrar no Sistema
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Target className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">Sistema de Propósito</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Olá, <span className="font-medium text-gray-900">{userData.nome}</span>
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendentes}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Em Andamento</p>
                <p className="text-2xl font-bold text-gray-900">{stats.emAndamento}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Concluídos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.concluidos}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Add Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Propósito
          </button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white rounded-xl shadow-sm p-6 border mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingId ? 'Editar Propósito' : 'Novo Propósito'}
            </h3>
            
            <form onSubmit={handlePropositoSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título
                  </label>
                  <input
                    type="text"
                    value={currentProposito.titulo}
                    onChange={(e) => setCurrentProposito({...currentProposito, titulo: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Digite o título"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prazo
                  </label>
                  <input
                    type="date"
                    value={currentProposito.prazo}
                    onChange={(e) => setCurrentProposito({...currentProposito, prazo: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  value={currentProposito.descricao}
                  onChange={(e) => setCurrentProposito({...currentProposito, descricao: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Descreva seu propósito"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prioridade
                </label>
                <select
                  value={currentProposito.prioridade}
                  onChange={(e) => setCurrentProposito({...currentProposito, prioridade: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingId(null);
                    setCurrentProposito({ titulo: '', descricao: '', prazo: '', prioridade: 'media' });
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  {editingId ? 'Atualizar' : 'Adicionar'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Propósitos List */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Seus Propósitos</h3>
          </div>
          
          {propositos.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum propósito ainda</h3>
              <p className="text-gray-600 mb-4">Comece adicionando seu primeiro propósito para começar sua jornada!</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Primeiro Propósito
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {propositos.map((proposito) => (
                <div key={proposito.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-medium text-gray-900">{proposito.titulo}</h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(proposito.status)}`}>
                          {proposito.status === 'pendente' && 'Pendente'}
                          {proposito.status === 'em-andamento' && 'Em Andamento'}
                          {proposito.status === 'concluido' && 'Concluído'}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(proposito.prioridade)}`}>
                          {proposito.prioridade === 'baixa' && 'Baixa'}
                          {proposito.prioridade === 'media' && 'Média'}
                          {proposito.prioridade === 'alta' && 'Alta'}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-2">{proposito.descricao}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Prazo: {new Date(proposito.prazo).toLocaleDateString('pt-BR')}</span>
                        <span>Criado: {new Date(proposito.dataCriacao).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <select
                        value={proposito.status}
                        onChange={(e) => handleStatusChange(proposito.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="pendente">Pendente</option>
                        <option value="em-andamento">Em Andamento</option>
                        <option value="concluido">Concluído</option>
                      </select>
                      
                      <button
                        onClick={() => handleEdit(proposito)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDelete(proposito.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SistemaProposito;

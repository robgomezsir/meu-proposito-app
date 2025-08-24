import React, { useState, useEffect } from 'react';
import { Settings, RefreshCw, CheckCircle, AlertCircle, ExternalLink, Database, Zap } from 'lucide-react';
import { rhIntegrationAPI } from '../api/rh-integration';

const RHIntegrationManager = () => {
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [syncResults, setSyncResults] = useState({});
  const [webhookUrl, setWebhookUrl] = useState('');

  useEffect(() => {
    loadIntegrations();
  }, []);

  // Carregar integrações ativas
  const loadIntegrations = () => {
    try {
      const activeIntegrations = rhIntegrationAPI.getActiveIntegrations();
      setIntegrations(activeIntegrations);
      console.log('🔍 Integrações carregadas:', activeIntegrations);
    } catch (error) {
      console.error('❌ Erro ao carregar integrações:', error);
    }
  };

  // Verificar status de uma integração
  const checkIntegrationStatus = async (providerName) => {
    setLoading(true);
    try {
      const status = await rhIntegrationAPI.checkIntegrationStatus(providerName);
      setIntegrations(prev => 
        prev.map(integration => 
          integration.name === providerName 
            ? { ...integration, status: status.status, lastCheck: new Date().toISOString() }
            : integration
        )
      );
      console.log(`✅ Status da integração ${providerName}:`, status);
    } catch (error) {
      console.error(`❌ Erro ao verificar status de ${providerName}:`, error);
    } finally {
      setLoading(false);
    }
  };

  // Sincronizar candidatos de uma integração
  const syncCandidates = async (providerName) => {
    setLoading(true);
    try {
      const result = await rhIntegrationAPI.syncCandidates(providerName, { limit: 50 });
      setSyncResults(prev => ({ ...prev, [providerName]: result }));
      console.log(`📊 Sincronização ${providerName}:`, result);
    } catch (error) {
      console.error(`❌ Erro na sincronização ${providerName}:`, error);
      setSyncResults(prev => ({ ...prev, [providerName]: { error: error.message } }));
    } finally {
      setLoading(false);
    }
  };

  // Configurar webhook
  const setupWebhook = async (providerName) => {
    if (!webhookUrl) {
      alert('Por favor, insira uma URL de webhook válida');
      return;
    }

    setLoading(true);
    try {
      const result = await rhIntegrationAPI.setupWebhook(providerName, webhookUrl);
      console.log(`🔗 Webhook configurado para ${providerName}:`, result);
      alert(`Webhook configurado com sucesso para ${providerName}!`);
      setWebhookUrl('');
    } catch (error) {
      console.error(`❌ Erro ao configurar webhook para ${providerName}:`, error);
      alert(`Erro ao configurar webhook: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Enviar dados de análise para plataforma
  const sendAnalysisData = async (providerName, candidateData, analysisResults) => {
    try {
      const result = await rhIntegrationAPI.sendAnalysisData(providerName, candidateData, analysisResults);
      console.log(`📤 Análise enviada para ${providerName}:`, result);
      return result;
    } catch (error) {
      console.error(`❌ Erro ao enviar análise para ${providerName}:`, error);
      throw error;
    }
  };

  // Renderizar status da integração
  const renderIntegrationStatus = (integration) => {
    const status = integration.status || 'unknown';
    
    switch (status) {
      case 'connected':
        return (
          <div className="flex items-center text-green-600">
            <CheckCircle className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Conectado</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center text-red-600">
            <AlertCircle className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Erro</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center text-gray-500">
            <AlertCircle className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Desconhecido</span>
          </div>
        );
    }
  };

  // Renderizar resultados da sincronização
  const renderSyncResults = (providerName) => {
    const result = syncResults[providerName];
    if (!result) return null;

    if (result.error) {
      return (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">Erro: {result.error}</p>
        </div>
      );
    }

    return (
      <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
        <p className="text-sm text-green-600">
          ✅ {result.candidates?.length || 0} candidatos sincronizados
        </p>
        <p className="text-xs text-green-500 mt-1">
          Total: {result.total} | Timestamp: {new Date(result.timestamp).toLocaleString('pt-BR')}
        </p>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🔗 Gerenciador de Integrações RH
        </h1>
        <p className="text-gray-600">
          Gerencie integrações com plataformas de RH como GUPY, Workday e SAP SuccessFactors
        </p>
      </div>

      {/* Configuração de Webhook */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-blue-600" />
          Configuração de Webhook
        </h2>
        <div className="flex gap-4">
          <input
            type="url"
            placeholder="https://seu-dominio.com/webhook"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={() => setupWebhook(selectedIntegration)}
            disabled={!webhookUrl || !selectedIntegration || loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Configurando...' : 'Configurar Webhook'}
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Configure webhooks para receber notificações em tempo real das plataformas de RH
        </p>
      </div>

      {/* Lista de Integrações */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {integrations.map((integration) => (
          <div key={integration.name} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <Database className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{integration.config.name}</h3>
                  <p className="text-sm text-gray-500">{integration.name}</p>
                </div>
              </div>
              {renderIntegrationStatus(integration)}
            </div>

            <div className="space-y-3">
              {/* Verificar Status */}
              <button
                onClick={() => checkIntegrationStatus(integration.name)}
                disabled={loading}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Verificar Status
              </button>

              {/* Sincronizar Candidatos */}
              <button
                onClick={() => syncCandidates(integration.name)}
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Database className="w-4 h-4 mr-2" />
                Sincronizar Candidatos
              </button>

              {/* Configurar Webhook */}
              <button
                onClick={() => setSelectedIntegration(integration.name)}
                className={`w-full px-4 py-2 rounded-lg flex items-center justify-center ${
                  selectedIntegration === integration.name
                    ? 'bg-green-100 text-green-700 border-2 border-green-300'
                    : 'bg-green-50 text-green-600 hover:bg-green-100'
                }`}
              >
                <Zap className="w-4 h-4 mr-2" />
                {selectedIntegration === integration.name ? 'Selecionado' : 'Selecionar para Webhook'}
              </button>
            </div>

            {/* Resultados da Sincronização */}
            {renderSyncResults(integration.name)}

            {/* Informações da Integração */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-xs text-gray-500 space-y-1">
                <p>Base URL: {integration.config.baseUrl || 'N/A'}</p>
                <p>API Key: {integration.config.apiKey ? '✅ Configurada' : '❌ Não configurada'}</p>
                {integration.lastCheck && (
                  <p>Última verificação: {new Date(integration.lastCheck).toLocaleString('pt-BR')}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mensagem quando não há integrações */}
      {integrations.length === 0 && (
        <div className="text-center py-12">
          <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma integração configurada</h3>
          <p className="text-gray-500">
            Configure as variáveis de ambiente para ativar as integrações com plataformas de RH
          </p>
        </div>
      )}

      {/* Instruções de Configuração */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-3">📋 Como Configurar</h2>
        <div className="text-sm text-blue-800 space-y-2">
          <p>1. <strong>GUPY:</strong> Configure REACT_APP_GUPY_API_KEY e REACT_APP_GUPY_BASE_URL</p>
          <p>2. <strong>Workday:</strong> Configure REACT_APP_WORKDAY_USERNAME, REACT_APP_WORKDAY_PASSWORD e REACT_APP_WORKDAY_TENANT</p>
          <p>3. <strong>SAP SuccessFactors:</strong> Configure REACT_APP_SAP_API_KEY, REACT_APP_SAP_BASE_URL e REACT_APP_SAP_COMPANY_ID</p>
          <p>4. <strong>Webhook:</strong> Configure REACT_APP_WEBHOOK_BASE_URL para receber notificações</p>
        </div>
      </div>
    </div>
  );
};

export default RHIntegrationManager;

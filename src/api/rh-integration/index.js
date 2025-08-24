// API de Integração com Plataformas de RH
// Suporta GUPY, Workday, SAP SuccessFactors, etc.

import { GupyIntegration } from './providers/gupy';
import { WorkdayIntegration } from './providers/workday';
import { SAPIntegration } from './providers/sap';
import { GenericHRIntegration } from './providers/generic';

// Configurações de integração
const INTEGRATION_CONFIG = {
  gupy: {
    name: 'GUPY',
    baseUrl: process.env.REACT_APP_GUPY_BASE_URL || 'https://api.gupy.com.br',
    apiKey: process.env.REACT_APP_GUPY_API_KEY,
    webhookUrl: process.env.REACT_APP_GUPY_WEBHOOK_URL,
    enabled: true
  },
  workday: {
    name: 'Workday',
    baseUrl: process.env.REACT_APP_WORKDAY_BASE_URL,
    username: process.env.REACT_APP_WORKDAY_USERNAME,
    password: process.env.REACT_APP_WORKDAY_PASSWORD,
    tenant: process.env.REACT_APP_WORKDAY_TENANT,
    enabled: false
  },
  sap: {
    name: 'SAP SuccessFactors',
    baseUrl: process.env.REACT_APP_SAP_BASE_URL,
    apiKey: process.env.REACT_APP_SAP_API_KEY,
    companyId: process.env.REACT_APP_SAP_COMPANY_ID,
    enabled: false
  }
};

// Classe principal de integração
export class RHIntegrationAPI {
  constructor() {
    this.providers = {};
    this.activeIntegrations = [];
    this.initializeProviders();
  }

  // Inicializar provedores de integração
  initializeProviders() {
    try {
      // GUPY
      if (INTEGRATION_CONFIG.gupy.enabled && INTEGRATION_CONFIG.gupy.apiKey) {
        this.providers.gupy = new GupyIntegration(INTEGRATION_CONFIG.gupy);
        this.activeIntegrations.push('gupy');
        console.log('✅ Integração GUPY inicializada');
      }

      // Workday
      if (INTEGRATION_CONFIG.workday.enabled && INTEGRATION_CONFIG.workday.username) {
        this.providers.workday = new WorkdayIntegration(INTEGRATION_CONFIG.workday);
        this.activeIntegrations.push('workday');
        console.log('✅ Integração Workday inicializada');
      }

      // SAP SuccessFactors
      if (INTEGRATION_CONFIG.sap.enabled && INTEGRATION_CONFIG.sap.apiKey) {
        this.providers.sap = new SAPIntegration(INTEGRATION_CONFIG.sap);
        this.activeIntegrations.push('sap');
        console.log('✅ Integração SAP SuccessFactors inicializada');
      }

      console.log(`🚀 ${this.activeIntegrations.length} integrações de RH ativas`);
    } catch (error) {
      console.error('❌ Erro ao inicializar integrações de RH:', error);
    }
  }

  // Obter provedor específico
  getProvider(providerName) {
    if (!this.providers[providerName]) {
      throw new Error(`Provedor ${providerName} não encontrado ou não configurado`);
    }
    return this.providers[providerName];
  }

  // Listar integrações ativas
  getActiveIntegrations() {
    return this.activeIntegrations.map(name => ({
      name,
      config: INTEGRATION_CONFIG[name],
      status: 'active'
    }));
  }

  // Sincronizar dados de candidatos
  async syncCandidates(providerName, options = {}) {
    try {
      const provider = this.getProvider(providerName);
      const result = await provider.syncCandidates(options);
      
      console.log(`📊 Sincronização de candidatos ${providerName}:`, result);
      return result;
    } catch (error) {
      console.error(`❌ Erro na sincronização ${providerName}:`, error);
      throw error;
    }
  }

  // Enviar dados de análise para plataforma de RH
  async sendAnalysisData(providerName, candidateData, analysisResults) {
    try {
      const provider = this.getProvider(providerName);
      const result = await provider.sendAnalysisData(candidateData, analysisResults);
      
      console.log(`📤 Dados de análise enviados para ${providerName}:`, result);
      return result;
    } catch (error) {
      console.error(`❌ Erro ao enviar dados para ${providerName}:`, error);
      throw error;
    }
  }

  // Receber webhook de plataforma de RH
  async handleWebhook(providerName, webhookData) {
    try {
      const provider = this.getProvider(providerName);
      const result = await provider.handleWebhook(webhookData);
      
      console.log(`📥 Webhook recebido de ${providerName}:`, result);
      return result;
    } catch (error) {
      console.error(`❌ Erro ao processar webhook de ${providerName}:`, error);
      throw error;
    }
  }

  // Verificar status de integração
  async checkIntegrationStatus(providerName) {
    try {
      const provider = this.getProvider(providerName);
      const status = await provider.checkStatus();
      
      console.log(`🔍 Status da integração ${providerName}:`, status);
      return status;
    } catch (error) {
      console.error(`❌ Erro ao verificar status de ${providerName}:`, error);
      throw error;
    }
  }

  // Configurar webhook
  async setupWebhook(providerName, webhookUrl) {
    try {
      const provider = this.getProvider(providerName);
      const result = await provider.setupWebhook(webhookUrl);
      
      console.log(`🔗 Webhook configurado para ${providerName}:`, result);
      return result;
    } catch (error) {
      console.error(`❌ Erro ao configurar webhook para ${providerName}:`, error);
      throw error;
    }
  }
}

// Instância singleton
export const rhIntegrationAPI = new RHIntegrationAPI();

// Exportar provedores individuais
export { GupyIntegration, WorkdayIntegration, SAPIntegration, GenericHRIntegration };

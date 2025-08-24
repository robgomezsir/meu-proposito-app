// Integração com Workday - Sistema de RH Empresarial
// Suporta integração via API REST e webhooks

export class WorkdayIntegration {
  constructor(config) {
    this.config = config;
    this.baseUrl = config.baseUrl;
    this.username = config.username;
    this.password = config.password;
    this.tenant = config.tenant;
    this.webhookUrl = config.webhookUrl;
    
    // Workday usa autenticação básica
    this.authHeader = `Basic ${btoa(`${this.username}:${this.password}`)}`;
    
    this.headers = {
      'Authorization': this.authHeader,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Workday-Tenant': this.tenant
    };
  }

  // Verificar status da integração
  async checkStatus() {
    try {
      const response = await fetch(`${this.baseUrl}/ccx/tenant/${this.tenant}/v1/workers`, {
        method: 'GET',
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return {
        status: 'connected',
        platform: 'workday',
        tenant: this.tenant,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Erro ao verificar status Workday:', error);
      return {
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString(),
        platform: 'workday'
      };
    }
  }

  // Sincronizar candidatos do Workday
  async syncCandidates(options = {}) {
    try {
      const { limit = 100, offset = 0, status = 'active' } = options;
      
      // Workday usa endpoint específico para candidatos
      const url = `${this.baseUrl}/ccx/tenant/${this.tenant}/v1/workers?limit=${limit}&offset=${offset}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Mapear dados do Workday para formato padrão
      const candidates = data.workers?.map(worker => this.mapWorkdayWorker(worker)) || [];

      return {
        success: true,
        candidates,
        total: data.total || candidates.length,
        limit,
        offset,
        platform: 'workday',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Erro ao sincronizar candidatos Workday:', error);
      throw error;
    }
  }

  // Mapear worker do Workday para formato padrão
  mapWorkdayWorker(worker) {
    return {
      id: worker.workerID,
      externalId: worker.workerID,
      name: `${worker.name?.firstName || ''} ${worker.name?.lastName || ''}`.trim(),
      email: worker.email || worker.workEmail,
      phone: worker.phone || worker.mobilePhone,
      cpf: worker.nationalID || worker.cpf,
      resume: worker.resume || worker.cv,
      status: worker.status || 'active',
      jobId: worker.position?.positionID,
      jobTitle: worker.position?.positionTitle,
      companyId: this.tenant,
      appliedAt: worker.hireDate || worker.startDate,
      updatedAt: worker.lastModifiedDate,
      source: 'workday',
      rawData: worker
    };
  }

  // Enviar dados de análise para Workday
  async sendAnalysisData(candidateData, analysisResults) {
    try {
      const payload = {
        workerID: candidateData.id,
        analysis: {
          timestamp: new Date().toISOString(),
          results: analysisResults,
          score: analysisResults.score || 0,
          recommendations: analysisResults.recommendations || [],
          areas: analysisResults.areas || [],
          status: analysisResults.status || 'completed'
        },
        metadata: {
          source: 'sistema-proposito',
          version: '1.0.0'
        }
      };

      // Enviar via webhook se configurado
      if (this.webhookUrl) {
        await this.sendWebhook(payload);
      }

      // Workday não suporta análise via API, usar webhook
      console.log('ℹ️ Workday não suporta análise via API, usando webhook');

      return {
        success: true,
        candidateId: candidateData.id,
        sentAt: new Date().toISOString(),
        method: 'webhook',
        platform: 'workday'
      };
    } catch (error) {
      console.error('❌ Erro ao enviar análise para Workday:', error);
      throw error;
    }
  }

  // Enviar webhook para Workday
  async sendWebhook(payload) {
    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Workday-Signature': this.generateSignature(payload)
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Webhook HTTP ${response.status}: ${response.statusText}`);
      }

      console.log('✅ Webhook enviado para Workday com sucesso');
      return true;
    } catch (error) {
      console.error('❌ Erro ao enviar webhook para Workday:', error);
      throw error;
    }
  }

  // Gerar assinatura para webhook
  generateSignature(payload) {
    const data = JSON.stringify(payload);
    const timestamp = Date.now();
    return btoa(`${this.username}:${data.length}:${timestamp}`);
  }

  // Processar webhook recebido do Workday
  async handleWebhook(webhookData) {
    try {
      console.log('📥 Webhook recebido do Workday:', webhookData);

      const event = webhookData.event;
      const data = webhookData.data;

      switch (event) {
        case 'worker.created':
          return await this.handleWorkerCreated(data);
        
        case 'worker.updated':
          return await this.handleWorkerUpdated(data);
        
        case 'worker.terminated':
          return await this.handleWorkerTerminated(data);
        
        case 'position.created':
          return await this.handlePositionCreated(data);
        
        case 'position.updated':
          return await this.handlePositionUpdated(data);
        
        default:
          console.log(`ℹ️ Evento Workday não tratado: ${event}`);
          return { success: true, event, handled: false };
      }
    } catch (error) {
      console.error('❌ Erro ao processar webhook Workday:', error);
      throw error;
    }
  }

  // Handlers de eventos
  async handleWorkerCreated(data) {
    console.log('👤 Worker criado no Workday:', data);
    return { success: true, event: 'worker.created', data };
  }

  async handleWorkerUpdated(data) {
    console.log('🔄 Worker atualizado no Workday:', data);
    return { success: true, event: 'worker.updated', data };
  }

  async handleWorkerTerminated(data) {
    console.log('🚫 Worker terminado no Workday:', data);
    return { success: true, event: 'worker.terminated', data };
  }

  async handlePositionCreated(data) {
    console.log('💼 Posição criada no Workday:', data);
    return { success: true, event: 'position.created', data };
  }

  async handlePositionUpdated(data) {
    console.log('🔄 Posição atualizada no Workday:', data);
    return { success: true, event: 'position.updated', data };
  }

  // Configurar webhook no Workday
  async setupWebhook(webhookUrl) {
    try {
      // Workday não suporta configuração de webhook via API
      // Deve ser configurado manualmente no sistema
      console.log('ℹ️ Workday não suporta configuração de webhook via API');
      
      return {
        success: true,
        message: 'Webhook deve ser configurado manualmente no Workday',
        url: webhookUrl,
        platform: 'workday'
      };
    } catch (error) {
      console.error('❌ Erro ao configurar webhook no Workday:', error);
      throw error;
    }
  }

  // Obter posições ativas
  async getActiveJobs(options = {}) {
    try {
      const { limit = 50, offset = 0 } = options;
      
      const url = `${this.baseUrl}/ccx/tenant/${this.tenant}/v1/positions?status=active&limit=${limit}&offset=${offset}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        jobs: data.positions || [],
        total: data.total || 0,
        limit,
        offset,
        platform: 'workday'
      };
    } catch (error) {
      console.error('❌ Erro ao obter posições Workday:', error);
      throw error;
    }
  }

  // Atualizar status do worker
  async updateWorkerStatus(workerId, status, metadata = {}) {
    try {
      const payload = {
        status,
        metadata,
        lastModifiedDate: new Date().toISOString()
      };

      const response = await fetch(`${this.baseUrl}/ccx/tenant/${this.tenant}/v1/workers/${workerId}/status`, {
        method: 'PUT',
        headers: this.headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      console.log(`✅ Status do worker ${workerId} atualizado para ${status}`);
      return {
        success: true,
        workerId,
        status,
        updatedAt: new Date().toISOString(),
        platform: 'workday'
      };
    } catch (error) {
      console.error('❌ Erro ao atualizar status do worker Workday:', error);
      throw error;
    }
  }
}

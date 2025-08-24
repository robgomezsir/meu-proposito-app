// Provedor genérico para integração com plataformas de RH
// Suporta integração via webhook e APIs REST genéricas

export class GenericHRIntegration {
  constructor(config) {
    this.config = config;
    this.baseUrl = config.baseUrl;
    this.apiKey = config.apiKey;
    this.webhookUrl = config.webhookUrl;
    this.headers = {
      'Authorization': config.authType === 'bearer' ? `Bearer ${this.apiKey}` : `ApiKey ${this.apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    // Configurações específicas da plataforma
    this.platformConfig = {
      candidateEndpoint: config.candidateEndpoint || '/candidates',
      jobEndpoint: config.jobEndpoint || '/jobs',
      webhookEndpoint: config.webhookEndpoint || '/webhooks',
      authType: config.authType || 'bearer',
      rateLimit: config.rateLimit || 100, // requests per minute
      timeout: config.timeout || 30000 // 30 seconds
    };
  }

  // Verificar status da integração
  async checkStatus() {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: this.headers,
        signal: AbortSignal.timeout(this.platformConfig.timeout)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        status: 'connected',
        platform: this.config.name,
        timestamp: new Date().toISOString(),
        details: data
      };
    } catch (error) {
      console.error(`❌ Erro ao verificar status ${this.config.name}:`, error);
      return {
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString(),
        platform: this.config.name
      };
    }
  }

  // Sincronizar candidatos
  async syncCandidates(options = {}) {
    try {
      const {
        limit = 100,
        offset = 0,
        status = 'active',
        filters = {}
      } = options;

      let url = `${this.baseUrl}${this.platformConfig.candidateEndpoint}?limit=${limit}&offset=${offset}`;
      
      // Adicionar filtros específicos da plataforma
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url += `&${key}=${encodeURIComponent(value)}`;
        }
      });

      const response = await fetch(url, {
        method: 'GET',
        headers: this.headers,
        signal: AbortSignal.timeout(this.platformConfig.timeout)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Mapear dados para formato padrão
      const candidates = this.mapCandidates(data.candidates || data.data || data);

      return {
        success: true,
        candidates,
        total: data.total || data.count || candidates.length,
        limit,
        offset,
        platform: this.config.name,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(`❌ Erro ao sincronizar candidatos ${this.config.name}:`, error);
      throw error;
    }
  }

  // Mapear candidatos para formato padrão
  mapCandidates(rawCandidates) {
    if (!Array.isArray(rawCandidates)) {
      rawCandidates = [rawCandidates];
    }

    return rawCandidates.map(candidate => {
      // Mapeamento flexível baseado na estrutura da plataforma
      const mapped = {
        id: candidate.id || candidate.candidateId || candidate.externalId,
        externalId: candidate.externalId || candidate.id,
        name: candidate.name || candidate.fullName || candidate.firstName + ' ' + candidate.lastName,
        email: candidate.email || candidate.emailAddress,
        phone: candidate.phone || candidate.phoneNumber || candidate.mobile,
        cpf: candidate.cpf || candidate.document || candidate.nationalId,
        resume: candidate.resume || candidate.cv || candidate.curriculum,
        status: candidate.status || candidate.applicationStatus || 'active',
        jobId: candidate.jobId || candidate.positionId || candidate.vacancyId,
        jobTitle: candidate.jobTitle || candidate.positionTitle || candidate.vacancyTitle,
        companyId: candidate.companyId || candidate.organizationId,
        appliedAt: candidate.appliedAt || candidate.applicationDate || candidate.createdAt,
        updatedAt: candidate.updatedAt || candidate.modifiedAt || candidate.lastModified,
        source: this.config.name.toLowerCase(),
        rawData: candidate
      };

      // Limpar campos undefined
      Object.keys(mapped).forEach(key => {
        if (mapped[key] === undefined) {
          delete mapped[key];
        }
      });

      return mapped;
    });
  }

  // Enviar dados de análise
  async sendAnalysisData(candidateData, analysisResults) {
    try {
      const payload = this.buildAnalysisPayload(candidateData, analysisResults);

      // Enviar via webhook se configurado
      if (this.webhookUrl) {
        await this.sendWebhook(payload);
      }

      // Enviar via API se disponível
      try {
        const response = await fetch(`${this.baseUrl}${this.platformConfig.candidateEndpoint}/${candidateData.id}/analysis`, {
          method: 'POST',
          headers: this.headers,
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(this.platformConfig.timeout)
        });

        if (!response.ok) {
          console.warn(`⚠️ API ${this.config.name} não suporta análise: ${response.status}`);
        }
      } catch (apiError) {
        console.warn(`⚠️ API ${this.config.name} não disponível, usando webhook:`, apiError.message);
      }

      return {
        success: true,
        candidateId: candidateData.id,
        sentAt: new Date().toISOString(),
        method: this.webhookUrl ? 'webhook' : 'api',
        platform: this.config.name
      };
    } catch (error) {
      console.error(`❌ Erro ao enviar análise para ${this.config.name}:`, error);
      throw error;
    }
  }

  // Construir payload de análise
  buildAnalysisPayload(candidateData, analysisResults) {
    return {
      candidateId: candidateData.id,
      externalId: candidateData.externalId,
      analysis: {
        timestamp: new Date().toISOString(),
        results: analysisResults,
        score: analysisResults.score || 0,
        recommendations: analysisResults.recommendations || [],
        areas: analysisResults.areas || [],
        status: analysisResults.status || 'completed',
        summary: analysisResults.summary || ''
      },
      metadata: {
        source: 'sistema-proposito',
        version: '1.0.0',
        platform: this.config.name
      }
    };
  }

  // Enviar webhook
  async sendWebhook(payload) {
    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Platform': this.config.name,
          'X-Signature': this.generateSignature(payload)
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(this.platformConfig.timeout)
      });

      if (!response.ok) {
        throw new Error(`Webhook HTTP ${response.status}: ${response.statusText}`);
      }

      console.log(`✅ Webhook enviado para ${this.config.name} com sucesso`);
      return true;
    } catch (error) {
      console.error(`❌ Erro ao enviar webhook para ${this.config.name}:`, error);
      throw error;
    }
  }

  // Gerar assinatura para webhook
  generateSignature(payload) {
    if (!this.apiKey) return '';
    
    const data = JSON.stringify(payload);
    const timestamp = Date.now();
    
    // Assinatura simples baseada em timestamp e dados
    return btoa(`${this.apiKey}:${data.length}:${timestamp}`);
  }

  // Processar webhook recebido
  async handleWebhook(webhookData) {
    try {
      console.log(`📥 Webhook recebido de ${this.config.name}:`, webhookData);

      // Verificar assinatura se configurada
      if (this.apiKey && !this.verifyWebhookSignature(webhookData)) {
        throw new Error('Assinatura do webhook inválida');
      }

      const event = webhookData.event || webhookData.type;
      const data = webhookData.data || webhookData.payload;

      // Processar evento baseado no tipo
      return await this.processWebhookEvent(event, data);
    } catch (error) {
      console.error(`❌ Erro ao processar webhook de ${this.config.name}:`, error);
      throw error;
    }
  }

  // Verificar assinatura do webhook
  verifyWebhookSignature(webhookData) {
    // Implementar verificação de assinatura específica da plataforma
    // Por enquanto, aceita todos os webhooks
    return true;
  }

  // Processar evento do webhook
  async processWebhookEvent(event, data) {
    const eventHandlers = {
      'candidate.created': this.handleCandidateCreated.bind(this),
      'candidate.updated': this.handleCandidateUpdated.bind(this),
      'candidate.deleted': this.handleCandidateDeleted.bind(this),
      'job.created': this.handleJobCreated.bind(this),
      'job.updated': this.handleJobUpdated.bind(this),
      'application.submitted': this.handleApplicationSubmitted.bind(this),
      'application.updated': this.handleApplicationUpdated.bind(this)
    };

    const handler = eventHandlers[event];
    if (handler) {
      return await handler(data);
    }

    console.log(`ℹ️ Evento ${this.config.name} não tratado: ${event}`);
    return { success: true, event, handled: false, platform: this.config.name };
  }

  // Handlers de eventos
  async handleCandidateCreated(data) {
    console.log(`👤 Candidato criado em ${this.config.name}:`, data);
    return { success: true, event: 'candidate.created', data, platform: this.config.name };
  }

  async handleCandidateUpdated(data) {
    console.log(`🔄 Candidato atualizado em ${this.config.name}:`, data);
    return { success: true, event: 'candidate.updated', data, platform: this.config.name };
  }

  async handleCandidateDeleted(data) {
    console.log(`🗑️ Candidato deletado em ${this.config.name}:`, data);
    return { success: true, event: 'candidate.deleted', data, platform: this.config.name };
  }

  async handleJobCreated(data) {
    console.log(`💼 Vaga criada em ${this.config.name}:`, data);
    return { success: true, event: 'job.created', data, platform: this.config.name };
  }

  async handleJobUpdated(data) {
    console.log(`🔄 Vaga atualizada em ${this.config.name}:`, data);
    return { success: true, event: 'job.updated', data, platform: this.config.name };
  }

  async handleApplicationSubmitted(data) {
    console.log(`📝 Candidatura submetida em ${this.config.name}:`, data);
    return { success: true, event: 'application.submitted', data, platform: this.config.name };
  }

  async handleApplicationUpdated(data) {
    console.log(`🔄 Candidatura atualizada em ${this.config.name}:`, data);
    return { success: true, event: 'application.updated', data, platform: this.config.name };
  }

  // Configurar webhook
  async setupWebhook(webhookUrl) {
    try {
      const payload = {
        url: webhookUrl,
        events: [
          'candidate.created',
          'candidate.updated',
          'candidate.deleted',
          'job.created',
          'job.updated',
          'application.submitted',
          'application.updated'
        ],
        active: true,
        metadata: {
          source: 'sistema-proposito',
          platform: this.config.name
        }
      };

      const response = await fetch(`${this.baseUrl}${this.platformConfig.webhookEndpoint}`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(this.platformConfig.timeout)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      console.log(`✅ Webhook configurado em ${this.config.name}:`, result);
      return {
        success: true,
        webhookId: result.id || result.webhookId,
        url: webhookUrl,
        platform: this.config.name
      };
    } catch (error) {
      console.error(`❌ Erro ao configurar webhook em ${this.config.name}:`, error);
      throw error;
    }
  }

  // Obter vagas ativas
  async getActiveJobs(options = {}) {
    try {
      const { limit = 50, offset = 0, filters = {} } = options;
      
      let url = `${this.baseUrl}${this.platformConfig.jobEndpoint}?status=active&limit=${limit}&offset=${offset}`;
      
      // Adicionar filtros específicos
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url += `&${key}=${encodeURIComponent(value)}`;
        }
      });
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.headers,
        signal: AbortSignal.timeout(this.platformConfig.timeout)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        jobs: data.jobs || data.data || data,
        total: data.total || data.count || 0,
        limit,
        offset,
        platform: this.config.name
      };
    } catch (error) {
      console.error(`❌ Erro ao obter vagas ${this.config.name}:`, error);
      throw error;
    }
  }

  // Atualizar status do candidato
  async updateCandidateStatus(candidateId, status, metadata = {}) {
    try {
      const payload = {
        status,
        metadata,
        updatedAt: new Date().toISOString()
      };

      const response = await fetch(`${this.baseUrl}${this.platformConfig.candidateEndpoint}/${candidateId}/status`, {
        method: 'PUT',
        headers: this.headers,
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(this.platformConfig.timeout)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      console.log(`✅ Status do candidato ${candidateId} atualizado para ${status} em ${this.config.name}`);
      return {
        success: true,
        candidateId,
        status,
        updatedAt: new Date().toISOString(),
        platform: this.config.name
      };
    } catch (error) {
      console.error(`❌ Erro ao atualizar status do candidato ${this.config.name}:`, error);
      throw error;
    }
  }
}

// Integração com GUPY - Plataforma de Recrutamento e Seleção
// API oficial: https://developers.gupy.com.br/

export class GupyIntegration {
  constructor(config) {
    this.config = config;
    this.baseUrl = config.baseUrl;
    this.apiKey = config.apiKey;
    this.webhookUrl = config.webhookUrl;
    this.headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  // Verificar status da integração
  async checkStatus() {
    try {
      const response = await fetch(`${this.baseUrl}/v1/companies`, {
        method: 'GET',
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        status: 'connected',
        company: data.company || {},
        timestamp: new Date().toISOString(),
        provider: 'gupy'
      };
    } catch (error) {
      console.error('❌ Erro ao verificar status GUPY:', error);
      return {
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString(),
        provider: 'gupy'
      };
    }
  }

  // Sincronizar candidatos da GUPY
  async syncCandidates(options = {}) {
    try {
      const {
        limit = 100,
        offset = 0,
        status = 'active',
        jobId = null,
        dateFrom = null,
        dateTo = null
      } = options;

      let url = `${this.baseUrl}/v1/candidates?limit=${limit}&offset=${offset}&status=${status}`;
      
      if (jobId) url += `&jobId=${jobId}`;
      if (dateFrom) url += `&dateFrom=${dateFrom}`;
      if (dateTo) url += `&dateTo=${dateTo}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Mapear dados da GUPY para formato padrão
      const candidates = data.candidates?.map(candidate => this.mapGupyCandidate(candidate)) || [];

      return {
        success: true,
        candidates,
        total: data.total || candidates.length,
        limit,
        offset,
        provider: 'gupy',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Erro ao sincronizar candidatos GUPY:', error);
      throw error;
    }
  }

  // Mapear candidato da GUPY para formato padrão
  mapGupyCandidate(gupyCandidate) {
    return {
      id: gupyCandidate.id,
      externalId: gupyCandidate.externalId,
      name: gupyCandidate.name,
      email: gupyCandidate.email,
      phone: gupyCandidate.phone,
      cpf: gupyCandidate.cpf,
      resume: gupyCandidate.resume,
      status: gupyCandidate.status,
      jobId: gupyCandidate.jobId,
      jobTitle: gupyCandidate.jobTitle,
      companyId: gupyCandidate.companyId,
      appliedAt: gupyCandidate.appliedAt,
      updatedAt: gupyCandidate.updatedAt,
      source: 'gupy',
      rawData: gupyCandidate
    };
  }

  // Enviar dados de análise para GUPY
  async sendAnalysisData(candidateData, analysisResults) {
    try {
      const payload = {
        candidateId: candidateData.id,
        externalId: candidateData.externalId,
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

      // Enviar via API se disponível
      const response = await fetch(`${this.baseUrl}/v1/candidates/${candidateData.id}/analysis`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        console.warn(`⚠️ API GUPY não suporta análise, usando webhook: ${response.status}`);
      }

      return {
        success: true,
        candidateId: candidateData.id,
        sentAt: new Date().toISOString(),
        method: this.webhookUrl ? 'webhook' : 'api',
        provider: 'gupy'
      };
    } catch (error) {
      console.error('❌ Erro ao enviar análise para GUPY:', error);
      throw error;
    }
  }

  // Enviar webhook para GUPY
  async sendWebhook(payload) {
    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gupy-Signature': this.generateSignature(payload)
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Webhook HTTP ${response.status}: ${response.statusText}`);
      }

      console.log('✅ Webhook enviado para GUPY com sucesso');
      return true;
    } catch (error) {
      console.error('❌ Erro ao enviar webhook para GUPY:', error);
      throw error;
    }
  }

  // Gerar assinatura para webhook
  generateSignature(payload) {
    // Implementar assinatura HMAC se necessário
    const data = JSON.stringify(payload);
    return btoa(`${this.apiKey}:${data.length}:${Date.now()}`);
  }

  // Processar webhook recebido da GUPY
  async handleWebhook(webhookData) {
    try {
      console.log('📥 Webhook recebido da GUPY:', webhookData);

      // Verificar assinatura do webhook
      if (!this.verifyWebhookSignature(webhookData)) {
        throw new Error('Assinatura do webhook inválida');
      }

      const event = webhookData.event;
      const data = webhookData.data;

      switch (event) {
        case 'candidate.created':
          return await this.handleCandidateCreated(data);
        
        case 'candidate.updated':
          return await this.handleCandidateUpdated(data);
        
        case 'candidate.deleted':
          return await this.handleCandidateDeleted(data);
        
        case 'job.created':
          return await this.handleJobCreated(data);
        
        case 'job.updated':
          return await this.handleJobUpdated(data);
        
        default:
          console.log(`ℹ️ Evento GUPY não tratado: ${event}`);
          return { success: true, event, handled: false };
      }
    } catch (error) {
      console.error('❌ Erro ao processar webhook GUPY:', error);
      throw error;
    }
  }

  // Verificar assinatura do webhook
  verifyWebhookSignature(webhookData) {
    // Implementar verificação de assinatura
    // Por enquanto, aceita todos os webhooks
    return true;
  }

  // Tratar candidato criado
  async handleCandidateCreated(data) {
    console.log('👤 Candidato criado na GUPY:', data);
    // Implementar lógica de sincronização
    return { success: true, event: 'candidate.created', data };
  }

  // Tratar candidato atualizado
  async handleCandidateUpdated(data) {
    console.log('🔄 Candidato atualizado na GUPY:', data);
    // Implementar lógica de sincronização
    return { success: true, event: 'candidate.updated', data };
  }

  // Tratar candidato deletado
  async handleCandidateDeleted(data) {
    console.log('🗑️ Candidato deletado na GUPY:', data);
    // Implementar lógica de limpeza
    return { success: true, event: 'candidate.deleted', data };
  }

  // Tratar vaga criada
  async handleJobCreated(data) {
    console.log('💼 Vaga criada na GUPY:', data);
    // Implementar lógica de sincronização
    return { success: true, event: 'job.created', data };
  }

  // Tratar vaga atualizada
  async handleJobUpdated(data) {
    console.log('🔄 Vaga atualizada na GUPY:', data);
    // Implementar lógica de sincronização
    return { success: true, event: 'job.updated', data };
  }

  // Configurar webhook na GUPY
  async setupWebhook(webhookUrl) {
    try {
      const payload = {
        url: webhookUrl,
        events: [
          'candidate.created',
          'candidate.updated',
          'candidate.deleted',
          'job.created',
          'job.updated'
        ],
        active: true
      };

      const response = await fetch(`${this.baseUrl}/v1/webhooks`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      console.log('✅ Webhook configurado na GUPY:', result);
      return {
        success: true,
        webhookId: result.id,
        url: webhookUrl,
        provider: 'gupy'
      };
    } catch (error) {
      console.error('❌ Erro ao configurar webhook na GUPY:', error);
      throw error;
    }
  }

  // Obter vagas ativas
  async getActiveJobs(options = {}) {
    try {
      const { limit = 50, offset = 0 } = options;
      
      const url = `${this.baseUrl}/v1/jobs?status=active&limit=${limit}&offset=${offset}`;
      
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
        jobs: data.jobs || [],
        total: data.total || 0,
        limit,
        offset,
        provider: 'gupy'
      };
    } catch (error) {
      console.error('❌ Erro ao obter vagas GUPY:', error);
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

      const response = await fetch(`${this.baseUrl}/v1/candidates/${candidateId}/status`, {
        method: 'PUT',
        headers: this.headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      console.log(`✅ Status do candidato ${candidateId} atualizado para ${status}`);
      return {
        success: true,
        candidateId,
        status,
        updatedAt: new Date().toISOString(),
        provider: 'gupy'
      };
    } catch (error) {
      console.error('❌ Erro ao atualizar status do candidato GUPY:', error);
      throw error;
    }
  }
}

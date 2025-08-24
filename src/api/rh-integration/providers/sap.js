// Integração com SAP SuccessFactors - Sistema de RH na Nuvem
// Suporta integração via API OData e webhooks

export class SAPIntegration {
  constructor(config) {
    this.config = config;
    this.baseUrl = config.baseUrl;
    this.apiKey = config.apiKey;
    this.companyId = config.companyId;
    this.webhookUrl = config.webhookUrl;
    
    this.headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Company-ID': this.companyId
    };
  }

  // Verificar status da integração
  async checkStatus() {
    try {
      const response = await fetch(`${this.baseUrl}/odata/v2/Company(${this.companyId})`, {
        method: 'GET',
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        status: 'connected',
        platform: 'sap-successfactors',
        companyId: this.companyId,
        companyName: data.d?.CompanyName || 'Unknown',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Erro ao verificar status SAP SuccessFactors:', error);
      return {
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString(),
        platform: 'sap-successfactors'
      };
    }
  }

  // Sincronizar candidatos do SAP SuccessFactors
  async syncCandidates(options = {}) {
    try {
      const { limit = 100, offset = 0, status = 'active' } = options;
      
      // SAP SuccessFactors usa OData para consultas
      let url = `${this.baseUrl}/odata/v2/Candidate?$top=${limit}&$skip=${offset}&$filter=Status eq '${status}'`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Mapear dados do SAP para formato padrão
      const candidates = data.d?.results?.map(candidate => this.mapSAPCandidate(candidate)) || [];

      return {
        success: true,
        candidates,
        total: data.d?.__count || candidates.length,
        limit,
        offset,
        platform: 'sap-successfactors',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Erro ao sincronizar candidatos SAP SuccessFactors:', error);
      throw error;
    }
  }

  // Mapear candidato do SAP para formato padrão
  mapSAPCandidate(candidate) {
    return {
      id: candidate.CandidateID,
      externalId: candidate.ExternalCandidateID || candidate.CandidateID,
      name: `${candidate.FirstName || ''} ${candidate.LastName || ''}`.trim(),
      email: candidate.Email || candidate.EmailAddress,
      phone: candidate.Phone || candidate.MobilePhone,
      cpf: candidate.NationalID || candidate.CPF,
      resume: candidate.Resume || candidate.CV,
      status: candidate.Status || 'active',
      jobId: candidate.PositionID,
      jobTitle: candidate.PositionTitle,
      companyId: this.companyId,
      appliedAt: candidate.ApplicationDate || candidate.CreatedDate,
      updatedAt: candidate.LastModifiedDate || candidate.ModifiedDate,
      source: 'sap-successfactors',
      rawData: candidate
    };
  }

  // Enviar dados de análise para SAP SuccessFactors
  async sendAnalysisData(candidateData, analysisResults) {
    try {
      const payload = {
        CandidateID: candidateData.id,
        ExternalCandidateID: candidateData.externalId,
        Analysis: {
          Timestamp: new Date().toISOString(),
          Results: analysisResults,
          Score: analysisResults.score || 0,
          Recommendations: analysisResults.recommendations || [],
          Areas: analysisResults.areas || [],
          Status: analysisResults.status || 'completed'
        },
        Metadata: {
          Source: 'sistema-proposito',
          Version: '1.0.0'
        }
      };

      // Enviar via webhook se configurado
      if (this.webhookUrl) {
        await this.sendWebhook(payload);
      }

      // Tentar enviar via API OData
      try {
        const response = await fetch(`${this.baseUrl}/odata/v2/CandidateAnalysis`, {
          method: 'POST',
          headers: this.headers,
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          console.warn(`⚠️ API SAP não suporta análise: ${response.status}`);
        }
      } catch (apiError) {
        console.warn(`⚠️ API SAP não disponível, usando webhook:`, apiError.message);
      }

      return {
        success: true,
        candidateId: candidateData.id,
        sentAt: new Date().toISOString(),
        method: this.webhookUrl ? 'webhook' : 'api',
        platform: 'sap-successfactors'
      };
    } catch (error) {
      console.error('❌ Erro ao enviar análise para SAP SuccessFactors:', error);
      throw error;
    }
  }

  // Enviar webhook para SAP SuccessFactors
  async sendWebhook(payload) {
    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-SAP-Signature': this.generateSignature(payload)
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Webhook HTTP ${response.status}: ${response.statusText}`);
      }

      console.log('✅ Webhook enviado para SAP SuccessFactors com sucesso');
      return true;
    } catch (error) {
      console.error('❌ Erro ao enviar webhook para SAP SuccessFactors:', error);
      throw error;
    }
  }

  // Gerar assinatura para webhook
  generateSignature(payload) {
    const data = JSON.stringify(payload);
    const timestamp = Date.now();
    return btoa(`${this.apiKey}:${data.length}:${timestamp}`);
  }

  // Processar webhook recebido do SAP
  async handleWebhook(webhookData) {
    try {
      console.log('📥 Webhook recebido do SAP SuccessFactors:', webhookData);

      const event = webhookData.event;
      const data = webhookData.data;

      switch (event) {
        case 'candidate.created':
          return await this.handleCandidateCreated(data);
        
        case 'candidate.updated':
          return await this.handleCandidateUpdated(data);
        
        case 'candidate.deleted':
          return await this.handleCandidateDeleted(data);
        
        case 'position.created':
          return await this.handlePositionCreated(data);
        
        case 'position.updated':
          return await this.handlePositionUpdated(data);
        
        case 'application.submitted':
          return await this.handleApplicationSubmitted(data);
        
        default:
          console.log(`ℹ️ Evento SAP não tratado: ${event}`);
          return { success: true, event, handled: false };
      }
    } catch (error) {
      console.error('❌ Erro ao processar webhook SAP SuccessFactors:', error);
      throw error;
    }
  }

  // Handlers de eventos
  async handleCandidateCreated(data) {
    console.log('👤 Candidato criado no SAP SuccessFactors:', data);
    return { success: true, event: 'candidate.created', data };
  }

  async handleCandidateUpdated(data) {
    console.log('🔄 Candidato atualizado no SAP SuccessFactors:', data);
    return { success: true, event: 'candidate.updated', data };
  }

  async handleCandidateDeleted(data) {
    console.log('🗑️ Candidato deletado no SAP SuccessFactors:', data);
    return { success: true, event: 'candidate.deleted', data };
  }

  async handlePositionCreated(data) {
    console.log('💼 Posição criada no SAP SuccessFactors:', data);
    return { success: true, event: 'position.created', data };
  }

  async handlePositionUpdated(data) {
    console.log('🔄 Posição atualizada no SAP SuccessFactors:', data);
    return { success: true, event: 'position.updated', data };
  }

  async handleApplicationSubmitted(data) {
    console.log('📝 Candidatura submetida no SAP SuccessFactors:', data);
    return { success: true, event: 'application.submitted', data };
  }

  // Configurar webhook no SAP SuccessFactors
  async setupWebhook(webhookUrl) {
    try {
      const payload = {
        URL: webhookUrl,
        Events: [
          'candidate.created',
          'candidate.updated',
          'candidate.deleted',
          'position.created',
          'position.updated',
          'application.submitted'
        ],
        Active: true,
        CompanyID: this.companyId
      };

      const response = await fetch(`${this.baseUrl}/odata/v2/Webhook`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      console.log('✅ Webhook configurado no SAP SuccessFactors:', result);
      return {
        success: true,
        webhookId: result.d?.WebhookID || result.WebhookID,
        url: webhookUrl,
        platform: 'sap-successfactors'
      };
    } catch (error) {
      console.error('❌ Erro ao configurar webhook no SAP SuccessFactors:', error);
      throw error;
    }
  }

  // Obter posições ativas
  async getActiveJobs(options = {}) {
    try {
      const { limit = 50, offset = 0 } = options;
      
      // Usar OData para consultar posições
      const url = `${this.baseUrl}/odata/v2/Position?$top=${limit}&$skip=${offset}&$filter=Status eq 'active'`;
      
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
        jobs: data.d?.results || [],
        total: data.d?.__count || 0,
        limit,
        offset,
        platform: 'sap-successfactors'
      };
    } catch (error) {
      console.error('❌ Erro ao obter posições SAP SuccessFactors:', error);
      throw error;
    }
  }

  // Atualizar status do candidato
  async updateCandidateStatus(candidateId, status, metadata = {}) {
    try {
      const payload = {
        Status: status,
        Metadata: metadata,
        LastModifiedDate: new Date().toISOString()
      };

      const response = await fetch(`${this.baseUrl}/odata/v2/Candidate(${candidateId})`, {
        method: 'PATCH',
        headers: this.headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      console.log(`✅ Status do candidato ${candidateId} atualizado para ${status}`);
      return {
        success: true,
        candidateId,
        status,
        updatedAt: new Date().toISOString(),
        platform: 'sap-successfactors'
      };
    } catch (error) {
      console.error('❌ Erro ao atualizar status do candidato SAP SuccessFactors:', error);
      throw error;
    }
  }

  // Executar consulta OData personalizada
  async executeODataQuery(query) {
    try {
      const url = `${this.baseUrl}/odata/v2/${query}`;
      
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
        data: data.d?.results || data.d || data,
        count: data.d?.__count,
        platform: 'sap-successfactors'
      };
    } catch (error) {
      console.error('❌ Erro ao executar consulta OData SAP SuccessFactors:', error);
      throw error;
    }
  }
}

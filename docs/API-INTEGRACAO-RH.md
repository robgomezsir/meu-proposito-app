# 📋 API de Integração com Plataformas de RH

## 🎯 Visão Geral

Esta API permite que plataformas de RH como **GUPY** integrem o questionário de propósito em seus processos seletivos. A integração funciona em duas direções:

1. **Envio de questionário** para candidatos
2. **Recebimento de scores** finalizados

## 🔗 Endpoints da API

### Base URL
```
https://seu-dominio.com/api/rh
```

---

## 📤 1. Enviar Questionário

**POST** `/api/rh/enviar-questionario`

Envia um questionário para um candidato específico.

### Request Body
```json
{
  "nome": "João Silva",
  "email": "joao.silva@email.com",
  "telefone": "+55 11 99999-9999",
  "plataforma": "GUPY",
  "vaga": "Desenvolvedor Full Stack",
  "empresa": "TechCorp",
  "tipoQuestionario": "proposito"
}
```

### Campos Obrigatórios
- `nome`: Nome completo do candidato
- `email`: Email válido do candidato
- `plataforma`: Nome da plataforma (ex: "GUPY", "VAGAS.com")

### Campos Opcionais
- `telefone`: Telefone do candidato
- `vaga`: Nome da vaga
- `empresa`: Nome da empresa
- `tipoQuestionario`: Tipo do questionário (padrão: "proposito")

### Response (200)
```json
{
  "success": true,
  "message": "Questionário enviado com sucesso",
  "data": {
    "candidatoId": "abc123",
    "questionarioId": "def456",
    "sessionId": "sess_1234567890_abc123",
    "link": "https://seu-dominio.com/questionario/sess_1234567890_abc123",
    "status": "enviado",
    "expiraEm": "2025-09-01T00:00:00.000Z",
    "instrucoes": {
      "envieEsteLink": "https://seu-dominio.com/questionario/sess_1234567890_abc123",
      "validade": "7 dias",
      "acompanheStatus": "/api/rh/status/sess_1234567890_abc123"
    }
  }
}
```

---

## 📊 2. Receber Score

**POST** `/api/rh/receber-score`

Recebe o score finalizado de um candidato (chamado automaticamente pelo questionário).

### Request Body
```json
{
  "sessionId": "sess_1234567890_abc123",
  "score": 85,
  "percentual": 85,
  "categoria": "Bom",
  "detalhes": {
    "totalRespostas": 16,
    "respostasCompletas": 16,
    "tempoMedio": 120
  },
  "respostas": [...],
  "tempoResposta": 720
}
```

### Campos Obrigatórios
- `sessionId`: ID da sessão do questionário
- `score`: Score numérico (0-100)
- `percentual`: Percentual de conclusão (0-100)

### Response (200)
```json
{
  "success": true,
  "message": "Score recebido e processado com sucesso",
  "data": {
    "scoreId": "score789",
    "candidatoId": "abc123",
    "questionarioId": "def456",
    "sessionId": "sess_1234567890_abc123",
    "score": 85,
    "percentual": 85,
    "categoria": "Bom",
    "status": "finalizado",
    "finalizadoEm": "2025-08-24T12:00:00.000Z"
  }
}
```

---

## 🔍 3. Buscar Scores

**GET** `/api/rh/scores/:plataforma`

Busca todos os scores para uma plataforma específica.

### Parâmetros de URL
- `plataforma`: Nome da plataforma (ex: "GUPY")

### Query Parameters
- `dataInicio`: Data de início (ISO 8601)
- `dataFim`: Data de fim (ISO 8601)
- `vaga`: Filtro por vaga
- `empresa`: Filtro por empresa
- `limit`: Limite de resultados (padrão: 100)
- `offset`: Offset para paginação (padrão: 0)

### Exemplo de Request
```
GET /api/rh/scores/GUPY?dataInicio=2025-08-01&vaga=Desenvolvedor&limit=50
```

### Response (200)
```json
{
  "success": true,
  "message": "150 scores encontrados para GUPY",
  "data": {
    "total": 150,
    "limit": 50,
    "offset": 0,
    "scores": [
      {
        "id": "integ123",
        "scoreId": "score789",
        "candidatoId": "abc123",
        "questionarioId": "def456",
        "sessionId": "sess_1234567890_abc123",
        "nome": "João Silva",
        "email": "joao.silva@email.com",
        "vaga": "Desenvolvedor Full Stack",
        "empresa": "TechCorp",
        "score": 85,
        "percentual": 85,
        "categoria": "Bom",
        "detalhes": {...},
        "finalizadoEm": "2025-08-24T12:00:00.000Z",
        "criadoEm": "2025-08-24T12:00:00.000Z"
      }
    ],
    "filtros": {
      "dataInicio": "2025-08-01T00:00:00.000Z",
      "vaga": "Desenvolvedor"
    }
  }
}
```

---

## 📊 4. Gerar Relatório

**GET** `/api/rh/relatorio/:plataforma`

Gera um relatório consolidado de scores para uma plataforma.

### Parâmetros de URL
- `plataforma`: Nome da plataforma (ex: "GUPY")

### Query Parameters
- `dataInicio`: Data de início (ISO 8601)
- `dataFim`: Data de fim (ISO 8601)
- `vaga`: Filtro por vaga
- `empresa`: Filtro por empresa

### Response (200)
```json
{
  "success": true,
  "message": "Relatório gerado com sucesso",
  "data": {
    "plataforma": "GUPY",
    "periodo": {
      "inicio": "2025-08-01T00:00:00.000Z",
      "fim": "2025-08-24T23:59:59.000Z"
    },
    "totalCandidatos": 150,
    "mediaGeral": 78.5,
    "estatisticasPorCategoria": {
      "Excelente": {
        "total": 45,
        "media": 92.3,
        "melhor": 100,
        "pior": 80
      },
      "Bom": {
        "total": 78,
        "media": 75.8,
        "melhor": 79,
        "pior": 60
      },
      "Regular": {
        "total": 27,
        "media": 45.2,
        "melhor": 59,
        "pior": 40
      }
    },
    "scores": [...],
    "geradoEm": "2025-08-24T12:00:00.000Z"
  }
}
```

---

## 🔍 5. Verificar Status

**GET** `/api/rh/status/:sessionId`

Verifica o status de um questionário específico.

### Parâmetros de URL
- `sessionId`: ID da sessão do questionário

### Response (200)
```json
{
  "success": true,
  "message": "Status da sessão recuperado com sucesso",
  "data": {
    "sessionId": "sess_1234567890_abc123",
    "candidato": {
      "nome": "João Silva",
      "email": "joao.silva@email.com",
      "vaga": "Desenvolvedor Full Stack",
      "empresa": "TechCorp",
      "status": "questionario_finalizado"
    },
    "questionario": {
      "tipo": "proposito",
      "status": "finalizado",
      "enviadoEm": "2025-08-24T10:00:00.000Z",
      "expiraEm": "2025-08-31T10:00:00.000Z"
    },
    "score": {
      "score": 85,
      "percentual": 85,
      "categoria": "Bom",
      "finalizadoEm": "2025-08-24T12:00:00.000Z"
    }
  }
}
```

---

## 🏥 6. Health Check

**GET** `/api/rh/health`

Verifica a saúde da API.

### Response (200)
```json
{
  "success": true,
  "message": "API de Integração RH funcionando normalmente",
  "timestamp": "2025-08-24T12:00:00.000Z",
  "version": "1.0.0",
  "endpoints": {
    "POST /api/rh/enviar-questionario": "Envia questionário para candidato",
    "POST /api/rh/receber-score": "Recebe score finalizado",
    "GET /api/rh/scores/:plataforma": "Busca scores para plataforma",
    "GET /api/rh/relatorio/:plataforma": "Gera relatório consolidado",
    "GET /api/rh/status/:sessionId": "Verifica status de sessão"
  }
}
```

---

## 🔐 Autenticação

Atualmente a API não requer autenticação, mas recomenda-se implementar:

- **API Key** no header: `Authorization: Bearer YOUR_API_KEY`
- **Rate Limiting** para evitar abuso
- **HTTPS** obrigatório para produção

---

## 📱 Exemplo de Integração com GUPY

### 1. Enviar Questionário
```javascript
const response = await fetch('https://seu-dominio.com/api/rh/enviar-questionario', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    nome: 'João Silva',
    email: 'joao.silva@email.com',
    plataforma: 'GUPY',
    vaga: 'Desenvolvedor Full Stack',
    empresa: 'TechCorp'
  })
});

const data = await response.json();
const linkQuestionario = data.data.link;

// Enviar link para o candidato via GUPY
await gupyAPI.enviarEmail(candidatoId, {
  assunto: 'Questionário de Propósito',
  corpo: `Clique no link para responder: ${linkQuestionario}`
});
```

### 2. Buscar Scores
```javascript
// Buscar scores dos candidatos
const response = await fetch('https://seu-dominio.com/api/rh/scores/GUPY');
const data = await response.json();

// Atualizar status dos candidatos no GUPY
data.data.scores.forEach(score => {
  await gupyAPI.atualizarCandidato(score.candidatoId, {
    status: 'questionario_finalizado',
    score: score.score,
    categoria: score.categoria
  });
});
```

### 3. Gerar Relatório
```javascript
// Gerar relatório mensal
const response = await fetch(
  'https://seu-dominio.com/api/rh/relatorio/GUPY?dataInicio=2025-08-01&dataFim=2025-08-31'
);
const relatorio = await response.json();

// Enviar relatório para RH
await gupyAPI.enviarRelatorio(relatorio.data);
```

---

## 🚀 Próximos Passos

1. **Implementar autenticação** com API Key
2. **Adicionar webhooks** para notificações em tempo real
3. **Implementar rate limiting** para proteção
4. **Adicionar logs** detalhados para auditoria
5. **Criar dashboard** para visualização de métricas

---

## 📞 Suporte

Para dúvidas ou suporte técnico:
- **Email**: suporte@seu-dominio.com
- **Documentação**: https://docs.seu-dominio.com
- **Status da API**: https://status.seu-dominio.com


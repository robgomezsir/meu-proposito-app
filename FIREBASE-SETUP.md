# 🔥 Configuração do Firebase - Sistema de Propósito

Este guia te ajudará a configurar o Firebase como banco de dados para o Sistema de Propósito.

## 📋 Pré-requisitos

- Conta no Google (para acessar o Firebase Console)
- Projeto React configurado
- Node.js instalado

## 🚀 Passo a Passo

### 1. Criar Projeto no Firebase Console

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Criar um projeto"
3. Digite um nome para o projeto (ex: "sistema-proposito")
4. Desabilite o Google Analytics (opcional)
5. Clique em "Criar projeto"

### 2. Configurar Firestore Database

1. No menu lateral, clique em "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha "Iniciar no modo de teste" (para desenvolvimento)
4. Escolha a localização mais próxima (ex: "us-central1")
5. Clique em "Ativar"

### 3. Configurar Regras de Segurança

1. Na aba "Regras", substitua as regras padrão por:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura e escrita para todos (modo desenvolvimento)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **IMPORTANTE**: Estas regras permitem acesso total. Para produção, configure regras mais restritivas.

### 4. Obter Configurações do Projeto

1. Clique na engrenagem (⚙️) ao lado de "Visão geral do projeto"
2. Selecione "Configurações do projeto"
3. Role para baixo até "Seus aplicativos"
4. Clique no ícone da web (</>)
5. Digite um nome para o app (ex: "sistema-proposito-web")
6. Clique em "Registrar app"
7. Copie as configurações que aparecem

### 5. Configurar Variáveis de Ambiente

1. Crie um arquivo `.env` na raiz do projeto
2. Adicione as seguintes variáveis (substitua pelos valores reais):

```env
REACT_APP_FIREBASE_API_KEY=sua-api-key-aqui
REACT_APP_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=seu-projeto-id
REACT_APP_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=seu-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=seu-app-id
```

### 6. Atualizar Arquivo de Configuração

1. Abra `src/firebase/config.js`
2. Substitua as configurações de exemplo pelas suas configurações reais
3. Ou mantenha as variáveis de ambiente (recomendado)

### 7. Testar a Integração

1. Execute `npm start` para iniciar o projeto
2. Preencha o questionário com dados de teste
3. Verifique no Firebase Console se os dados foram salvos
4. Acesse o dashboard RH para ver os dados carregados

## 🔧 Estrutura dos Dados

O Firestore criará automaticamente uma coleção chamada `usuarios` com documentos contendo:

```javascript
{
  nome: "Nome do Usuário",
  cpf: "000.000.000-00",
  respostas: [[], [], [], []], // Array com as respostas
  score: 85, // Pontuação calculada
  status: "ACIMA DA EXPECTATIVA",
  analiseClinica: {
    perfil: "Descrição do perfil...",
    competencias: ["Comp1", "Comp2"],
    areasDesenvolvimento: ["Area1", "Area2"],
    recomendacoes: ["Rec1", "Rec2"],
    adaptabilidade: "Descrição...",
    lideranca: "Descrição...",
    relacionamentoInterpessoal: "Descrição..."
  },
  dataRealizacao: "01/01/2024",
  timestamp: Timestamp, // Automático do Firebase
  createdAt: "2024-01-01T00:00:00.000Z"
}
```

## 🚨 Solução de Problemas

### Erro: "Firebase App named '[DEFAULT]' already exists"

- Verifique se não há múltiplas importações do Firebase
- Certifique-se de que o arquivo de configuração é importado apenas uma vez

### Erro: "Missing or insufficient permissions"

- Verifique as regras de segurança do Firestore
- Certifique-se de que as regras permitem leitura/escrita

### Dados não aparecem no dashboard

- Verifique o console do navegador para erros
- Confirme se as configurações do Firebase estão corretas
- Verifique se o Firestore está ativo no projeto

## 🔒 Segurança para Produção

Para ambiente de produção, configure regras mais restritivas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /usuarios/{document} {
      // Permitir leitura apenas para usuários autenticados
      allow read: if request.auth != null;
      // Permitir escrita apenas para usuários autenticados
      allow write: if request.auth != null;
    }
  }
}
```

## 📱 Próximos Passos

- Implementar autenticação de usuários
- Adicionar validação de dados no backend
- Configurar backup automático
- Implementar cache offline
- Adicionar analytics e monitoramento

## 🆘 Suporte

Se encontrar problemas:
1. Verifique o console do navegador
2. Consulte a [documentação oficial do Firebase](https://firebase.google.com/docs)
3. Verifique as regras de segurança do Firestore
4. Confirme se todas as dependências estão instaladas

---

**🎯 Dica**: Mantenha o Firebase Console aberto durante o desenvolvimento para monitorar as operações em tempo real!

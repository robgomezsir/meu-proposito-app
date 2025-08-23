# 🎯 Sistema de Propósito

Aplicação React para gerenciamento de propósitos e metas pessoais.

## 🚀 **Deploy Automático**

Esta aplicação está configurada para deploy automático no GitHub Pages através do GitHub Actions.

### **Como funciona:**
1. Faça alterações no código
2. Commit e push para branch `main`
3. GitHub Actions executa deploy automático
4. Aplicação fica online em minutos

## 📋 **Configuração**

- **URL de Produção**: https://robgomezsir.github.io/meu-proposito-app
- **Branch Principal**: `main`
- **Deploy**: Automático via GitHub Actions

## 🛠️ **Scripts Disponíveis**

```bash
# Desenvolvimento
npm start          # Inicia servidor de desenvolvimento
npm test           # Executa testes
npm run build      # Cria build de produção

# Deploy (automático via GitHub Actions)
git add .
git commit -m "Sua mensagem"
git push origin main
```

## 📁 **Estrutura do Projeto**

```
meu-proposito-app/
├── src/
│   ├── components/
│   │   └── SistemaProposito.jsx    # Componente principal
│   ├── App.js                       # App principal
│   ├── index.js                     # Ponto de entrada
│   └── index.css                    # Estilos globais
├── public/                          # Arquivos públicos
├── .github/workflows/               # GitHub Actions
├── tailwind.config.js               # Configuração Tailwind
├── postcss.config.js                # Configuração PostCSS
└── package.json                     # Dependências
```

## 📱 **Funcionalidades**

- ✅ **Tela de Login** - Nome e CPF
- ✅ **Formulário de Propósito** - 4 perguntas interativas
- ✅ **Dashboard** - Estatísticas em tempo real
- ✅ **Design Moderno** - Tailwind CSS responsivo
- ✅ **Interface Intuitiva** - Fácil de usar

## 🚀 **Para fazer deploy:**

```bash
# 1. Fazer alterações no código
# 2. Commit das alterações
git add .
git commit -m "Descrição das alterações"

# 3. Push para main (deploy automático)
git push origin main
```

## 🌐 **Acesse a aplicação:**

**https://robgomezsir.github.io/meu-proposito-app**

## 📚 **Tecnologias**

- **React 18** - Framework principal
- **Tailwind CSS** - Estilização
- **GitHub Actions** - Deploy automático
- **GitHub Pages** - Hospedagem

# Sistema de Análise de Propósito

Um sistema moderno e responsivo para avaliação de autopercepção e análise comportamental de colaboradores, desenvolvido com React e Firebase.

## ✨ Características da Nova Interface

### 🎨 Design Moderno e Responsivo
- **Sistema de Design Baseado no shadcn/ui**: Componentes reutilizáveis e consistentes
- **Interface Glassmorphism**: Efeitos de vidro e transparência para um visual premium
- **Gradientes e Sombras**: Design visualmente atrativo com gradientes modernos
- **Animações Suaves**: Transições e micro-interações para melhor experiência do usuário

### 📱 Responsividade Total
- **Mobile-First**: Design otimizado para dispositivos móveis
- **Breakpoints Inteligentes**: Adaptação perfeita para tablets e desktops
- **Touch-Friendly**: Interface otimizada para toque em dispositivos móveis

### 🎯 Componentes Reutilizáveis
- **Button**: Múltiplas variantes (default, gradient, outline, destructive)
- **Input**: Campos de formulário com validação visual
- **Card**: Sistema de cards com header, content e footer
- **Badge**: Indicadores visuais com diferentes estilos

### 🌈 Sistema de Cores Moderno
- **Variáveis CSS**: Sistema de cores consistente e personalizável
- **Modo Escuro**: Suporte para tema escuro (preparado para implementação)
- **Paleta Harmoniosa**: Cores que seguem as melhores práticas de acessibilidade

## 🚀 Funcionalidades

### 📋 Questionário de Autopercepção
- **4 Perguntas Estruturadas**: Avaliação de características, valores e comportamentos
- **Seleção Múltipla**: Escolha de exatamente 5 opções por pergunta
- **Validação em Tempo Real**: Feedback visual imediato para o usuário
- **Progresso Visual**: Barra de progresso com animações suaves

### 🔐 Sistema de Autenticação
- **Validação de CPF**: Verificação automática de CPF válido
- **Validação de Nome**: Verificação de nome completo
- **Prevenção de Duplicatas**: Sistema anti-fraude com verificação de CPF

### 📊 Dashboard RH
- **Análise Individual**: Relatórios detalhados por colaborador
- **Estatísticas Gerais**: Visão consolidada de todos os participantes
- **Exportação de Dados**: Relatórios em formato texto e backup JSON
- **Gestão de Dados**: Limpeza e manutenção do sistema

### 🔥 Integração Firebase
- **Armazenamento em Nuvem**: Dados persistentes e seguros
- **Sincronização em Tempo Real**: Atualizações automáticas
- **Backup Automático**: Sistema de backup integrado

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18**: Framework principal com hooks modernos
- **Tailwind CSS**: Framework CSS utilitário para design responsivo
- **Lucide React**: Ícones modernos e consistentes
- **Componentes Customizados**: Sistema de design próprio baseado no shadcn/ui

### Backend
- **Firebase Firestore**: Banco de dados em tempo real
- **Firebase Authentication**: Sistema de autenticação (preparado)
- **Firebase Hosting**: Hospedagem e deploy automático

### Ferramentas de Desenvolvimento
- **Vite**: Build tool rápido e moderno
- **ESLint**: Linting de código
- **Prettier**: Formatação automática de código

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── ui/                    # Componentes base do sistema de design
│   │   ├── Button.jsx        # Botões com variantes
│   │   ├── Input.jsx         # Campos de entrada
│   │   ├── Card.jsx          # Sistema de cards
│   │   └── Badge.jsx         # Indicadores visuais
│   ├── RegistrationForm.jsx  # Formulário de cadastro moderno
│   ├── QuestionnaireLayout.jsx # Layout do questionário
│   ├── SuccessScreen.jsx     # Tela de sucesso
│   └── SistemaProposito.jsx  # Componente principal
├── firebase/                  # Configurações e serviços Firebase
├── utils/                     # Utilitários (cn.js para classes CSS)
└── index.css                  # Estilos globais e sistema de design
```

## 🎨 Sistema de Design

### Componentes Base
- **Button**: 7 variantes diferentes com estados hover, focus e disabled
- **Input**: Campos com validação visual e feedback em tempo real
- **Card**: Sistema flexível para layouts de conteúdo
- **Badge**: Indicadores com múltiplos estilos e tamanhos

### Animações
- **Fade In**: Aparição suave de elementos
- **Slide Up**: Movimento ascendente para elementos
- **Bounce In**: Animação de entrada com bounce
- **Hover Effects**: Efeitos de elevação e transformação

### Cores e Temas
- **Primary**: Azul indigo para ações principais
- **Secondary**: Cinza para elementos secundários
- **Success**: Verde para confirmações
- **Warning**: Amarelo para avisos
- **Destructive**: Vermelho para ações perigosas

## 🚀 Como Executar

### Pré-requisitos
- Node.js 16+ 
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone [url-do-repositorio]

# Entre na pasta
cd meu-proposito-app

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp env.example .env

# Execute em modo de desenvolvimento
npm start
```

### Configuração Firebase
1. Crie um projeto no Firebase Console
2. Configure o Firestore Database
3. Copie as credenciais para `src/firebase/config.js`
4. Ative as regras de segurança apropriadas

## 📱 Responsividade

### Breakpoints
- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md, lg)
- **Desktop**: > 1024px (xl, 2xl)

### Adaptações
- **Grid Responsivo**: Layouts que se adaptam ao tamanho da tela
- **Tipografia Fluida**: Tamanhos de fonte que se ajustam
- **Espaçamento Adaptativo**: Margens e paddings responsivos
- **Navegação Touch**: Otimizada para dispositivos móveis

## 🔧 Personalização

### Cores
Edite as variáveis CSS em `src/index.css`:
```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --secondary: 210 40% 96%;
  /* ... outras variáveis */
}
```

### Componentes
Todos os componentes UI são customizáveis através de props:
```jsx
<Button 
  variant="gradient" 
  size="xl" 
  className="custom-class"
>
  Botão Personalizado
</Button>
```

## 📊 Performance

### Otimizações Implementadas
- **Lazy Loading**: Componentes carregados sob demanda
- **Memoização**: Uso de useCallback e useMemo para otimização
- **CSS Variables**: Sistema de cores eficiente
- **Bundle Splitting**: Separação de código por funcionalidade

### Métricas
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## 🤝 Contribuição

### Padrões de Código
- **ESLint**: Configuração estrita para qualidade
- **Prettier**: Formatação automática
- **Conventional Commits**: Padrão de commits
- **Component-First**: Arquitetura baseada em componentes

### Estrutura de Commits
```
feat: adiciona novo componente de validação
fix: corrige bug na validação de CPF
docs: atualiza documentação do sistema
style: melhora design do formulário
refactor: refatora lógica de validação
```

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🙏 Agradecimentos

- **shadcn/ui**: Inspiração para o sistema de design
- **Tailwind CSS**: Framework CSS utilitário
- **Lucide**: Ícones modernos e consistentes
- **Firebase**: Backend como serviço

---

**Desenvolvido com ❤️ para melhorar a experiência de avaliação de propósito**

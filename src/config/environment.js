// Configuração automática de ambiente
const getEnvironmentConfig = () => {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  
  // Detectar se está no GitHub Pages
  const isGitHubPages = hostname.includes('github.io') || pathname.includes('/meu-proposito-app');
  
  // Detectar se está no Render
  const isRender = hostname.includes('onrender.com');
  
  // Detectar se está em desenvolvimento local
  const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
  
  if (isGitHubPages) {
    return {
      environment: 'github-pages',
      basePath: '/meu-proposito-app',
      apiBase: '/meu-proposito-app',
      isProduction: true
    };
  } else if (isRender) {
    return {
      environment: 'render',
      basePath: '',
      apiBase: '',
      isProduction: true
    };
  } else if (isLocal) {
    return {
      environment: 'local',
      basePath: '',
      apiBase: 'http://localhost:3000',
      isProduction: false
    };
  } else {
    // Fallback para outros ambientes
    return {
      environment: 'unknown',
      basePath: '',
      apiBase: '',
      isProduction: true
    };
  }
};

// Configuração atual do ambiente
export const envConfig = getEnvironmentConfig();

// Log da configuração para debug
console.log('🌍 Configuração de ambiente detectada:', envConfig);

export default envConfig;

// Configuração automática de ambiente
// Detecta e configura automaticamente GitHub Pages e Render

const getEnvironmentConfig = () => {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  
  // Detectar se está no GitHub Pages
  const isGitHubPages = hostname.includes('github.io') || pathname.includes('/meu-proposito-app');
  
  // Detectar se está no Render
  const isRender = hostname.includes('onrender.com');
  
  // Detectar se está em desenvolvimento local
  const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
  
  // Detectar se está em produção
  const isProduction = !isLocal;
  
  if (isGitHubPages) {
    return {
      environment: 'github-pages',
      basePath: '/meu-proposito-app',
      apiBase: '/meu-proposito-app',
      isProduction,
      platform: 'github-pages',
      assetPrefix: '/meu-proposito-app'
    };
  } else if (isRender) {
    return {
      environment: 'render',
      basePath: '',
      apiBase: '',
      isProduction,
      platform: 'render',
      assetPrefix: ''
    };
  } else if (isLocal) {
    return {
      environment: 'local',
      basePath: '',
      apiBase: 'http://localhost:3000',
      isProduction: false,
      platform: 'local',
      assetPrefix: ''
    };
  } else {
    // Fallback para outros ambientes
    return {
      environment: 'unknown',
      basePath: '',
      apiBase: '',
      isProduction: true,
      platform: 'unknown',
      assetPrefix: ''
    };
  }
};

// Configuração atual do ambiente
export const envConfig = getEnvironmentConfig();

// Log da configuração para debug
console.log('🌍 Configuração de ambiente detectada:', envConfig);

// Função para obter URL de assets
export const getAssetUrl = (path) => {
  if (path.startsWith('http')) return path;
  
  // Para GitHub Pages, usar caminhos absolutos
  if (envConfig.platform === 'github-pages') {
    return `${envConfig.assetPrefix}${path}`;
  }
  
  // Para outros ambientes, usar caminhos relativos
  return path.startsWith('/') ? path : `./${path}`;
};

// Função para obter URL de API
export const getApiUrl = (endpoint) => {
  if (endpoint.startsWith('http')) return endpoint;
  return `${envConfig.apiBase}${endpoint}`;
};

export default envConfig;

// Configuração específica para o React
// Usa as variáveis de ambiente para configurar caminhos corretamente

const getReactConfig = () => {
  // Detectar ambiente
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  
  const isGitHubPages = hostname.includes('github.io') || pathname.includes('/meu-proposito-app');
  const isRender = hostname.includes('onrender.com');
  const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
  
  // Configuração base
  let config;
  
  if (isGitHubPages) {
    config = {
      environment: 'github-pages',
      basePath: '/meu-proposito-app',
      assetPrefix: '/meu-proposito-app',
      useAbsolutePaths: true,
      publicUrl: '/meu-proposito-app'
    };
  } else if (isRender) {
    config = {
      environment: 'render',
      basePath: '',
      assetPrefix: '',
      useAbsolutePaths: false,
      publicUrl: ''
    };
  } else if (isLocal) {
    config = {
      environment: 'local',
      basePath: '',
      assetPrefix: '',
      useAbsolutePaths: false,
      publicUrl: ''
    };
  } else {
    config = {
      environment: 'unknown',
      basePath: '',
      assetPrefix: '',
      useAbsolutePaths: false,
      publicUrl: ''
    };
  }
  
  return config;
};

// Configuração atual
export const reactConfig = getReactConfig();

// Função para corrigir URLs de assets
export const fixAssetUrl = (url) => {
  if (!url || url.startsWith('http')) return url;
  
  if (reactConfig.useAbsolutePaths) {
    return url.startsWith('/') ? url : `/${url}`;
  } else {
    return url.startsWith('/') ? url.substring(1) : url;
  }
};

// Função para corrigir URLs de navegação
export const fixNavigationUrl = (url) => {
  if (!url || url.startsWith('http')) return url;
  
  if (reactConfig.useAbsolutePaths) {
    return `${reactConfig.basePath}${url.startsWith('/') ? url : `/${url}`}`;
  } else {
    return url.startsWith('/') ? url : `/${url}`;
  }
};

console.log('🔧 Configuração React:', reactConfig);

export default reactConfig;

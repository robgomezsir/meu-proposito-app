// Configuração estática de ambiente
// Não depende de scripts externos ou variáveis de ambiente

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
      assetPrefix: '/meu-proposito-app',
      useAbsolutePaths: true,
      publicUrl: '/meu-proposito-app'
    };
  } else if (isRender) {
    return {
      environment: 'render',
      basePath: '',
      assetPrefix: '',
      useAbsolutePaths: false,
      publicUrl: ''
    };
  } else if (isLocal) {
    return {
      environment: 'local',
      basePath: '',
      assetPrefix: '',
      useAbsolutePaths: false,
      publicUrl: ''
    };
  } else {
    // Fallback para outros ambientes
    return {
      environment: 'unknown',
      basePath: '',
      assetPrefix: '',
      useAbsolutePaths: false,
      publicUrl: ''
    };
  }
};

// Configuração atual
export const envConfig = getEnvironmentConfig();

// Função para corrigir URLs de assets
export const fixAssetUrl = (url) => {
  if (!url || url.startsWith('http')) return url;
  
  if (envConfig.useAbsolutePaths) {
    return url.startsWith('/') ? url : `/${url}`;
  } else {
    return url.startsWith('/') ? url.substring(1) : url;
  }
};

// Função para corrigir URLs de navegação
export const fixNavigationUrl = (url) => {
  if (!url || url.startsWith('http')) return url;
  
  if (envConfig.useAbsolutePaths) {
    return `${envConfig.basePath}${url.startsWith('/') ? url : `/${url}`}`;
  } else {
    return url.startsWith('/') ? url : `/${url}`;
  }
};

console.log('🌍 Configuração de ambiente estática:', envConfig);

export default envConfig;

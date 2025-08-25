// Configuração de build dinâmica
// Detecta automaticamente o ambiente e configura os caminhos

const getBuildConfig = () => {
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
      basePath: '/meu-proposito-app',
      assetPrefix: '/meu-proposito-app',
      useAbsolutePaths: true
    };
  } else if (isRender) {
    return {
      basePath: '',
      assetPrefix: '',
      useAbsolutePaths: false
    };
  } else if (isLocal) {
    return {
      basePath: '',
      assetPrefix: '',
      useAbsolutePaths: false
    };
  } else {
    // Fallback para outros ambientes
    return {
      basePath: '',
      assetPrefix: '',
      useAbsolutePaths: false
    };
  }
};

// Configuração atual
export const buildConfig = getBuildConfig();

// Função para corrigir URLs de assets
export const fixAssetUrl = (url) => {
  if (!url || url.startsWith('http')) return url;
  
  if (buildConfig.useAbsolutePaths) {
    // Para GitHub Pages, usar caminhos absolutos
    return url.startsWith('/') ? url : `/${url}`;
  } else {
    // Para outros ambientes, usar caminhos relativos
    return url.startsWith('/') ? url.substring(1) : url;
  }
};

// Função para corrigir URLs de navegação
export const fixNavigationUrl = (url) => {
  if (!url || url.startsWith('http')) return url;
  
  if (buildConfig.useAbsolutePaths) {
    // Para GitHub Pages, incluir o basePath
    return `${buildConfig.basePath}${url.startsWith('/') ? url : `/${url}`}`;
  } else {
    // Para outros ambientes, usar caminhos relativos
    return url.startsWith('/') ? url : `/${url}`;
  }
};

console.log('🔧 Configuração de build:', buildConfig);

export default buildConfig;

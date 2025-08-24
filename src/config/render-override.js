// Sobrescrita específica para o Render
// Este arquivo força o React a usar caminhos relativos

// Sobrescrever o PUBLIC_URL se estivermos no Render
if (window.location.hostname.includes('onrender.com')) {
  // Forçar caminhos relativos
  window.__PUBLIC_URL__ = '';
  
  // Sobrescrever qualquer configuração de base path
  if (window.__REACT_APP_BASE_PATH__) {
    window.__REACT_APP_BASE_PATH__ = '';
  }
  
  console.log('🔧 Render override aplicado - caminhos relativos forçados');
}

export default {};

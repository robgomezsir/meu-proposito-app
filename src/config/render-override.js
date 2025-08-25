// Sobrescrita específica para o Render
// Este arquivo força o React a usar caminhos relativos

import { useEffect } from 'react';

// Hook personalizado para sobrescrever configurações do Render
export const useRenderOverride = () => {
  useEffect(() => {
    // Verificar se estamos no Render
    if (window.location.hostname.includes('onrender.com')) {
      console.log('🔧 Render override aplicado - caminhos relativos forçados');
      
      // Sobrescrever o PUBLIC_URL
      window.__PUBLIC_URL__ = '';
      
      // Sobrescrever qualquer configuração de base path
      if (window.__REACT_APP_BASE_PATH__) {
        window.__REACT_APP_BASE_PATH__ = '';
      }
      
      console.log('✅ Render override configurado');
    }
  }, []);
};

export default useRenderOverride;

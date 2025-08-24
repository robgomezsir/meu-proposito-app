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
      
      // Interceptar e corrigir URLs de recursos dinamicamente
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // Corrigir scripts
              if (node.tagName === 'SCRIPT' && node.src) {
                if (node.src.includes('/meu-proposito-app/')) {
                  node.src = node.src.replace('/meu-proposito-app/', '/');
                  console.log('🔧 Script corrigido:', node.src);
                }
              }
              
              // Corrigir links
              if (node.tagName === 'LINK' && node.href) {
                if (node.href.includes('/meu-proposito-app/')) {
                  node.href = node.href.replace('/meu-proposito-app/', '/');
                  console.log('🔧 Link corrigido:', node.href);
                }
              }
            }
          });
        });
      });
      
      // Observar mudanças no DOM
      observer.observe(document.head, { childList: true, subtree: true });
      observer.observe(document.body, { childList: true, subtree: true });
      
      console.log('✅ Observer configurado para corrigir URLs dinamicamente');
    }
  }, []);
};

export default useRenderOverride;

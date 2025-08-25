// Sobrescrita de build para corrigir caminhos após o React carregar
// Este arquivo é executado após o React carregar

import { useEffect } from 'react';

// Hook para aplicar correções de build
export const useBuildOverride = () => {
  useEffect(() => {
    // Aguardar o React carregar completamente
    const applyBuildOverrides = () => {
      const buildConfig = window.__BUILD_CONFIG__;
      
      if (!buildConfig) {
        console.log('⚠️ Build config não encontrado, aguardando...');
        setTimeout(applyBuildOverrides, 100);
        return;
      }
      
      console.log('🔧 Aplicando correções de build:', buildConfig);
      
      if (!buildConfig.useAbsolutePaths) {
        // Para ambientes que não usam caminhos absolutos (Render, local)
        console.log('🔧 Corrigindo caminhos para ambiente relativo');
        
        // Corrigir scripts
        const scripts = document.querySelectorAll('script[src]');
        scripts.forEach(script => {
          if (script.src.includes('/meu-proposito-app/')) {
            const newSrc = script.src.replace('/meu-proposito-app/', './');
            script.src = newSrc;
            console.log('🔧 Script corrigido:', newSrc);
          }
        });
        
        // Corrigir links CSS
        const links = document.querySelectorAll('link[href]');
        links.forEach(link => {
          if (link.href.includes('/meu-proposito-app/')) {
            const newHref = link.href.replace('/meu-proposito-app/', './');
            link.href = newHref;
            console.log('🔧 Link CSS corrigido:', newHref);
          }
        });
        
        // Corrigir imagens e outros recursos
        const images = document.querySelectorAll('img[src]');
        images.forEach(img => {
          if (img.src.includes('/meu-proposito-app/')) {
            const newSrc = img.src.replace('/meu-proposito-app/', './');
            img.src = newSrc;
            console.log('🔧 Imagem corrigida:', newSrc);
          }
        });
      }
      
      console.log('✅ Correções de build aplicadas');
    };
    
    // Aplicar correções após um pequeno delay para garantir que o React carregou
    setTimeout(applyBuildOverrides, 500);
  }, []);
};

export default useBuildOverride;

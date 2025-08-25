// Configuração específica para o Render
// Este arquivo é carregado ANTES do React e sobrescreve configurações

(function() {
  'use strict';
  
  console.log('🔧 Render config carregando...');
  
  // Detectar se estamos no Render
  if (window.location.hostname.includes('onrender.com')) {
    console.log('🔧 Render detectado - aplicando configurações específicas');
    
    // Sobrescrever o PUBLIC_URL ANTES do React carregar
    window.__PUBLIC_URL__ = '';
    
    // Sobrescrever qualquer configuração de base path
    if (window.__REACT_APP_BASE_PATH__) {
      window.__REACT_APP_BASE_PATH__ = '';
    }
    
    // Forçar caminhos relativos
    window.__FORCE_RELATIVE_PATHS__ = true;
    
    // Sobrescrever o process.env se existir
    if (window.process && window.process.env) {
      window.process.env.PUBLIC_URL = '';
      window.process.env.REACT_APP_BASE_PATH = '';
    }
    
    // Interceptar e corrigir URLs de recursos ANTES do React
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName) {
      const element = originalCreateElement.call(document, tagName);
      
      if (tagName.toLowerCase() === 'script' || tagName.toLowerCase() === 'link') {
        const originalSetAttribute = element.setAttribute;
        element.setAttribute = function(name, value) {
          if (name === 'src' || name === 'href') {
            // Corrigir caminhos que começam com /meu-proposito-app/
            if (value && value.startsWith('/meu-proposito-app/')) {
              value = value.replace('/meu-proposito-app/', '/');
              console.log('🔧 Caminho corrigido:', value);
            }
          }
          return originalSetAttribute.call(this, name, value);
        };
      }
      
      return element;
    };
    
    // Interceptar e corrigir URLs já existentes
    setTimeout(() => {
      const scripts = document.querySelectorAll('script[src]');
      scripts.forEach(script => {
        if (script.src.includes('/meu-proposito-app/')) {
          script.src = script.src.replace('/meu-proposito-app/', '/');
          console.log('🔧 Script existente corrigido:', script.src);
        }
      });
      
      const links = document.querySelectorAll('link[href]');
      links.forEach(link => {
        if (link.href.includes('/meu-proposito-app/')) {
          link.href = link.href.replace('/meu-proposito-app/', '/');
          console.log('🔧 Link existente corrigido:', link.href);
        }
      });
    }, 100);
    
    console.log('✅ Configurações do Render aplicadas com interceptação completa');
  } else {
    console.log('ℹ️ Não é Render - usando configurações padrão');
  }
})();

// Hook para aplicar configurações específicas do Render
// Este arquivo é usado para sobrescrever configurações quando necessário

import { useEffect } from 'react';

const useRenderOverride = () => {
  useEffect(() => {
    // Aplicar configurações específicas do Render se necessário
    // Por enquanto, não há configurações específicas para aplicar
    
    // Log para debug
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 Render Override aplicado');
    }
  }, []);
};

export default useRenderOverride;

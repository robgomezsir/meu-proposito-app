// Configuração do Modo de Manutenção
export const MAINTENANCE_CONFIG = {
  // Ativar/desativar modo de manutenção
  enabled: process.env.REACT_APP_MAINTENANCE_MODE === 'true',
  
  // Configurações da tela de manutenção
  title: '🚧 Sistema em Manutenção',
  message: 'Estamos implementando melhorias importantes. Voltaremos em breve!',
  
  // Informações técnicas
  technicalInfo: {
    migration: 'Firebase → Supabase',
    status: 'Em andamento',
    estimatedTime: 'Poucos minutos'
  },
  
  // Configurações de rede
  network: {
    allowLocalhost: true,  // Permitir acesso local durante manutenção
    allowAdmin: true       // Permitir acesso de administradores
  },
  
  // Mensagens personalizadas
  messages: {
    development: 'Modo de desenvolvimento ativo',
    production: 'Sistema em manutenção programada',
    emergency: 'Manutenção de emergência'
  }
};

// Função para verificar se está em manutenção
export const isMaintenanceMode = () => {
  return MAINTENANCE_CONFIG.enabled;
};

// Função para verificar se pode acessar (exceções)
export const canAccessDuringMaintenance = (userEmail) => {
  if (!isMaintenanceMode()) return true;
  
  // Permitir acesso local
  if (window.location.hostname === 'localhost' || 
      window.location.hostname === '127.0.0.1') {
    return true;
  }
  
  // Permitir acesso de administradores
  const adminEmails = ['robgomez.sir@gmail.com'];
  if (adminEmails.includes(userEmail)) {
    return true;
  }
  
  return false;
};

// Função para obter mensagem de manutenção
export const getMaintenanceMessage = () => {
  const env = process.env.NODE_ENV || 'development';
  return MAINTENANCE_CONFIG.messages[env] || MAINTENANCE_CONFIG.messages.development;
};

// Função para ativar modo de manutenção via console (apenas desenvolvimento)
export const enableMaintenanceMode = () => {
  if (process.env.NODE_ENV === 'development') {
    localStorage.setItem('maintenance_mode', 'true');
    window.location.reload();
  }
};

// Função para desativar modo de manutenção via console (apenas desenvolvimento)
export const disableMaintenanceMode = () => {
  if (process.env.NODE_ENV === 'development') {
    localStorage.removeItem('maintenance_mode');
    window.location.reload();
  }
};

export default MAINTENANCE_CONFIG;

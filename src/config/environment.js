// Configuração de ambiente para o Sistema de Propósito
export const config = {
  // Configurações do Supabase
  supabase: {
    url: process.env.REACT_APP_SUPABASE_URL || 'https://your-project.supabase.co',
    anonKey: process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key-here'
  },
  
  // Configurações do sistema
  system: {
    environment: process.env.REACT_APP_ENV || 'development',
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:3000',
    logLevel: process.env.REACT_APP_LOG_LEVEL || 'info'
  },
  
  // Configurações de autenticação
  auth: {
    tokenExpiry: parseInt(process.env.REACT_APP_TOKEN_EXPIRY) || 3600,
    adminEmail: 'robgomez.sir@gmail.com'
  },
  
  // Configurações de migração
  migration: {
    enabled: process.env.REACT_APP_MIGRATION_ENABLED === 'true',
    batchSize: parseInt(process.env.REACT_APP_MIGRATION_BATCH_SIZE) || 100
  }
};

// Função para verificar se as configurações estão válidas
export const validateConfig = () => {
  const errors = [];
  
  if (!config.supabase.url || config.supabase.url === 'https://your-project.supabase.co') {
    errors.push('REACT_APP_SUPABASE_URL não configurada');
  }
  
  if (!config.supabase.anonKey || config.supabase.anonKey === 'your-anon-key-here') {
    errors.push('REACT_APP_SUPABASE_ANON_KEY não configurada');
  }
  
  if (errors.length > 0) {
    console.error('❌ Erros de configuração:', errors);
    return false;
  }
  
  console.log('✅ Configurações válidas');
  return true;
};

// Função para obter configuração específica
export const getConfig = (key) => {
  const keys = key.split('.');
  let value = config;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return undefined;
    }
  }
  
  return value;
};

// Função para verificar se está em produção
export const isProduction = () => {
  return config.system.environment === 'production';
};

// Função para verificar se está em desenvolvimento
export const isDevelopment = () => {
  return config.system.environment === 'development';
};

// Função para logging baseado no nível configurado
export const log = (level, message, ...args) => {
  const levels = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
  };
  
  const currentLevel = levels[config.system.logLevel] || 1;
  const messageLevel = levels[level] || 1;
  
  if (messageLevel >= currentLevel) {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    
    switch (level) {
      case 'debug':
        console.debug(prefix, message, ...args);
        break;
      case 'info':
        console.info(prefix, message, ...args);
        break;
      case 'warn':
        console.warn(prefix, message, ...args);
        break;
      case 'error':
        console.error(prefix, message, ...args);
        break;
      default:
        console.log(prefix, message, ...args);
    }
  }
};

export default config;

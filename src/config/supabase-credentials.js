// Credenciais do Supabase - Sistema de Propósito
export const SUPABASE_CREDENTIALS = {
  url: 'https://zibuyabpsvgulvigvdtb.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppYnV5YWJwc3ZndWx2aWd2ZHRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNzQ3NjUsImV4cCI6MjA3MTc1MDc2NX0.a1EoCpinPFQqBd_ZYOT7n7iViH3NCwIzldzcBLlvfNo'
};

// Configurações do sistema
export const SYSTEM_CONFIG = {
  environment: 'development',
  apiUrl: 'http://localhost:3000',
  logLevel: 'info',
  migrationEnabled: true,
  migrationBatchSize: 100
};

// Configurações de autenticação
export const AUTH_CONFIG = {
  tokenExpiry: 3600,
  adminEmail: 'robgomez.sir@gmail.com'
};

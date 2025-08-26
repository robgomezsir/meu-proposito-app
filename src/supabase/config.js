import { createClient } from '@supabase/supabase-js'
import { SUPABASE_CREDENTIALS } from '../config/supabase-credentials'

// Configuração do Supabase - Credenciais reais
const supabaseUrl = SUPABASE_CREDENTIALS.url
const supabaseAnonKey = SUPABASE_CREDENTIALS.anonKey

// Criar cliente do Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Função para verificar conexão
export const testarConexaoSupabase = async () => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('❌ Erro na conexão com Supabase:', error)
      return { sucesso: false, erro: error.message }
    }
    
    console.log('✅ Conexão com Supabase estabelecida com sucesso!')
    return { sucesso: true, dados: data }
  } catch (error) {
    console.error('❌ Erro inesperado na conexão:', error)
    return { sucesso: false, erro: error.message }
  }
}

// Função para limpar dados de teste
export const limparDadosTeste = async () => {
  try {
    console.log('🧹 Limpando dados de teste do Supabase...')
    
    const { error } = await supabase
      .from('usuarios')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')
    
    if (error) {
      console.error('❌ Erro ao limpar dados de teste:', error)
      return { sucesso: false, erro: error.message }
    }
    
    console.log('✅ Dados de teste limpos com sucesso!')
    return { sucesso: true }
  } catch (error) {
    console.error('❌ Erro ao limpar dados de teste:', error)
    return { sucesso: false, erro: error.message }
  }
}

export default supabase

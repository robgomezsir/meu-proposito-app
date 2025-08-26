import { supabase } from './config'
import { migrarDadosFirebase } from './services'

// Função para exportar dados do Firebase (localStorage como fallback)
export const exportarDadosFirebase = () => {
  try {
    // Tentar obter dados do localStorage (backup)
    const dadosLocal = localStorage.getItem('usuarios')
    if (dadosLocal) {
      const usuarios = JSON.parse(dadosLocal)
      console.log(`📊 Dados encontrados no localStorage: ${usuarios.length} usuários`)
      return usuarios
    }
    
    console.log('⚠️ Nenhum dado encontrado no localStorage')
    return []
  } catch (error) {
    console.error('❌ Erro ao exportar dados do localStorage:', error)
    return []
  }
}

// Função para limpar dados do Supabase (apenas para testes)
export const limparDadosSupabase = async () => {
  try {
    console.log('🧹 Limpando dados do Supabase...')
    
    const { error } = await supabase
      .from('usuarios')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')
    
    if (error) {
      console.error('❌ Erro ao limpar dados do Supabase:', error)
      return { sucesso: false, erro: error.message }
    }
    
    console.log('✅ Dados do Supabase limpos com sucesso!')
    return { sucesso: true }
  } catch (error) {
    console.error('❌ Erro ao limpar dados:', error)
    return { sucesso: false, erro: error.message }
  }
}

// Função principal de migração
export const executarMigracao = async () => {
  try {
    console.log('🚀 INICIANDO PROCESSO DE MIGRAÇÃO FIREBASE → SUPABASE')
    console.log('=' .repeat(60))
    
    // 1. Exportar dados do Firebase
    console.log('📤 Passo 1: Exportando dados do Firebase...')
    const dadosFirebase = exportarDadosFirebase()
    
    if (dadosFirebase.length === 0) {
      console.log('⚠️ Nenhum dado para migrar. Migração cancelada.')
      return {
        sucesso: false,
        mensagem: 'Nenhum dado encontrado para migração'
      }
    }
    
    console.log(`✅ ${dadosFirebase.length} usuários encontrados para migração`)
    
    // 2. Executar migração
    console.log('🔄 Passo 2: Executando migração...')
    const resultado = await migrarDadosFirebase(dadosFirebase)
    
    if (resultado.sucesso) {
      console.log('🎉 MIGRAÇÃO CONCLUÍDA COM SUCESSO!')
      console.log(`📊 Total migrado: ${resultado.total}`)
      console.log(`✅ Sucessos: ${resultado.sucessos}`)
      console.log(`❌ Erros: ${resultado.erros}`)
      
      // 3. Limpar dados antigos (opcional)
      if (resultado.sucessos > 0) {
        console.log('🧹 Passo 3: Limpando dados antigos do localStorage...')
        localStorage.removeItem('usuarios')
        console.log('✅ Dados antigos removidos com sucesso!')
      }
      
      return {
        sucesso: true,
        total: resultado.total,
        sucessos: resultado.sucessos,
        erros: resultado.erros,
        mensagem: 'Migração concluída com sucesso!'
      }
    } else {
      console.error('❌ MIGRAÇÃO FALHOU!')
      return {
        sucesso: false,
        erro: resultado.erro,
        mensagem: 'Erro durante a migração'
      }
    }
  } catch (error) {
    console.error('❌ ERRO CRÍTICO DURANTE MIGRAÇÃO:', error)
    return {
      sucesso: false,
      erro: error.message,
      mensagem: 'Erro crítico durante migração'
    }
  }
}

// Função para verificar status da migração
export const verificarStatusMigracao = async () => {
  try {
    console.log('🔍 Verificando status da migração...')
    
    // Verificar dados no Supabase
    const { data: usuariosSupabase, error: errorSupabase } = await supabase
      .from('usuarios')
      .select('count')
      .limit(1)
    
    if (errorSupabase) {
      console.error('❌ Erro ao verificar Supabase:', errorSupabase)
      return {
        sucesso: false,
        erro: errorSupabase.message
      }
    }
    
    // Verificar dados no localStorage
    const dadosLocal = localStorage.getItem('usuarios')
    const usuariosLocal = dadosLocal ? JSON.parse(dadosLocal) : []
    
    console.log('📊 Status da migração:')
    console.log(`   • Supabase: ${usuariosSupabase?.length || 0} usuários`)
    console.log(`   • LocalStorage: ${usuariosLocal.length} usuários`)
    
    return {
      sucesso: true,
      supabase: usuariosSupabase?.length || 0,
      localStorage: usuariosLocal.length,
      migracaoCompleta: usuariosSupabase?.length > 0 && usuariosLocal.length === 0
    }
  } catch (error) {
    console.error('❌ Erro ao verificar status:', error)
    return {
      sucesso: false,
      erro: error.message
    }
  }
}

// Função para reverter migração (restaurar dados do localStorage)
export const reverterMigracao = async () => {
  try {
    console.log('🔄 Revertendo migração...')
    
    // Verificar se há backup no localStorage
    const dadosLocal = localStorage.getItem('usuarios')
    if (!dadosLocal) {
      console.log('⚠️ Nenhum backup encontrado para reverter')
      return {
        sucesso: false,
        mensagem: 'Nenhum backup encontrado'
      }
    }
    
    // Limpar dados do Supabase
    const resultadoLimpeza = await limparDadosSupabase()
    if (!resultadoLimpeza.sucesso) {
      return resultadoLimpeza
    }
    
    console.log('✅ Migração revertida com sucesso!')
    return {
      sucesso: true,
      mensagem: 'Migração revertida com sucesso'
    }
  } catch (error) {
    console.error('❌ Erro ao reverter migração:', error)
    return {
      sucesso: false,
      erro: error.message
    }
  }
}

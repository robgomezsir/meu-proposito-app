import { supabase } from './config'

// Referência para a tabela de usuários
const USUARIOS_TABLE = 'usuarios'

// Adicionar novo usuário (DESABILITADO TEMPORARIAMENTE)
export const adicionarUsuario = async (usuario) => {
  console.log('🚧 ADIÇÃO DESABILITADA - Aguardando configuração do Supabase')
  console.log('📱 Salvando usuário no localStorage como fallback')
  
  // Salvar no localStorage em vez de fazer chamada à API
  try {
    const savedUsuarios = localStorage.getItem('usuarios')
    const usuarios = savedUsuarios ? JSON.parse(savedUsuarios) : []
    
    // Gerar ID temporário
    const usuarioComId = {
      ...usuario,
      id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    usuarios.push(usuarioComId)
    localStorage.setItem('usuarios', JSON.stringify(usuarios))
    
    console.log('📱 Usuário salvo no localStorage:', usuarioComId.nome)
    return usuarioComId
  } catch (error) {
    console.log('📱 Erro ao salvar no localStorage:', error)
    throw new Error('Erro ao salvar usuário temporariamente')
  }
}

// Buscar todos os usuários (DESABILITADO TEMPORARIAMENTE)
export const buscarUsuarios = async () => {
  console.log('🚧 BUSCA DESABILITADA - Aguardando configuração do Supabase')
  console.log('📱 Retornando dados do localStorage como fallback')
  
  // Retornar dados do localStorage em vez de fazer chamada à API
  try {
    const savedUsuarios = localStorage.getItem('usuarios')
    if (savedUsuarios) {
      const usuarios = JSON.parse(savedUsuarios)
      console.log(`📱 ${usuarios.length} usuários carregados do localStorage`)
      return usuarios
    }
    return []
  } catch (error) {
    console.log('📱 Erro ao carregar do localStorage, retornando array vazio')
    return []
  }
}

// Deletar usuário específico (DESABILITADO TEMPORARIAMENTE)
export const deletarUsuario = async (id) => {
  console.log(`🚧 DELEÇÃO DESABILITADA - Aguardando configuração do Supabase`)
  console.log(`📱 Deletando usuário ${id} do localStorage como fallback`)
  
  // Deletar do localStorage em vez de fazer chamada à API
  try {
    const savedUsuarios = localStorage.getItem('usuarios')
    if (savedUsuarios) {
      const usuarios = JSON.parse(savedUsuarios)
      const usuariosFiltrados = usuarios.filter(u => u.id !== id)
      localStorage.setItem('usuarios', JSON.stringify(usuariosFiltrados))
      console.log(`📱 Usuário ${id} deletado do localStorage`)
      return true
    }
    return false
  } catch (error) {
    console.log('📱 Erro ao deletar do localStorage:', error)
    return false
  }
}

// Deletar todos os usuários (DESABILITADO TEMPORARIAMENTE)
export const deletarTodosUsuarios = async () => {
  console.log('🚧 DELEÇÃO EM MASSA DESABILITADA - Aguardando configuração do Supabase')
  console.log('📱 Deletando todos os usuários do localStorage como fallback')
  
  // Deletar do localStorage em vez de fazer chamada à API
  try {
    localStorage.removeItem('usuarios')
    console.log('📱 Todos os usuários deletados do localStorage')
    return true
  } catch (error) {
    console.log('📱 Erro ao deletar do localStorage:', error)
    return false
  }
}

// Verificar se CPF já existe (DESABILITADO TEMPORARIAMENTE)
export const verificarCPFExistente = async (cpf) => {
  console.log(`🚧 VERIFICAÇÃO DESABILITADA - Aguardando configuração do Supabase`)
  console.log(`📱 Verificando CPF ${cpf} no localStorage como fallback`)
  
  // Verificar no localStorage em vez de fazer chamada à API
  try {
    const savedUsuarios = localStorage.getItem('usuarios')
    if (savedUsuarios) {
      const usuarios = JSON.parse(savedUsuarios)
      const usuarioExistente = usuarios.find(u => u.cpf === cpf)
      console.log(`📱 CPF ${cpf} ${usuarioExistente ? 'encontrado' : 'não encontrado'} no localStorage`)
      return usuarioExistente || null
    }
    return null
  } catch (error) {
    console.log('📱 Erro ao verificar no localStorage, retornando null')
    return null
  }
}

// Buscar usuário por ID (DESABILITADO TEMPORARIAMENTE)
export const buscarUsuarioPorId = async (id) => {
  console.log(`🚧 BUSCA POR ID DESABILITADA - Aguardando configuração do Supabase`)
  console.log(`📱 Buscando usuário ${id} no localStorage como fallback`)
  
  // Buscar no localStorage em vez de fazer chamada à API
  try {
    const savedUsuarios = localStorage.getItem('usuarios')
    if (savedUsuarios) {
      const usuarios = JSON.parse(savedUsuarios)
      const usuario = usuarios.find(u => u.id === id)
      if (usuario) {
        console.log(`📱 Usuário ${id} encontrado no localStorage:`, usuario.nome)
        return usuario
      }
    }
    console.log(`📱 Usuário ${id} não encontrado no localStorage`)
    return null
  } catch (error) {
    console.log('📱 Erro ao buscar no localStorage, retornando null')
    return null
  }
}

// Atualizar usuário
export const atualizarUsuario = async (id, dadosAtualizados) => {
  try {
    console.log(`📝 Atualizando usuário ${id} no Supabase...`)
    
    const dadosParaAtualizar = {
      ...dadosAtualizados,
      updated_at: new Date().toISOString()
    }
    
    const { data, error } = await supabase
      .from(USUARIOS_TABLE)
      .update(dadosParaAtualizar)
      .eq('id', id)
      .select()
    
    if (error) {
      console.error('❌ Erro ao atualizar usuário no Supabase:', error)
      throw error
    }
    
    console.log('✅ Usuário atualizado com sucesso no Supabase!')
    return data[0]
  } catch (error) {
    console.error('❌ Erro ao atualizar usuário:', error)
    throw error
  }
}

// Função para migrar dados do Firebase para Supabase
export const migrarDadosFirebase = async (dadosFirebase) => {
  try {
    console.log('🚀 Iniciando migração de dados do Firebase para Supabase...')
    console.log(`📊 Total de registros para migrar: ${dadosFirebase.length}`)
    
    let sucessos = 0
    let erros = 0
    
    for (const usuario of dadosFirebase) {
      try {
        await adicionarUsuario(usuario)
        sucessos++
        console.log(`✅ Migrado: ${usuario.nome}`)
      } catch (error) {
        erros++
        console.error(`❌ Erro ao migrar ${usuario.nome}:`, error.message)
      }
    }
    
    console.log(`🎉 Migração concluída! Sucessos: ${sucessos}, Erros: ${erros}`)
    
    return {
      sucesso: true,
      total: dadosFirebase.length,
      sucessos,
      erros
    }
  } catch (error) {
    console.error('❌ Erro durante migração:', error)
    return {
      sucesso: false,
      erro: error.message
    }
  }
}

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

// Atualizar usuário (DESABILITADO TEMPORARIAMENTE)
export const atualizarUsuario = async (id, dadosAtualizados) => {
  console.log(`🚧 ATUALIZAÇÃO DESABILITADA - Aguardando configuração do Supabase`)
  console.log(`📱 Atualizando usuário ${id} no localStorage como fallback`)
  
  // Atualizar no localStorage em vez de fazer chamada à API
  try {
    const savedUsuarios = localStorage.getItem('usuarios')
    if (savedUsuarios) {
      const usuarios = JSON.parse(savedUsuarios)
      const index = usuarios.findIndex(u => u.id === id)
      if (index !== -1) {
        usuarios[index] = { ...usuarios[index], ...dadosAtualizados, updatedAt: new Date().toISOString() }
        localStorage.setItem('usuarios', JSON.stringify(usuarios))
        console.log(`📱 Usuário ${id} atualizado no localStorage`)
        return usuarios[index]
      }
    }
    throw new Error('Usuário não encontrado')
  } catch (error) {
    console.log('📱 Erro ao atualizar no localStorage:', error)
    throw error
  }
}

// Função para migrar dados do Firebase para Supabase (DESABILITADA TEMPORARIAMENTE)
export const migrarDadosFirebase = async (dadosFirebase) => {
  console.log('🚧 MIGRAÇÃO DESABILITADA - Aguardando configuração do Supabase')
  console.log('📱 Migração será realizada após configuração completa')
  
  return {
    sucesso: false,
    erro: 'Migração desabilitada temporariamente',
    total: dadosFirebase.length,
    sucessos: 0,
    erros: dadosFirebase.length
  }
}

// =====================================================
// FUNÇÃO DE TESTE DE CONEXÃO COM SUPABASE
// =====================================================

export const testarConexaoSupabase = async () => {
  console.log('🧪 TESTANDO CONEXÃO COM SUPABASE...')
  
  try {
    // Teste 1: Verificar se o cliente está configurado
    if (!supabase) {
      throw new Error('Cliente Supabase não está configurado')
    }
    
    console.log('✅ Cliente Supabase configurado')
    
    // Teste 2: Verificar se as credenciais estão definidas
    const url = supabase.supabaseUrl
    const key = supabase.supabaseKey
    
    if (!url || !key) {
      throw new Error('Credenciais do Supabase não estão definidas')
    }
    
    console.log('✅ Credenciais do Supabase configuradas')
    console.log('🔗 URL:', url)
    console.log('🔑 Key:', key ? `${key.substring(0, 20)}...` : 'Não definida')
    
    // Teste 3: Tentar conectar e verificar se a tabela existe
    console.log('🔄 Tentando conectar ao Supabase...')
    
    const { data, error } = await supabase
      .from('usuarios')
      .select('count')
      .limit(1)
    
    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error('Tabela "usuarios" não encontrada. Execute o schema SQL primeiro!')
      } else {
        throw new Error(`Erro de conexão: ${error.message}`)
      }
    }
    
    console.log('✅ Conexão com Supabase estabelecida com sucesso!')
    console.log('✅ Tabela "usuarios" encontrada e acessível')
    
    return {
      sucesso: true,
      mensagem: 'Conexão estabelecida com sucesso!',
      detalhes: {
        url: url,
        tabela_existe: true,
        timestamp: new Date().toISOString()
      }
    }
    
  } catch (error) {
    console.error('❌ ERRO NO TESTE DE CONEXÃO:', error.message)
    
    return {
      sucesso: false,
      erro: error.message,
      detalhes: {
        timestamp: new Date().toISOString(),
        sugestao: error.message.includes('não encontrada') 
          ? 'Execute o schema SQL no Supabase Dashboard' 
          : 'Verifique as credenciais e conexão'
      }
    }
  }
}

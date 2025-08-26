import { supabase } from './config'

// Referência para a tabela de usuários
const USUARIOS_TABLE = 'usuarios'

// Adicionar novo usuário
export const adicionarUsuario = async (usuario) => {
  console.log('➕ Adicionando usuário no Supabase...')
  
  try {
    // Preparar dados para salvar (adaptar para estrutura do Supabase)
    const dadosParaSalvar = {
      nome: usuario.nome || '',
      cpf: usuario.cpf || '',
      email: usuario.email || '',
      respostas: usuario.respostas || {},
      score: usuario.score || 0,
      status: usuario.status || '',
      categoria: usuario.categoria || usuario.status || '',
      analise_clinica: usuario.analiseClinica || {},
      data_realizacao: usuario.dataRealizacao || new Date().toISOString(),
      tipo: usuario.tipo || 'questionario_tradicional',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    // Se for questionário integrado, adicionar campos específicos
    if (usuario.tipo === 'questionario_integrado') {
      dadosParaSalvar.tipo_questionario = 'proposito'
      dadosParaSalvar.origem = 'questionario_integrado'
      dadosParaSalvar.status = 'finalizado'
      dadosParaSalvar.finalizado_em = new Date().toISOString()
    }
    
    const { data, error } = await supabase
      .from(USUARIOS_TABLE)
      .insert([dadosParaSalvar])
      .select()
    
    if (error) {
      console.error('❌ Erro ao adicionar usuário no Supabase:', error)
      throw error
    }
    
    console.log('✅ Usuário adicionado com sucesso no Supabase! ID:', data[0].id)
    return { id: data[0].id, ...usuario }
  } catch (error) {
    console.error('❌ Erro ao adicionar usuário:', error)
    throw error
  }
}

// Buscar todos os usuários
export const buscarUsuarios = async () => {
  try {
    console.log('🔄 Buscando usuários no Supabase...')
    
    const { data, error } = await supabase
      .from(USUARIOS_TABLE)
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('❌ Erro ao buscar usuários no Supabase:', error)
      throw error
    }
    
    console.log(`✅ ${data.length} usuários encontrados no Supabase`)
    
    // Adaptar dados para compatibilidade com o código existente
    const usuariosAdaptados = data.map(usuario => ({
      id: usuario.id,
      nome: usuario.nome,
      cpf: usuario.cpf,
      email: usuario.email,
      respostas: usuario.respostas,
      score: usuario.score,
      status: usuario.status,
      categoria: usuario.categoria,
      analiseClinica: usuario.analise_clinica,
      dataRealizacao: usuario.data_realizacao,
      tipo: usuario.tipo,
      createdAt: usuario.created_at,
      updatedAt: usuario.updated_at
    }))
    
    return usuariosAdaptados
  } catch (error) {
    console.error('❌ Erro ao buscar usuários:', error)
    throw error
  }
}

// Deletar usuário específico
export const deletarUsuario = async (id) => {
  try {
    console.log(`🗑️ Deletando usuário ${id} no Supabase...`)
    
    const { error } = await supabase
      .from(USUARIOS_TABLE)
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('❌ Erro ao deletar usuário no Supabase:', error)
      throw error
    }
    
    console.log('✅ Usuário deletado com sucesso no Supabase!')
    return true
  } catch (error) {
    console.error('❌ Erro ao deletar usuário:', error)
    throw error
  }
}

// Deletar todos os usuários
export const deletarTodosUsuarios = async () => {
  try {
    console.log('🗑️ Deletando TODOS os usuários no Supabase...')
    
    const { error } = await supabase
      .from(USUARIOS_TABLE)
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Deletar todos
    
    if (error) {
      console.error('❌ Erro ao deletar todos os usuários no Supabase:', error)
      throw error
    }
    
    console.log('✅ Todos os usuários foram deletados com sucesso no Supabase!')
    return true
  } catch (error) {
    console.error('❌ Erro ao deletar todos os usuários:', error)
    throw error
  }
}

// Verificar se CPF já existe
export const verificarCPFExistente = async (cpf) => {
  try {
    console.log(`🔍 Verificando se CPF ${cpf} já existe no Supabase...`)
    
    const { data, error } = await supabase
      .from(USUARIOS_TABLE)
      .select('id, nome, cpf')
      .eq('cpf', cpf)
      .limit(1)
    
    if (error) {
      console.error('❌ Erro ao verificar CPF no Supabase:', error)
      throw error
    }
    
    const existe = data && data.length > 0
    console.log(`🔍 CPF ${cpf} ${existe ? 'JÁ EXISTE' : 'NÃO EXISTE'} no Supabase`)
    
    return existe
  } catch (error) {
    console.error('❌ Erro ao verificar CPF:', error)
    throw error
  }
}

// Buscar usuário por ID
export const buscarUsuarioPorId = async (id) => {
  try {
    console.log(`🔍 Buscando usuário ${id} no Supabase...`)
    
    const { data, error } = await supabase
      .from(USUARIOS_TABLE)
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('❌ Erro ao buscar usuário por ID no Supabase:', error)
      throw error
    }
    
    // Adaptar dados para compatibilidade
    const usuarioAdaptado = {
      id: data.id,
      nome: data.nome,
      cpf: data.cpf,
      email: data.email,
      respostas: data.respostas,
      score: data.score,
      status: data.status,
      categoria: data.categoria,
      analiseClinica: data.analise_clinica,
      dataRealizacao: data.data_realizacao,
      tipo: data.tipo,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    }
    
    console.log('✅ Usuário encontrado no Supabase:', usuarioAdaptado.nome)
    return usuarioAdaptado
  } catch (error) {
    console.error('❌ Erro ao buscar usuário por ID:', error)
    throw error
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

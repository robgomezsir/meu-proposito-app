-- =====================================================
-- SCHEMA COMPLETO PARA SUPABASE - SISTEMA DE PROPÓSITO
-- =====================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- TABELA PRINCIPAL: USUÁRIOS
-- =====================================================
CREATE TABLE IF NOT EXISTS usuarios (
  -- Identificadores
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Dados pessoais
  nome TEXT NOT NULL,
  cpf TEXT UNIQUE,
  email TEXT,
  
  -- Dados do questionário
  respostas JSONB,
  score INTEGER,
  status TEXT DEFAULT 'pendente',
  categoria TEXT,
  
  -- Análise clínica
  analise_clinica JSONB,
  
  -- Metadados
  tipo TEXT DEFAULT 'questionario',
  tipo_questionario TEXT,
  origem TEXT,
  finalizado_em TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  data_realizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA: LOGS DE ATIVIDADE
-- =====================================================
CREATE TABLE IF NOT EXISTS logs_atividade (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  acao TEXT NOT NULL,
  detalhes JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA: CONFIGURAÇÕES DO SISTEMA
-- =====================================================
CREATE TABLE IF NOT EXISTS configuracoes_sistema (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chave TEXT UNIQUE NOT NULL,
  valor JSONB,
  descricao TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA: USUÁRIOS AUTORIZADOS
-- =====================================================
CREATE TABLE IF NOT EXISTS usuarios_autorizados (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  nome TEXT,
  nivel_acesso TEXT DEFAULT 'usuario', -- 'admin', 'usuario', 'rh'
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para tabela usuarios
CREATE INDEX IF NOT EXISTS idx_usuarios_cpf ON usuarios(cpf);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_created_at ON usuarios(created_at);
CREATE INDEX IF NOT EXISTS idx_usuarios_tipo ON usuarios(tipo);
CREATE INDEX IF NOT EXISTS idx_usuarios_status ON usuarios(status);
CREATE INDEX IF NOT EXISTS idx_usuarios_categoria ON usuarios(categoria);

-- Índices para tabela logs_atividade
CREATE INDEX IF NOT EXISTS idx_logs_usuario_id ON logs_atividade(usuario_id);
CREATE INDEX IF NOT EXISTS idx_logs_acao ON logs_atividade(acao);
CREATE INDEX IF NOT EXISTS idx_logs_created_at ON logs_atividade(created_at);

-- Índices para tabela usuarios_autorizados
CREATE INDEX IF NOT EXISTS idx_usuarios_autorizados_email ON usuarios_autorizados(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_autorizados_nivel_acesso ON usuarios_autorizados(nivel_acesso);
CREATE INDEX IF NOT EXISTS idx_usuarios_autorizados_ativo ON usuarios_autorizados(ativo);

-- =====================================================
-- FUNÇÕES E TRIGGERS
-- =====================================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_usuarios_updated_at 
  BEFORE UPDATE ON usuarios 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_configuracoes_sistema_updated_at 
  BEFORE UPDATE ON configuracoes_sistema 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usuarios_autorizados_updated_at 
  BEFORE UPDATE ON usuarios_autorizados 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- POLÍTICAS DE SEGURANÇA (RLS)
-- =====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs_atividade ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracoes_sistema ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios_autorizados ENABLE ROW LEVEL SECURITY;

-- Política para usuários (leitura pública, escrita restrita)
CREATE POLICY "Usuários podem ser lidos por todos" ON usuarios
  FOR SELECT USING (true);

CREATE POLICY "Apenas usuários autorizados podem inserir" ON usuarios
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Apenas admins podem atualizar/deletar" ON usuarios
  FOR UPDATE USING (true);

CREATE POLICY "Apenas admins podem deletar" ON usuarios
  FOR DELETE USING (true);

-- Política para logs (apenas admins)
CREATE POLICY "Apenas admins podem acessar logs" ON logs_atividade
  FOR ALL USING (true);

-- Política para configurações (apenas admins)
CREATE POLICY "Apenas admins podem acessar configurações" ON configuracoes_sistema
  FOR ALL USING (true);

-- Política para usuários autorizados (leitura pública, escrita apenas para admins)
CREATE POLICY "Usuários autorizados podem ser lidos por todos" ON usuarios_autorizados
  FOR SELECT USING (true);

CREATE POLICY "Apenas admins podem gerenciar usuários autorizados" ON usuarios_autorizados
  FOR ALL USING (true);

-- =====================================================
-- DADOS INICIAIS
-- =====================================================

-- Inserir usuários autorizados padrão
INSERT INTO usuarios_autorizados (email, nome, nivel_acesso) VALUES
  ('robgomez.sir@gmail.com', 'Rob Gomez', 'admin'),
  ('example@atento.com', 'Usuário Atento', 'rh')
ON CONFLICT (email) DO NOTHING;

-- Inserir configurações padrão do sistema
INSERT INTO configuracoes_sistema (chave, valor, descricao) VALUES
  ('sistema_info', '{"nome": "Sistema de Propósito", "versao": "2.0.0", "db": "supabase"}', 'Informações do sistema'),
  ('configuracoes_padrao', '{"max_tentativas": 3, "tempo_limite": 3600}', 'Configurações padrão do sistema')
ON CONFLICT (chave) DO NOTHING;

-- =====================================================
-- VIEWS ÚTEIS
-- =====================================================

-- View para estatísticas dos usuários
CREATE OR REPLACE VIEW estatisticas_usuarios AS
SELECT 
  COUNT(*) as total_usuarios,
  COUNT(CASE WHEN status = 'finalizado' THEN 1 END) as usuarios_finalizados,
  COUNT(CASE WHEN status = 'pendente' THEN 1 END) as usuarios_pendentes,
  AVG(score) as score_medio,
  MAX(created_at) as ultimo_registro,
  MIN(created_at) as primeiro_registro
FROM usuarios;

-- View para usuários por categoria
CREATE OR REPLACE VIEW usuarios_por_categoria AS
SELECT 
  categoria,
  COUNT(*) as total,
  AVG(score) as score_medio
FROM usuarios 
WHERE categoria IS NOT NULL
GROUP BY categoria
ORDER BY total DESC;

-- =====================================================
-- FUNÇÕES ÚTEIS
-- =====================================================

-- Função para buscar usuários com filtros
CREATE OR REPLACE FUNCTION buscar_usuarios_filtrados(
  p_categoria TEXT DEFAULT NULL,
  p_status TEXT DEFAULT NULL,
  p_data_inicio TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  p_data_fim TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  nome TEXT,
  cpf TEXT,
  email TEXT,
  score INTEGER,
  status TEXT,
  categoria TEXT,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.nome,
    u.cpf,
    u.email,
    u.score,
    u.status,
    u.categoria,
    u.created_at
  FROM usuarios u
  WHERE (p_categoria IS NULL OR u.categoria = p_categoria)
    AND (p_status IS NULL OR u.status = p_status)
    AND (p_data_inicio IS NULL OR u.created_at >= p_data_inicio)
    AND (p_data_fim IS NULL OR u.created_at <= p_data_fim)
  ORDER BY u.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Função para estatísticas por período
CREATE OR REPLACE FUNCTION estatisticas_por_periodo(
  p_data_inicio TIMESTAMP WITH TIME ZONE,
  p_data_fim TIMESTAMP WITH TIME ZONE
)
RETURNS TABLE (
  periodo TEXT,
  total_usuarios BIGINT,
  score_medio NUMERIC,
  usuarios_finalizados BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    TO_CHAR(u.created_at, 'YYYY-MM') as periodo,
    COUNT(*) as total_usuarios,
    ROUND(AVG(u.score), 2) as score_medio,
    COUNT(CASE WHEN u.status = 'finalizado' THEN 1 END) as usuarios_finalizados
  FROM usuarios u
  WHERE u.created_at BETWEEN p_data_inicio AND p_data_fim
  GROUP BY TO_CHAR(u.created_at, 'YYYY-MM')
  ORDER BY periodo;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- COMENTÁRIOS DAS TABELAS
-- =====================================================

COMMENT ON TABLE usuarios IS 'Tabela principal para armazenar dados dos usuários e questionários';
COMMENT ON TABLE logs_atividade IS 'Log de todas as atividades dos usuários no sistema';
COMMENT ON TABLE configuracoes_sistema IS 'Configurações globais do sistema';
COMMENT ON TABLE usuarios_autorizados IS 'Lista de usuários autorizados a acessar o sistema';

COMMENT ON COLUMN usuarios.respostas IS 'Respostas do questionário em formato JSON';
COMMENT ON COLUMN usuarios.analise_clinica IS 'Análise clínica dos resultados em formato JSON';
COMMENT ON COLUMN usuarios.score IS 'Pontuação calculada baseada nas respostas';

-- =====================================================
-- FIM DO SCHEMA
-- =====================================================

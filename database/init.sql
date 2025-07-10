-- Criação da tabela de posts
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_posts_updated_at 
    BEFORE UPDATE ON posts 
    FOR EACH ROW 
    EXECUTE PROCEDURE update_updated_at_column();

-- Dados de exemplo
INSERT INTO posts (title, content, author) VALUES 
    ('Bem-vindo ao Blog System', 'Este é um sistema de blog criado para demonstrar conceitos de arquitetura de software usando Docker.', 'Admin'),
    ('Separação de Responsabilidades', 'Cada container tem uma responsabilidade específica: frontend, backend, database e cache.', 'Arquiteto'),
    ('Baixo Acoplamento', 'Os serviços se comunicam através de APIs bem definidas, permitindo mudanças independentes.', 'Desenvolvedor');

-- Estatísticas (view)
CREATE OR REPLACE VIEW post_stats AS
SELECT 
    COUNT(*) as total_posts,
    COUNT(DISTINCT author) as total_authors,
    MAX(created_at) as last_post_date
FROM posts;
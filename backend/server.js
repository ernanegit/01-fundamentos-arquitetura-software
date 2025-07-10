require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Importar configurações
const db = require('./config/database');
const redis = require('./config/redis');

// Importar rotas
const postsRoutes = require('./routes/posts');

const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['http://localhost:3000'] 
    : true,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rotas
app.use('/api/posts', postsRoutes);

// Health check
app.get('/health', async (req, res) => {
  try {
    // Testar conexão com database
    await db.query('SELECT 1');
    
    // Testar conexão com Redis
    await redis.ping();

    res.json({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      service: 'blog-backend',
      database: 'connected',
      cache: 'connected'
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      service: 'blog-backend',
      error: error.message
    });
  }
});

// Estatísticas
app.get('/api/stats', async (req, res) => {
  try {
    const cacheKey = 'stats';
    const cached = await redis.get(cacheKey);
    
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const postsCount = await db.query('SELECT COUNT(*) FROM posts');
    const authorsCount = await db.query('SELECT COUNT(DISTINCT author) FROM posts');

    const stats = {
      totalPosts: parseInt(postsCount.rows[0].count),
      totalAuthors: parseInt(authorsCount.rows[0].count),
      lastUpdated: new Date().toISOString()
    };

    // Cache por 2 minutos
    await redis.setex(cacheKey, 120, JSON.stringify(stats));

    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});

// Middleware de tratamento de erros 404
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint não encontrado',
    path: req.originalUrl,
    method: req.method
  });
});

// Inicialização do banco (para demonstração)
async function initDatabase() {
  try {
    // Verificar se a tabela existe, se não, criar
    await db.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        author VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Criar índices para performance
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author);
      CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
    `);

    // Verificar se há dados, se não, inserir exemplos
    const countResult = await db.query('SELECT COUNT(*) FROM posts');
    const postCount = parseInt(countResult.rows[0].count);

    if (postCount === 0) {
      await db.query(`
        INSERT INTO posts (title, content, author) VALUES 
        ('Bem-vindo ao Blog System', 'Este é um sistema de blog criado para demonstrar conceitos de arquitetura de software usando Docker. Cada container tem uma responsabilidade específica.', 'Admin'),
        ('Separação de Responsabilidades', 'Cada container tem uma responsabilidade específica: frontend para interface, backend para APIs, database para persistência e Redis para cache.', 'Arquiteto'),
        ('Baixo Acoplamento', 'Os serviços se comunicam através de APIs bem definidas, permitindo mudanças independentes sem afetar outros componentes.', 'Desenvolvedor')
      `);
      console.log('✅ Dados de exemplo inseridos');
    }

    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
  }
}

// Conectar ao Redis
async function connectRedis() {
  try {
    await redis.connect();
    console.log('✅ Redis connected successfully');
  } catch (error) {
    console.error('❌ Redis connection error:', error);
  }
}

// Iniciar servidor
async function startServer() {
  try {
    await connectRedis();
    await initDatabase();
    
    app.listen(port, '0.0.0.0', () => {
      console.log(`🚀 Backend server running on port ${port}`);
      console.log(`📋 Health check: http://localhost:${port}/health`);
      console.log(`📊 API docs: http://localhost:${port}/api/posts`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('📩 Received SIGTERM, shutting down gracefully');
  
  try {
    await db.end();
    await redis.quit();
    console.log('✅ Connections closed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

process.on('SIGINT', async () => {
  console.log('📩 Received SIGINT, shutting down gracefully');
  
  try {
    await db.end();
    await redis.quit();
    console.log('✅ Connections closed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

// Iniciar aplicação
startServer();
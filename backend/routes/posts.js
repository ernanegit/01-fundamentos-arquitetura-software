const express = require('express');
const db = require('../config/database');
const redis = require('../config/redis');
const router = express.Router();

// Listar todos os posts
router.get('/', async (req, res) => {
  try {
    // Verificar cache primeiro
    const cached = await redis.get('posts');
    if (cached) {
      console.log('Returning cached posts');
      return res.json(JSON.parse(cached));
    }

    // Buscar no banco de dados
    const result = await db.query(`
      SELECT id, title, content, author, created_at 
      FROM posts 
      ORDER BY created_at DESC
    `);

    const posts = result.rows;

    // Cache por 5 minutos (nova sintaxe Redis v4+)
    await redis.setEx('posts', 300, JSON.stringify(posts));

    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Erro ao buscar posts' });
  }
});

// Buscar post por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(
      'SELECT * FROM posts WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Erro ao buscar post' });
  }
});

// Criar novo post
router.post('/', async (req, res) => {
  try {
    const { title, content, author } = req.body;
    
    // Validação
    if (!title || !content || !author) {
      return res.status(400).json({ 
        error: 'Título, conteúdo e autor são obrigatórios' 
      });
    }

    if (title.length > 255) {
      return res.status(400).json({ 
        error: 'Título deve ter no máximo 255 caracteres' 
      });
    }

    const result = await db.query(
      `INSERT INTO posts (title, content, author) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [title, content, author]
    );

    // Invalidar cache (nova sintaxe)
    await redis.del('posts');
    await redis.del('stats');

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Erro ao criar post' });
  }
});

// Atualizar post
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ 
        error: 'Título e conteúdo são obrigatórios' 
      });
    }

    const result = await db.query(
      `UPDATE posts 
       SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $3 
       RETURNING *`,
      [title, content, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }

    // Invalidar cache
    await redis.del('posts');
    await redis.del('stats');

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Erro ao atualizar post' });
  }
});

// Deletar post
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'DELETE FROM posts WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }

    // Invalidar cache
    await redis.del('posts');
    await redis.del('stats');

    res.json({ message: 'Post deletado com sucesso' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Erro ao deletar post' });
  }
});

module.exports = router;
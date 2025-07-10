import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Componente Header
const Header = ({ stats }) => (
  <header className="header">
    <h1>Blog System</h1>
    <p>Demonstração de Arquitetura de Software</p>
    {stats && (
      <div className="stats">
        <span>Posts: {stats.totalPosts}</span>
        <span>Autores: {stats.totalAuthors}</span>
      </div>
    )}
  </header>
);

// Componente PostForm
const PostForm = ({ onPostCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/posts', formData);
      onPostCreated(response.data);
      setFormData({ title: '', content: '', author: '' });
      alert('Post criado com sucesso!');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Erro ao criar post');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <h2>Criar Novo Post</h2>
      <div className="form-group">
        <input
          type="text"
          name="title"
          placeholder="Título do post"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          name="author"
          placeholder="Autor"
          value={formData.author}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <textarea
          name="content"
          placeholder="Conteúdo do post"
          value={formData.content}
          onChange={handleChange}
          rows="6"
          required
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Salvando...' : 'Criar Post'}
      </button>
    </form>
  );
};

// Componente PostList
const PostList = ({ posts, onPostDeleted }) => {
  const handleDelete = async (postId) => {
    if (window.confirm('Tem certeza que deseja deletar este post?')) {
      try {
        await axios.delete(`/api/posts/${postId}`);
        onPostDeleted(postId);
        alert('Post deletado com sucesso!');
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Erro ao deletar post');
      }
    }
  };

  return (
    <div className="post-list">
      <h2>Posts ({posts.length})</h2>
      {posts.length === 0 ? (
        <p>Nenhum post encontrado.</p>
      ) : (
        posts.map(post => (
          <div key={post.id} className="post-item">
            <h3>{post.title}</h3>
            <p className="post-meta">
              Por {post.author} em {new Date(post.created_at).toLocaleDateString('pt-BR')}
            </p>
            <p className="post-content">{post.content}</p>
            <button 
              onClick={() => handleDelete(post.id)}
              className="delete-btn"
            >
              Deletar
            </button>
          </div>
        ))
      )}
    </div>
  );
};

// Componente Principal
function App() {
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Buscar posts
  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  // Buscar estatísticas
  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Carregar dados iniciais
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchPosts(), fetchStats()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // Handlers
  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
    fetchStats(); // Atualizar estatísticas
  };

  const handlePostDeleted = (postId) => {
    setPosts(posts.filter(post => post.id !== postId));
    fetchStats(); // Atualizar estatísticas
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="App">
      <Header stats={stats} />
      <main className="main-content">
        <div className="container">
          <PostForm onPostCreated={handlePostCreated} />
          <PostList posts={posts} onPostDeleted={handlePostDeleted} />
        </div>
      </main>
    </div>
  );
}

export default App;
# Blog System - Conceitos Básicos de Arquitetura de Software

Sistema de blog desenvolvido para demonstrar os **fundamentos da arquitetura de software** usando Docker e containers.

## 🎯 Objetivos do Projeto

Este projeto foi criado para estudar e demonstrar na prática os principais conceitos de arquitetura de software:

- ✅ **Separação de Responsabilidades (SoC)**
- ✅ **Baixo Acoplamento e Alta Coesão**
- ✅ **Escalabilidade Horizontal e Vertical**
- ✅ **Manutenibilidade e Observabilidade**

## 🏗️ Arquitetura do Sistema

```
┌─────────────────┐    HTTP/REST    ┌─────────────────┐    SQL    ┌─────────────────┐
│                 │ ─────────────── │                 │ ───────── │                 │
│   Frontend      │                 │   Backend       │           │   Database      │
│   (React +      │                 │   (Node.js +    │           │   (PostgreSQL)  │
│    Nginx)       │                 │    Express)     │           │                 │
│                 │                 │                 │           │                 │
└─────────────────┘                 └─────────────────┘           └─────────────────┘
      :3000                               :8000           ┌─────────    :5432
                                            │             │
                                            │ Redis       │
                                            │ Protocol    │
                                            ▼             │
                                     ┌─────────────────┐   │
                                     │                 │   │
                                     │   Cache         │   │
                                     │   (Redis)       │   │
                                     │                 │   │
                                     └─────────────────┘   │
                                           :6379           │
                                                          │
                                     ┌─────────────────────┘
                                     │
                                     ▼
                              Docker Network
                            (blog-network)
```

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** - Interface do usuário
- **Nginx Alpine** - Servidor web de produção
- **CSS3** - Estilização responsiva

### Backend
- **Node.js 16** - Runtime JavaScript
- **Express.js** - Framework web
- **PostgreSQL Driver** - Conexão com banco
- **Redis Client** - Cache e sessões

### Database & Cache
- **PostgreSQL 13** - Banco de dados relacional
- **Redis 6** - Cache em memória

### DevOps
- **Docker & Docker Compose** - Containerização
- **Multi-stage builds** - Otimização de imagens

## 📁 Estrutura do Projeto

```
blog-system/
├── docker-compose.yml          # Orquestração dos containers
├── .env                        # Variáveis de ambiente
├── README.md                   # Este arquivo
│
├── frontend/                   # 🎨 Interface do usuário
│   ├── Dockerfile             # Build React + Nginx
│   ├── nginx.conf             # Configuração do servidor
│   ├── package.json           # Dependências React
│   ├── public/
│   │   ├── index.html         # HTML principal
│   │   └── manifest.json      # PWA manifest
│   └── src/
│       ├── App.js             # Componente principal
│       ├── App.css            # Estilos da aplicação
│       ├── index.js           # Entry point React
│       └── index.css          # Estilos globais
│
├── backend/                    # ⚙️ APIs e lógica de negócio
│   ├── Dockerfile             # Build Node.js
│   ├── package.json           # Dependências Node
│   ├── server.js              # Servidor principal
│   ├── config/
│   │   ├── database.js        # Configuração PostgreSQL
│   │   └── redis.js           # Configuração Redis
│   └── routes/
│       └── posts.js           # Rotas dos posts
│
├── database/                   # 🗄️ Scripts de banco
│   └── init.sql               # Schema e dados iniciais
│
└── scripts/                    # 🚀 Automação
    ├── start.bat              # Iniciar sistema (Windows)
    ├── stop.bat               # Parar sistema (Windows)
    └── reset.bat              # Reset completo (Windows)
```

## 🚀 Como Executar

### Pré-requisitos
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado
- [Git](https://git-scm.com/) para clonar o repositório

### Passo a Passo

1. **Clone o repositório:**
```bash
git clone https://github.com/ernanegit/eng_soft_conceitos_basicos.git
cd eng_soft_conceitos_basicos
```

2. **Inicie o sistema:**
```bash
# Windows
scripts\start.bat

# Linux/Mac
chmod +x scripts/start.sh
./scripts/start.sh

# Manual
docker-compose up --build
```

3. **Acesse as aplicações:**
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **Health Check:** http://localhost:8000/health
- **Listar Posts:** http://localhost:8000/api/posts

## 🧪 Testando o Sistema

### Via Interface Web
1. Abra http://localhost:3000
2. Preencha o formulário "Criar Novo Post"
3. Observe a lista sendo atualizada automaticamente
4. Teste deletar posts existentes

### Via API (curl)
```bash
# Health check
curl http://localhost:8000/health

# Listar posts
curl http://localhost:8000/api/posts

# Criar post
curl -X POST http://localhost:8000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Meu Primeiro Post",
    "content": "Este é o conteúdo do meu post",
    "author": "João Silva"
  }'

# Estatísticas
curl http://localhost:8000/api/stats
```

## 🏛️ Conceitos Arquiteturais Demonstrados

### 1. 🎯 Separação de Responsabilidades (SoC)

**Cada container tem uma responsabilidade única:**

- **Frontend (React + Nginx)**: Apenas interface do usuário
- **Backend (Node.js)**: Apenas APIs e lógica de negócio  
- **Database (PostgreSQL)**: Apenas persistência de dados
- **Cache (Redis)**: Apenas cache e performance

**Benefícios:**
- Facilita manutenção e debugging
- Permite desenvolvimento independente
- Reduz complexidade de cada componente

### 2. 🔗 Baixo Acoplamento

**Como é implementado:**
- Comunicação via HTTP/REST APIs bem definidas
- Configuração via variáveis de ambiente
- Cada serviço pode ser substituído independentemente

**Exemplo prático:**
```bash
# Você pode trocar o PostgreSQL por MySQL sem afetar o frontend
# Ou trocar o React por Vue.js sem afetar o backend
```

### 3. 🧩 Alta Coesão

**Estrutura organizada:**
- Rotas relacionadas ficam no mesmo arquivo
- Configurações agrupadas por serviço
- Funcionalidades similares próximas

**Exemplo:**
- Todas as operações de posts em `/backend/routes/posts.js`
- Todas as configurações de DB em `/backend/config/database.js`

### 4. 📈 Escalabilidade

**Escalabilidade Horizontal:**
```bash
# Escalar apenas o backend
docker-compose up --scale backend=3

# Escalar frontend e backend
docker-compose up --scale frontend=2 --scale backend=3
```

**Escalabilidade Vertical:**
- Aumentar recursos (CPU/RAM) de containers específicos
- Cache Redis para reduzir carga no banco

### 5. 🔧 Manutenibilidade

**Práticas implementadas:**
- Logs estruturados para debugging
- Health checks para monitoramento
- Graceful shutdown para deploys seguros
- Código bem documentado e organizado

## 📊 Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/health` | Status do sistema |
| `GET` | `/api/posts` | Listar todos os posts |
| `POST` | `/api/posts` | Criar novo post |
| `DELETE` | `/api/posts/:id` | Deletar post por ID |
| `GET` | `/api/stats` | Estatísticas do sistema |

## 🐳 Comandos Docker Úteis

```bash
# Ver status dos containers
docker-compose ps

# Ver logs de todos os serviços
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f backend

# Parar todos os serviços
docker-compose down

# Rebuild sem cache
docker-compose build --no-cache

# Reset completo (remove volumes)
docker-compose down -v

# Entrar em um container
docker-compose exec backend sh
docker-compose exec database psql -U user -d blogdb
```

## 🔍 Troubleshooting

### Problemas Comuns

**"Port already in use":**
```bash
docker-compose down
# Verificar processos usando as portas
netstat -ano | findstr :3000
netstat -ano | findstr :8000
```

**"Cannot connect to database":**
```bash
# Ver logs do database
docker-compose logs database
# Recriar volumes
docker-compose down -v && docker-compose up --build
```

**Frontend não carrega:**
```bash
# Verificar logs
docker-compose logs frontend
# Rebuild do frontend
docker-compose build --no-cache frontend
```

## 🎓 Próximos Passos no Aprendizado

### Melhorias Sugeridas
1. **Autenticação JWT** - Adicionar login e proteção de rotas
2. **Testes Automatizados** - Unit tests e integration tests
3. **Monitoramento** - Prometheus + Grafana
4. **CI/CD Pipeline** - GitHub Actions para deploy
5. **Load Balancer** - Nginx como proxy reverso
6. **Microserviços** - Quebrar em serviços menores
7. **Event-Driven** - Implementar padrão pub/sub

### Exercícios Práticos
1. Adicione um campo "categoria" aos posts
2. Implemente paginação na listagem
3. Crie endpoint de busca por texto
4. Adicione validação mais robusta
5. Implemente soft delete

## 📚 Conceitos de Arquitetura Estudados

- [x] **Fundamentos da Arquitetura de Software**
- [ ] Padrões Arquiteturais (MVC, Layered, Microservices)
- [ ] Comunicação entre Serviços (REST, GraphQL, gRPC)
- [ ] Event-Driven Architecture
- [ ] CQRS e Event Sourcing
- [ ] Circuit Breaker Pattern
- [ ] API Gateway Pattern
- [ ] Database per Service
- [ ] Saga Pattern

## 👨‍💻 Autor

**Seu Nome** - Estudante de Arquitetura de Software

## 📄 Licença

Este projeto é usado para fins educacionais e de aprendizado.

---

**🎯 Objetivo alcançado:** Sistema funcional demonstrando conceitos fundamentais de arquitetura de software com Docker!
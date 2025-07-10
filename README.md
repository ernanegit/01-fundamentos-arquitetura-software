# 1. Fundamentos da Arquitetura de Software

> **📚 [← Voltar ao Índice Principal](https://github.com/ernanegit/00-arquitetura-software-index)** | **[Próximo Tutorial: Padrões Arquiteturais →](https://github.com/ernanegit/02-padroes-arquiteturais)**

Sistema de blog desenvolvido para demonstrar na prática os **fundamentos da arquitetura de software** usando Docker e containers.

## 🎯 Objetivos de Aprendizado

Ao completar este tutorial, você será capaz de:

- ✅ **Aplicar Separação de Responsabilidades** na prática
- ✅ **Implementar Baixo Acoplamento** entre componentes
- ✅ **Garantir Alta Coesão** na organização do código
- ✅ **Configurar Escalabilidade** com containers
- ✅ **Implementar Observabilidade** com logs e health checks

## 🏗️ O que vamos construir

Um **sistema de blog completo** com arquitetura de containers demonstrando:

- 📱 **Frontend React** com interface responsiva
- ⚙️ **Backend Node.js** com APIs REST
- 🗄️ **PostgreSQL** para persistência
- 💾 **Redis** para cache e performance
- 🐳 **Docker** para containerização

```
┌─────────────────┐    HTTP/REST    ┌─────────────────┐    SQL    ┌─────────────────┐
│   Frontend      │ ─────────────── │   Backend       │ ───────── │   Database      │
│   (React +      │                 │   (Node.js +    │           │   (PostgreSQL)  │
│    Nginx)       │                 │    Express)     │           │                 │
│     :3000       │                 │     :8000       │           │     :5432       │
└─────────────────┘                 └─────────────────┘           └─────────────────┘
                                            │                             
                                            │ Redis Protocol              
                                            ▼                             
                                     ┌─────────────────┐                  
                                     │   Cache         │                  
                                     │   (Redis)       │                  
                                     │     :6379       │                  
                                     └─────────────────┘                  
```

## 📋 Pré-requisitos

### Conhecimentos
- JavaScript básico
- Conceitos básicos de HTTP/REST
- Linha de comando básica

### Ferramentas
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado
- [Git](https://git-scm.com/) 
- [VS Code](https://code.visualstudio.com/) (recomendado)

## 🛠️ Stack Tecnológica

| Componente | Tecnologia | Versão | Responsabilidade |
|------------|------------|---------|------------------|
| **Frontend** | React + Nginx | 18 + Alpine | Interface do usuário |
| **Backend** | Node.js + Express | 16 | APIs e lógica de negócio |
| **Database** | PostgreSQL | 13 | Persistência de dados |
| **Cache** | Redis | 6 | Cache e performance |
| **Containers** | Docker + Compose | Latest | Orquestração |

## 🚀 Como Executar

### Instalação Rápida

```bash
# 1. Clone o repositório
git clone https://github.com/ernanegit/01-fundamentos-arquitetura-software.git
cd 01-fundamentos-arquitetura-software

# 2. Inicie o sistema
# Windows
scripts\start.bat

# Linux/Mac
chmod +x scripts/start.sh && ./scripts/start.sh

# Manual
docker-compose up --build
```

### Acessar Aplicações

- **🌐 Frontend:** http://localhost:3000
- **⚙️ Backend API:** http://localhost:8000
- **💓 Health Check:** http://localhost:8000/health
- **📊 API Posts:** http://localhost:8000/api/posts

## 📚 Conteúdo do Tutorial

### Parte 1: 🎯 Conceitos Fundamentais
- **Separação de Responsabilidades (SoC)**
- **Baixo Acoplamento e Alta Coesão**
- **Escalabilidade e Manutenibilidade**

### Parte 2: 🏗️ Implementação Prática
- **Estrutura de containers Docker**
- **Configuração de redes e volumes**
- **APIs REST com Node.js**
- **Interface React responsiva**

### Parte 3: 🧪 Testes e Validação
- **Health checks e observabilidade**
- **Testes de escalabilidade**
- **Debugging de containers**

### Parte 4: 📊 Observabilidade
- **Logs estruturados**
- **Métricas de performance**
- **Monitoramento de saúde**

## 📁 Estrutura Detalhada do Projeto

```
01-fundamentos-arquitetura-software/
├── 📄 docker-compose.yml          # Orquestração dos containers
├── 📄 .env                        # Variáveis de ambiente
├── 📄 README.md                   # Este arquivo
│
├── 📁 frontend/                   # 🎨 Interface do usuário
│   ├── 🐳 Dockerfile             # Build React + Nginx
│   ├── ⚙️ nginx.conf             # Configuração do servidor
│   ├── 📦 package.json           # Dependências React
│   ├── 📁 public/
│   │   ├── 📄 index.html         # HTML principal
│   │   └── 📄 manifest.json      # PWA manifest
│   └── 📁 src/
│       ├── ⚛️ App.js             # Componente principal
│       ├── 🎨 App.css            # Estilos da aplicação
│       ├── 🚀 index.js           # Entry point React
│       └── 🎨 index.css          # Estilos globais
│
├── 📁 backend/                    # ⚙️ APIs e lógica de negócio
│   ├── 🐳 Dockerfile             # Build Node.js
│   ├── 📦 package.json           # Dependências Node
│   ├── 🚀 server.js              # Servidor principal
│   ├── 📁 config/
│   │   ├── 🗄️ database.js        # Configuração PostgreSQL
│   │   └── 💾 redis.js           # Configuração Redis
│   └── 📁 routes/
│       └── 📝 posts.js           # Rotas dos posts
│
├── 📁 database/                   # 🗄️ Scripts de banco
│   └── 📄 init.sql               # Schema e dados iniciais
│
└── 📁 scripts/                    # 🚀 Automação
    ├── ▶️ start.bat              # Iniciar sistema (Windows)
    ├── ⏹️ stop.bat               # Parar sistema (Windows)
    └── 🔄 reset.bat              # Reset completo (Windows)
```

## 🧪 Exercícios Práticos

### Exercício 1: Testar Separação de Responsabilidades
```bash
# Parar apenas o frontend
docker-compose stop frontend
# Verificar se backend ainda funciona
curl http://localhost:8000/health
```

### Exercício 2: Testar Baixo Acoplamento
```bash
# Substituir PostgreSQL por dados em memória
# Verificar se frontend continua funcionando
```

### Exercício 3: Testar Escalabilidade
```bash
# Escalar backend
docker-compose up --scale backend=3
# Observar distribuição de carga
```

## 🎯 Checkpoint: O que você aprendeu

Após completar este tutorial, marque os itens que você domina:

- [ ] **Separação de Responsabilidades**: Cada container tem função específica
- [ ] **Baixo Acoplamento**: Serviços se comunicam via APIs bem definidas
- [ ] **Alta Coesão**: Código organizado por responsabilidade
- [ ] **Escalabilidade**: Capacidade de escalar componentes independentemente
- [ ] **Observabilidade**: Logs, health checks e monitoramento
- [ ] **Containerização**: Docker e Docker Compose na prática
- [ ] **APIs REST**: Endpoints bem estruturados
- [ ] **Cache Strategy**: Redis para performance

## 🏛️ Conceitos Arquiteturais Demonstrados

### 1. 🎯 Separação de Responsabilidades (SoC)

**Implementação:**
- **Frontend**: Apenas UI/UX
- **Backend**: Apenas APIs e lógica
- **Database**: Apenas persistência
- **Cache**: Apenas performance

**Benefícios observados:**
- Facilita debugging
- Permite desenvolvimento paralelo
- Reduz complexidade

### 2. 🔗 Baixo Acoplamento

**Como implementamos:**
- HTTP/REST para comunicação
- Variáveis de ambiente para configuração
- Containers independentes

**Teste prático:**
```bash
# Trocar PostgreSQL por outro banco sem afetar frontend
# Substituir React por Vue sem afetar backend
```

### 3. 🧩 Alta Coesão

**Estrutura implementada:**
- Routes agrupadas por funcionalidade
- Configurações agrupadas por serviço
- Responsabilidades bem definidas

### 4. 📈 Escalabilidade

**Horizontal:** `docker-compose up --scale backend=3`
**Vertical:** Ajustar recursos de CPU/RAM
**Cache:** Redis para reduzir carga no DB

### 5. 🔧 Manutenibilidade

**Práticas aplicadas:**
- Logs estruturados
- Health checks
- Graceful shutdown
- Documentação completa

## 📊 Endpoints da API

| Método | Endpoint | Descrição | Exemplo |
|--------|----------|-----------|---------|
| `GET` | `/health` | Status do sistema | `curl localhost:8000/health` |
| `GET` | `/api/posts` | Listar posts | `curl localhost:8000/api/posts` |
| `POST` | `/api/posts` | Criar post | Ver exemplo abaixo |
| `DELETE` | `/api/posts/:id` | Deletar post | `curl -X DELETE localhost:8000/api/posts/1` |
| `GET` | `/api/stats` | Estatísticas | `curl localhost:8000/api/stats` |

### Exemplo de Criação de Post
```bash
curl -X POST http://localhost:8000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Meu Primeiro Post",
    "content": "Aprendendo arquitetura de software na prática!",
    "author": "Desenvolvedor"
  }'
```

## 🐳 Comandos Docker Úteis

```bash
# Monitoramento
docker-compose ps                    # Status dos containers
docker-compose logs -f              # Logs em tempo real
docker-compose logs backend         # Logs específicos
docker stats                        # Uso de recursos

# Manutenção
docker-compose down                  # Parar tudo
docker-compose down -v              # Parar + remover volumes
docker-compose build --no-cache     # Rebuild sem cache
docker system prune -f              # Limpeza geral

# Debugging
docker-compose exec backend sh      # Entrar no container
docker-compose exec database psql -U user -d blogdb
```

## 🔍 Troubleshooting

| Problema | Solução |
|----------|---------|
| **Port already in use** | `docker-compose down` |
| **Cannot connect to database** | `docker-compose down -v && docker-compose up` |
| **Frontend não carrega** | `docker-compose build --no-cache frontend` |
| **Redis connection failed** | `docker-compose restart redis backend` |
| **Permission denied (scripts)** | `chmod +x scripts/*.sh` (Linux/Mac) |

## 🚀 Próximos Passos

### Melhorias Sugeridas para Praticar
1. **Adicionar autenticação JWT**
2. **Implementar testes automatizados**
3. **Adicionar paginação nos posts**
4. **Criar sistema de comentários**
5. **Implementar upload de imagens**

### Continuar Aprendizado
**➡️ [Próximo Tutorial: Padrões Arquiteturais](https://github.com/ernanegit/02-padroes-arquiteturais)**

Onde você aprenderá:
- Arquitetura em Camadas
- MVC Pattern
- Repository Pattern
- Clean Architecture

## 📚 Referências e Links Úteis

- [Docker Documentation](https://docs.docker.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [React Documentation](https://react.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/documentation)

## 🤝 Contribuições

Encontrou algum problema ou tem sugestões? 

1. Fork este repositório
2. Crie uma branch para sua correção
3. Faça commit das mudanças
4. Abra um Pull Request

## 👨‍💻 Autor

**Erne** - Estudante de Arquitetura de Software
- GitHub: [@ernanegit](https://github.com/ernanegit)

## 📄 Licença

Este projeto é para fins educacionais e de aprendizado.

---

> **💡 Dica:** Mantenha este tutorial como referência! Os conceitos aqui são fundamentais para todos os próximos tutoriais.

---

**📚 [← Voltar ao Índice Principal](https://github.com/ernanegit/00-arquitetura-software-index)** | **[Próximo Tutorial: Padrões Arquiteturais →](https://github.com/ernanegit/02-padroes-arquiteturais)**
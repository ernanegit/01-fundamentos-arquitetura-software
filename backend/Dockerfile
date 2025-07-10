# Backend Dockerfile
FROM node:16-alpine

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm install --only=production

# Copiar código fonte
COPY . .

# Expor porta
EXPOSE 8000

# Definir usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs

# Comando para iniciar a aplicação
CMD ["npm", "start"]
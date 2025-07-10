# Frontend Dockerfile - Build em múltiplos estágios
FROM node:16-alpine as build

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Verificar se o build foi criado
RUN ls -la /app/build

# Estágio de produção com Nginx
FROM nginx:alpine

# Remover configuração padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiar arquivos buildados
COPY --from=build /app/build /usr/share/nginx/html

# Copiar configuração customizada do Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Criar arquivo de placeholder para favicon se não existir
RUN touch /usr/share/nginx/html/favicon.ico

# Expor porta
EXPOSE 3000

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]
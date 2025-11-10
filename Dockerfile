# ----- Estágio 1: Builder -----
# Usamos uma imagem Node.js completa para instalar e construir o app
FROM node:20 AS builder

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia o package.json e package-lock.json primeiro
COPY package*.json ./

# Instala TODAS as dependências (incluindo devDependencies)
RUN npm install

# Copia o resto do código-fonte
COPY . .

# Constrói o app para produção (cria a pasta /dist)
RUN npm run build

# ----- Estágio 2: Production -----
# Agora, usamos uma imagem "slim" (leve) do Node.js
FROM node:20-slim

# Define o diretório de trabalho (pode ser o mesmo)
WORKDIR /app

# Copia apenas o package.json e package-lock.json
COPY package*.json ./

# Instala APENAS as dependências de produção
RUN npm install --omit=dev

# Copia a pasta 'dist' (o app compilado) do estágio 'builder'
COPY --from=builder /app/dist ./dist

# Expõe a porta que o Nest.js roda (padrão 3000)
EXPOSE 3000

# O comando para iniciar a aplicação
CMD ["node", "dist/main"]
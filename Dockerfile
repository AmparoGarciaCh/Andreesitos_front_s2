# Etapa 1: construir la app con Vite
FROM node:18 AS builder

WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .
RUN yarn build

# Etapa 2: servir los archivos estáticos
FROM node:18-alpine

WORKDIR /app
RUN yarn global add serve
COPY --from=builder /app/dist ./dist

EXPOSE 4173
CMD ["serve", "-s", "dist", "-l", "4173"]

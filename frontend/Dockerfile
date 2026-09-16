# ── Imagen base ──────────────────────────────────────────────────────────────
FROM node:20-alpine

# Instalar pnpm globalmente (gestor de paquetes elegido)
RUN npm install -g pnpm@9

# Directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias primero (mejor cache de capas Docker)
COPY package.json ./

# Instalar dependencias
RUN pnpm install

# Copiar el resto del código fuente
# En desarrollo, sobreescrito por bind-mount del docker-compose
COPY . .

# Exponer el puerto de Vite
EXPOSE 5173

# Comando de inicio
CMD ["pnpm", "dev"]

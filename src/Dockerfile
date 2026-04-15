FROM node:22-alpine

ENV NODE_ENV=production \
    APP_NAME="Conversor de Temperatura 2.0" \
    APP_ENV=production \
    PORT=8080

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev && npm cache clean --force

COPY server.js convert.js ./
COPY views ./views
COPY public ./public

EXPOSE 8080

USER node

CMD ["npm", "start"]

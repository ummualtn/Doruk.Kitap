# Node.js + Express + PostgreSQL backend Dockerfile
FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV NODE_ENV=production

EXPOSE 4000

CMD ["npm", "run", "dev"]

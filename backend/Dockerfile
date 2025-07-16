# Node.js + Express + PostgreSQL backend Dockerfile
FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Environment variables
ENV DB_HOST=postgres
ENV DB_PORT=5432
ENV DB_NAME=proje_db
ENV DB_USER=postgres
ENV DB_PASSWORD=postgres
ENV RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672
ENV REDIS_URL=redis://redis:6379
ENV NODE_ENV=production

EXPOSE 4000

CMD ["npm", "run", "dev"]

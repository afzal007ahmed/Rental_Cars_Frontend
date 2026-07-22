FROM node:22-bookworm-slim AS builder

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]

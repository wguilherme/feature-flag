FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ARG FLAGD_MODE=operator
ENV FLAGD_MODE=$FLAGD_MODE

EXPOSE 3000

CMD ["node", "src/index.js"]

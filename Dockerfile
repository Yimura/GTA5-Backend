FROM node:current-alpine

EXPOSE 8080

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm i --silent

COPY . .

ENTRYPOINT [ "node", "--experimental-loader=./util/loader.js", "." ]
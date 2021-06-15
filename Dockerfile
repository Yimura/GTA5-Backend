FROM node:alpine

WORKDIR /app
EXPOSE 8080

COPY package.json package-lock.json ./

RUN npm i --silent

COPY . .

ENTRYPOINT [ "node", "--experimental-loader=./util/loader.js", "."]

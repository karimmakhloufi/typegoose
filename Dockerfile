FROM node:alpine

RUN mkdir app

WORKDIR /app

COPY tsconfig.json ./
COPY package.json ./
COPY yarn.lock ./
COPY index.ts ./

RUN yarn

CMD yarn start
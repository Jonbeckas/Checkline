### STAGE 1: Build ###
FROM node:14.9.0-alpine3.12 AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN ls
RUN npm run build:dev
### STAGE 2: Run ###
FROM node
COPY --from=build /usr/src/app/build /usr/build
ENTRYPOINT node /usr/build/index.js


### STAGE 1: Build ###
FROM node:lts-alpine AS build
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


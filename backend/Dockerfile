### STAGE 1: Build ###
FROM node:lts-alpine AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN ls
RUN npm run build
### STAGE 2: Run ###
FROM node:lts-alpine
COPY --from=build /usr/src/app/build /usr/build
WORKDIR /usr/build
RUN npm install
RUN adduser --disabled-password checklineuser
USER checklineuser
ENTRYPOINT node /usr/build/main.js


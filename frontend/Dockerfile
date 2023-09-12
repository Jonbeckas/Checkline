### STAGE 1: Build ###
FROM node:20-alpine AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run buildprod
### STAGE 2: Run ###
FROM nginx:mainline-alpine
COPY --from=build /usr/src/app/dist/Checkline /usr/share/nginx/html


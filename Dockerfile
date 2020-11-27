FROM --platform=$BUILDPLATFORM node:lts-alpine AS build
WORKDIR /build
COPY package.json .
COPY package-lock.json .
RUN npm ci
COPY . .
RUN sed -i "s/__dirname/'\/data'/g" ./src/Configuration.ts
RUN npm run build

FROM node:lts-alpine
WORKDIR /app
COPY --from=build /build/. .
RUN mkdir -p /data
RUN npm i -g

ENTRYPOINT [ "mexport" ]
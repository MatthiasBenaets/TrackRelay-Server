FROM node:lts-slim AS build
WORKDIR /app

COPY package*.json ./

COPY . .
RUN npm install

RUN npm run build

FROM node:lts-slim AS runner
WORKDIR /app

COPY --from=build /app/package*.json ./
COPY --from=build /app/build ./build

RUN npm ci --omit=dev

EXPOSE 8080

ENTRYPOINT ["npm", "run", "start"]

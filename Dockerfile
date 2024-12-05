FROM node:18-alpine AS builder
WORKDIR /kit
COPY . .
RUN npm install
RUN npm run build && npm prune --production

FROM node:18-alpine AS express
WORKDIR /app
COPY --from=builder /kit/build /app/build
COPY --from=builder /kit/server.js /app/server.js
COPY --from=builder /kit/package.json /app/package.json
COPY --from=builder /kit/package-lock.json /app/package-lock.json
RUN npm install express

ENV BODY_SIZE_LIMIT=5242880
EXPOSE 8080
CMD ["sh", "-c", "node server.js"]

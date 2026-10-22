FROM node:22.23.4-bookworm-slim AS frontend
WORKDIR /app/static
COPY static/package*.json ./
RUN npm ci
COPY static/ ./
RUN npm run build

FROM node:22.23.4-bookworm-slim
WORKDIR /app
COPY server/package*.json ./server/
RUN cd server && npm ci --omit=dev && npm cache clean --force
COPY server/ ./server/
COPY --from=frontend /app/static/build ./static/build
USER node
ENV NODE_ENV=production PORT=3000
EXPOSE 3000
CMD ["node", "server/index.js"]

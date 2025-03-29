# Client

FROM node:22-slim AS client-build-env
WORKDIR /app
COPY client/package.json client/package-lock.json /app/package.json
RUN npm ci

FROM nginx:stable-alpine AS production-frontend
LABEL org.opencontainers.image.source=https://github.com/akai-org/mafiakai
COPY client/nginx.conf /etc/nginx/nginx.conf
COPY --from=client-build-env /app/client/build/client /usr/share/nginx/html
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"] 

# Server

FROM node:22-slim AS server-development-dependencies-env
WORKDIR /app
COPY server/package.json server/package-lock.json /app/server/
RUN npm ci

FROM node:22-slim AS server-production-dependencies-env
WORKDIR /app
COPY server/package.json server/package-lock.json /app/server/
RUN npm ci --omit=dev

FROM node:22-slim AS server-build-env
WORKDIR /app
COPY types /app/types
COPY server /app/server/
COPY --from=server-development-dependencies-env /app/node_modules /app/node_modules
RUN npm run build

FROM gcr.io/distroless/nodejs22:nonroot AS production-backend
LABEL org.opencontainers.image.source=https://github.com/akai-org/mafiakai
WORKDIR /app
ENV NODE_ENV=production
EXPOSE 3001
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/apps/backend/dist /app/dist
CMD ["dist/index.js"]

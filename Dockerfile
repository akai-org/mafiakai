# Client

FROM node:22-slim AS client-build-env
WORKDIR /app/client
COPY client/package.json client/package-lock.json /app/client/
RUN npm ci --omit=optional
COPY types /app/types
COPY client /app/client
RUN npm run build

FROM nginx:stable-alpine AS production-frontend
LABEL org.opencontainers.image.source=https://github.com/akai-org/mafiakai
COPY client/nginx.conf /etc/nginx/nginx.conf
COPY --from=client-build-env /app/client/dist /usr/share/nginx/html
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"] 

# Server

FROM node:22-slim AS server-development-dependencies-env
WORKDIR /app/server
COPY server/package.json server/package-lock.json /app/server/
RUN npm ci --omit=optional

FROM node:22-slim AS server-production-dependencies-env
WORKDIR /app/server
COPY server/package.json server/package-lock.json /app/server/
RUN npm ci --omit=dev --omit=optional

FROM node:22-slim AS server-build-env
WORKDIR /app/server
COPY --from=server-development-dependencies-env /app/server/node_modules /app/server/node_modules
COPY types /app/types
COPY server /app/server/
RUN npm run build

FROM gcr.io/distroless/nodejs22:nonroot AS production-backend
LABEL org.opencontainers.image.source=https://github.com/akai-org/mafiakai
WORKDIR /app
ENV NODE_ENV=production
EXPOSE 5000
COPY --from=server-production-dependencies-env /app/server/node_modules /app/node_modules
COPY --from=server-build-env /app/server/dist /app/dist
WORKDIR /app/dist/server
CMD ["src/index.js"]

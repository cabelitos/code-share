FROM node:16.11.1-alpine

WORKDIR /app
COPY . /app
RUN apk add --no-cache build-base python3 && yarn install && yarn build

FROM nginx:alpine as client

WORKDIR /
RUN rm -rf /usr/share/nginx/html/*
COPY --from=0 /app/client/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

FROM node:16.11.1-alpine as server

WORKDIR /app
COPY --from=0 /app/server/build /app
COPY --from=0 /app/node_modules/ /app/node_modules
COPY --from=0 /app/server/utils/docker/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh
EXPOSE 4000
ENV NODE_ENV=production
ENTRYPOINT ["/app/entrypoint.sh"]

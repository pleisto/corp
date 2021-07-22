FROM node:16 as build
WORKDIR /app
ADD . /app
RUN yarn install && yarn build-storybook --docs

FROM ghcr.io/brickdoc/wrapdrive:latest
LABEL org.opencontainers.iamge.authors="secure@brickdoc.com"
LABEL org.opencontainers.image.source = "https://github.com/brickdoc/brickdoc"
COPY --from=build /app/storybook-static /var/www/html
CMD ["/wrapdrive"]

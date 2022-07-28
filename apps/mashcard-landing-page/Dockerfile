FROM  ghcr.io/pleisto/wrapdrive:latest
LABEL org.opencontainers.iamge.authors="secure@pleisto.com"
LABEL org.opencontainers.image.licenses = "Apache-2.0"
LABEL org.opencontainers.image.source = "https://github.com/pleisto/corp"
LABEL org.opencontainers.image.documentation = "https://github.com/pleisto/corp/blob/master/apps/mashcard-landing-page/README.md"
ADD ./public/ /var/www/html
CMD ["/wrapdrive"]

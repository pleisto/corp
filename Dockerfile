ARG RAILS_ENV=production 
FROM ruby:3-buster as builder

# Add NodeJS & PostgreSQL apt sources.
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
RUN curl https://apt.postgresql.org/pub/repos/apt/ACCC4CF8.asc | apt-key add -
RUN echo "deb http://apt.postgresql.org/pub/repos/apt/ buster-pgdg main" | \
  tee /etc/apt/sources.list.d/postgres.list

RUN apt-get install --no-install-recommends -y nodejs libpq-dev \ 
  && npm install -g yarn

# Rust compiler toolchain
# ENV PATH="/root/.cargo/bin:${PATH}"
# RUN  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs -o /tmp/sh.rustup.rs && \
#  chmod +x /tmp/sh.rustup.rs && /tmp/sh.rustup.rs -y
ARG RAILS_ENV
ENV RAILS_ENV=${RAILS_ENV}
COPY . /app
WORKDIR /app
RUN echo $RAILS_ENV

RUN bundle config set without 'test development' && bundle config set deployment 'true' \
  && echo 'gem: --no-rdoc --no-ri' >> "$HOME/.gemrc" \
  && bundle install --retry 2 --jobs 4  \
  && yarn install --immutable && yarn dist

# Cleanup
RUN rm -rf node_modules .git .yarn frontends dist public/esm-bundle/stats.json *.js *.json *.yml yarn.lock \
  # Remove ./packages without local gems
  && find ./packages/* -maxdepth 0 -type d | \
  grep -v 'brickdoc_settings' | \
  grep -v 'rubocop-brickdoc' | \
  xargs rm -rf

FROM ruby:3-slim-buster
LABEL org.opencontainers.iamge.authors="secure@brickdoc.com"
LABEL org.opencontainers.image.licenses = "Apache-2.0"
LABEL org.opencontainers.image.source = "https://github.com/brickdoc/brickdoc"
COPY --from=builder /root/.bundle/config /root/.bundle/
COPY --from=builder /app /app

RUN apt-get update && apt-get install --no-install-recommends -y \
  libcurl4-openssl-dev libpq-dev libxml2-dev libxslt-dev libjemalloc2 \
  && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* 

# Use jemalloc by default
ENV LD_PRELOAD=/usr/lib/x86_64-linux-gnu/libjemalloc.so.2
ARG RAILS_ENV
ENV RAILS_ENV=$RAILS_ENV
ENV RAILS_SERVE_STATIC_FILES=true

EXPOSE 3000
WORKDIR /app
RUN  bundle install
ENTRYPOINT ["/app/bin/docker-entrypoint"]

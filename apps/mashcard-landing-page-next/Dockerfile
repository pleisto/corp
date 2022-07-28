# Stage 1: Prepare the dependency files (so we can utilite docker cache to speed up the build)
FROM ghcr.io/pleisto/ruby-3:latest as base

# RUN with pipe recommendation: https://github.com/hadolint/hadolint/wiki/DL4006
SHELL ["/bin/bash", "-o", "pipefail", "-c"]
WORKDIR /app

RUN --mount=type=bind,target=/docker-context \
  cd /docker-context && \
  find . -name package.json -exec cp --parents {} /app/ \; && \
  cp -rf yarn.lock .yarnrc.yml .yarn /app && \
  mkdir -p /app/foss/.yarn && cp -rf foss/.yarn/patches /app/foss/.yarn && \
  mkdir -p /app/foss/packages/dev-support && cp -rf foss/packages/dev-support/src /app/foss/packages/dev-support

# Stage 2: Install dependencies and build the app
FROM ghcr.io/pleisto/ruby-3:latest as builder

SHELL ["/bin/bash", "-o", "pipefail", "-c"]
WORKDIR /app

RUN curl https://get.volta.sh | bash

ENV NODE_OPTIONS=--max-old-space-size=5950
ENV PATH /root/.volta/bin:/root/.cargo/bin:$PATH
ENV CI=1

COPY --from=base /app .
RUN yarn install --immutable

COPY . .

WORKDIR /app/apps/mashcard-landing-page
RUN yarn build
EXPOSE 3000
CMD ["yarn", "start"]

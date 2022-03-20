# Install dependencies only when needed
FROM node:16 AS deps
WORKDIR /appDeps
ADD ./ /appDeps
RUN yarn install && yarn landing-page build

FROM node:16 AS builder
WORKDIR /app
COPY --from=deps /appDeps/node_modules ./
COPY . .

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=deps /appDeps/apps/landing-page/next.config.js ./
COPY --from=deps /appDeps/apps/landing-page/public ./public

COPY --from=deps --chown=nextjs:nodejs /appDeps/apps/landing-page/.next/standalone ./
COPY --from=deps --chown=nextjs:nodejs /appDeps/apps/landing-page/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]

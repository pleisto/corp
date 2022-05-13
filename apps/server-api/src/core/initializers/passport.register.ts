import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'
import { NestFastifyApplication } from '@nestjs/platform-fastify'

// HACK: support redirect to fastify instance `request`
// SEE: https://github.com/nestjs/nest/issues/5702#issuecomment-979893525
const PassportPlugin: FastifyPluginAsync = async (fastify, _options) => {
  fastify.addHook('onRequest', (request, reply, next) => {
    ;(reply as any).setHeader = (key: any, value: any) => {
      return reply.raw.setHeader(key, value)
    }
    ;(reply as any).end = () => {
      reply.raw.end()
    }
    ;(request as any).res = reply
    next()
  })
}

export const passportRegister = async (app: NestFastifyApplication): Promise<void> => {
  await app.register(fp(PassportPlugin))
}

import { UserModule } from '@brickdoc/server-api/src/accounts/users'
import { AuthModule } from '@brickdoc/server-api/src/accounts/auth'
import { DynamicModule, Module } from '@nestjs/common'
import { MockController } from './mock.controller'

import { Session } from '@brickdoc/server-api/src/core/session/session.class'

declare module 'fastify' {
  interface FastifyRequest {
    session: Session
  }
}

@Module({
  imports: [UserModule, AuthModule]
})
export class MockModule {
  static forRoot(): DynamicModule {
    return {
      module: MockModule,
      controllers: [MockController]
    }
  }
}

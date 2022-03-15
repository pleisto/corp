import { Module, OnApplicationShutdown } from '@nestjs/common'
import { PinoLogger } from 'nestjs-pino'
import { CommonModule } from './common/common.module'
import { CoreModule } from './core/core.module'
import { AntiCorruptionModule } from './anti-corruption/anti-corruption.module'
import { DiscussionModule } from './docs/discussion/discussion.module'
import { NotificationModule } from './notification/notification.module'
/**
 * The root module of the server application.
 */
@Module({
  imports: [CommonModule, CoreModule, AntiCorruptionModule, DiscussionModule, NotificationModule]
})
export class ServerModule implements OnApplicationShutdown {
  constructor(private readonly logger: PinoLogger) {
    // use safe navigation operator to avoid error on devtools console
    this.logger?.setContext('BrickdocServer')
  }

  public async onApplicationShutdown(signal: string): Promise<void> {
    this.logger.info({ signal }, 'Server is shutting down now')
  }
}

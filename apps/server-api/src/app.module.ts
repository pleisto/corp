import { Module } from '@nestjs/common'
import { PodsModule } from './pods/pods.module'
import { CommonModule } from './common/common.module'
import { CoreModule } from './core/core.module'
import { DocsModule } from './docs/docs.module'

/**
 * The root module of the server application.
 */
@Module({
  imports: [CommonModule, CoreModule, DocsModule, PodsModule]
})
export class AppModule {}

import { DynamicModule, Module, Global } from '@nestjs/common'
@Global()
@Module({})
export class SettingsModule {
  static forRoot(): DynamicModule {
    return {
      module: SettingsModule
    }
  }
}

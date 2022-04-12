import { Module, DynamicModule } from '@nestjs/common'
import { LoggerModule as LoggerCoreModule } from 'nestjs-pino'
import { env } from 'process'
import { LogLevel } from './logger.interface'

// `nestjs-pino.LoggerModule` already is a global module, so we don't need to use `@Global()` decorator.
@Module({})
export class LoggerModule {
  static forRoot(): DynamicModule {
    return {
      module: LoggerModule,
      imports: [
        LoggerCoreModule.forRoot({
          pinoHttp: {
            messageKey: 'message',
            formatters: {
              level: (label: string) => ({ level: label }),
              bindings: (bindings: Record<string, unknown>) => ({ ...bindings, env: env.NODE_ENV })
            },
            useLevel: (env.NODE_ENV === 'production' ? LogLevel.Info : LogLevel.Debug) as LogLevel,
            // Redact sensitive data from logs to comply with GDPR or other privacy regulations
            redact: {
              // todo: add hooks support
              paths: ['variables.input.password'],
              censor: '__SENSITIVE_DATA__'
            }
          }
        })
      ]
    }
  }
}

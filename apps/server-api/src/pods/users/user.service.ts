import { Injectable } from '@nestjs/common'
import { UserCredentialInput } from './user.interface'
import { InjectPool, type DatabasePool } from '@brickdoc/nestjs-slonik'
import { User } from './user.object-type'
import { createUserByCredential, findCredential, findUserById, findUserBySlug } from './user.sql-builder'
import { err, Result, ok } from '@brickdoc/active-support'
import { UserAppearanceUpdateInput } from './models/user_appearance_update.input'
import { SettingsService } from '../../common/settings'
import { UserSession } from '../auth'
@Injectable()
export class UserService {
  constructor(@InjectPool() private readonly pool: DatabasePool, private readonly settingService: SettingsService) {}

  /**
   * Find or create a user by credential
   * @param credential
   */
  async findOrCreateUser(credential: UserCredentialInput): Promise<Result<User, Error>> {
    const credentialResult = await findCredential(this.pool, credential.provider, credential.subject)
    if (credentialResult.isErr()) return err(credentialResult.error)

    // if credential found in database, return user
    if (credentialResult.value) {
      return await findUserById(this.pool, credentialResult.value.podId)
    }

    // if credential is not found, create user
    return await createUserByCredential(this.pool, credential)
  }

  /**
   * Get a user by id
   * @param id
   */
  async findUserById(id: number): Promise<Result<User, Error>> {
    return await findUserById(this.pool, id)
  }

  /**
   * Get a user by slug
   */
  async findUserBySlug(slug: string): Promise<Result<User, Error>> {
    return await findUserBySlug(this.pool, slug)
  }

  /**
   * Update user appearance
   * @param user
   * @param input
   */
  async updateUserAppearance(user: UserSession, input: UserAppearanceUpdateInput): Promise<Result<boolean, Error>> {
    const context = { userId: String(user.id) }
    const [localeKey, timezoneKey] = ['core.defaultLanguage', 'core.defaultTimezone']
    const localeResult = await this.settingService.get<UserAppearanceUpdateInput['locale']>(localeKey, context)
    if (localeResult.isErr()) return err(localeResult.error)

    if (localeResult.value !== input.locale) {
      const result = await this.settingService.update<UserAppearanceUpdateInput['locale']>(
        localeKey,
        input.locale,
        context
      )
      if (result.isErr()) return err(result.error)
    }

    const timezoneResult = await this.settingService.get<UserAppearanceUpdateInput['timezone']>(timezoneKey, context)
    if (timezoneResult.isErr()) return err(timezoneResult.error)

    if (timezoneResult.value !== input.timezone) {
      const result = await this.settingService.update<UserAppearanceUpdateInput['timezone']>(
        timezoneKey,
        input.timezone,
        context
      )
      if (result.isErr()) return err(result.error)
    }
    return ok(true)
  }
}

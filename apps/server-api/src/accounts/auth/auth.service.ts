import { Injectable } from '@nestjs/common'
import { User } from '../users/models/user.object'
import { SESSION_USER_KEY, UserSession } from './auth.interface'
import { type FastifyRequest } from 'fastify'

@Injectable()
export class AuthService {
  // constructor() {}

  async login(req: FastifyRequest, user: UserSession): Promise<void> {
    req.session.set(SESSION_USER_KEY, user)
  }

  async validate({ body }: Request): Promise<User | null> {
    return null
  }
}

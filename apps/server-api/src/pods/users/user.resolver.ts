import { forwardRef, Inject, UseGuards } from '@nestjs/common'
import { Resolver, Query, Mutation, Context, type GqlExecutionContext } from '@nestjs/graphql'
import { AuthService, type UserSession } from '../auth'
import { CurrentUser } from '../auth/currentUser.decorator'
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard'
import { User } from './user.object-type'
import { UserService } from './user.service'
// import { FastifyRequest } from 'fastify'

// declare module '@nestjs/graphql' {
//   interface GqlExecutionContext {
//     req: FastifyRequest
//   }
// }

@Resolver((of: unknown) => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    @Inject(forwardRef(() => AuthService)) private readonly authService: AuthService
  ) {}

  @Query(() => User, {
    description: 'Get information about current user.'
  })
  @UseGuards(GqlAuthGuard)
  async currentUser(@CurrentUser() user: UserSession): Promise<User> {
    const result = await this.userService.findUserById(user.id)
    if (result.isErr()) throw result.error
    return result.value
  }

  @Mutation(() => Boolean, {
    description: 'Logout current user.'
  })
  @UseGuards(GqlAuthGuard)
  async logout(@Context() ctx: GqlExecutionContext): Promise<boolean> {
    return await this.authService.deleteSession((ctx as any).req)
  }
}

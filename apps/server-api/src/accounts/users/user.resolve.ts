import { UseGuards } from '@nestjs/common'
import { Resolver, Query, Args } from '@nestjs/graphql'
import type { UserSession } from '../auth'
import { CurrentUser } from '../auth/currentUser.decorator'
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard'
import { UserInput } from './models/user.input'
import { User } from './models/user.object'
import { UserService } from './user.service'

@Resolver((of: unknown) => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(returns => User)
  async hello(@Args('id') { id }: UserInput): Promise<User> {
    return {
      id,
      slug: `user-${id}`,
      name: `User ${id}`,
      bio: null,
      avatarUrl: null,
      isInitialized: false,
      lockedAt: null,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime()
    }
  }

  @Query(() => User, {
    description: 'Return current user profile.'
  })
  @UseGuards(GqlAuthGuard)
  async profile(@CurrentUser() user: UserSession): Promise<User> {
    const result = await this.userService.getUserById(user.id)
    if (result.isErr()) throw result.error
    return result.value
  }
}

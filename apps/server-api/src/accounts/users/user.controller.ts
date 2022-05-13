import { Controller, forwardRef, Get, Inject, UseGuards, Request } from '@nestjs/common'
import { SessionAuthGuard } from '../auth/guards/session-auth.guard'
import { User, UserService } from '../users'

@Controller('u')
export class UserController {
  constructor(@Inject(forwardRef(() => UserService)) private readonly userService: UserService) {}

  @Get('hello')
  hello(): string {
    return 'world'
  }

  @UseGuards(SessionAuthGuard)
  @Get()
  async getProfile(@Request() req: any): Promise<User> {
    const result = await this.userService.getUserById(req.user.id)
    if (result.isErr()) throw result.error
    return result.value
  }
}

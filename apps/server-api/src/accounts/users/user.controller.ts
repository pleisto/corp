import { Controller, forwardRef, Get, Inject, UseGuards, Request } from '@nestjs/common'
import { SessionAuthGuard } from '../auth/guards/session-auth.guard'
import { User, UserService } from '../users'

@Controller('/.internal-apis/accounts')
export class UserController {
  constructor(@Inject(forwardRef(() => UserService)) private readonly userService: UserService) {}

  @UseGuards(SessionAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: any): Promise<User> {
    const result = await this.userService.getUserById(req.user.id)
    if (result.isErr()) throw result.error
    return result.value
  }
}

import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common'
import { GoogleAuthGuard } from './google-auth.guard'
import { AuthService } from '@brickdoc/server-api/src/pods/auth'
import { AUTH_REDIRECT_PATH } from '@brickdoc/server-api/src/pods/users'

@Controller('accounts/auth/google_oauth2')
export class GoogleAuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() _req: Request): Promise<void> {
    // Guard redirects
  }

  @Get('callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() req: any, @Res() res: any): Promise<any> {
    await this.authService.createSession(req, req.user)
    // Redirect
    return res.status(302).redirect(AUTH_REDIRECT_PATH)
  }
}

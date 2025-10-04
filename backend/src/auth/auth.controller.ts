import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/createuser.dto';
import { Public } from './decorators/public.decorator';
import { RefreshAuthGuard } from './guards/refresh-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() body: { username: string; password: string })
  {
    return await this.authService.login(body.username, body.password);
  }

  @Public()
  @Post('signup')
  async signup(@Body() body: CreateUserDto)
  {
    return await this.authService.signup(body);
  }
  
  @Public()
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  refresh(@Req() req) {
    // req.user is the decoded refresh token payload
    return this.authService.refresh(req.user.id);
  }
}

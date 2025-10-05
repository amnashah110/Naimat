import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/createuser.dto';
import { Public } from './decorators/public.decorator';
import { RefreshAuthGuard } from './guards/refresh-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req)
  {
    return await this.authService.login(req.user.id);
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
  refresh(@Req() req)
  {
    return this.authService.refresh(req.user.id);
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  async googleLogin()
  {

  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleRedirect(@Req() req)
  {
    return await this.authService.login(req.user.id);
    //res.redirect(`http://localhost:3000/?token=${response.jwt}&refresh=${response.refresh}`);
  }
}

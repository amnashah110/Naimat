import { Body, Controller, Get, HttpCode, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LegacyCreateUserDto } from 'src/user/dto/legacycreateuser.dto';
import { Public } from './decorators/public.decorator';
import { RefreshAuthGuard } from './guards/refresh-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { EmailService } from './strategies/passwordless-auth/services/email.service';
import { OtpService } from './strategies/passwordless-auth/services/otp.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
    private readonly otpService: OtpService
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req)
  {
    return await this.authService.signTokens(req.user.id);
  }

  @Public()
  @Post('signup')
  async signup(@Body() body: LegacyCreateUserDto)
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
  @Get('google/verify')
  async googleVerify()
  {

  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @HttpCode(202)
  @Get('google/callback')
  async googleRedirect(@Req() req)
  {
    return await this.authService.signTokens(req.user.id);
    //res.redirect(`http://localhost:3000/?token=${response.jwt}&refresh=${response.refresh}`);
  }

  @Public()
  @Post('passwordless/requestcode')
  @HttpCode(200)
  async requestCode(@Body() body: { email: string }) {
    // Always respond 204 to avoid user enumeration

    if (!body.email) throw new UnauthorizedException('Email is required');
    const { code } = await this.otpService.create(body.email);
    await this.emailService.sendLoginCode(body.email, code);
    return { status: 'Code sent' };
  }

  @Public()
  @Post('passwordless/verifycode')
  @HttpCode(202)
  async verifyCode(@Body() dto: { email: string; code: string }) {
    const { email, code } = dto;
    await this.otpService.verify(email, code, 5); // 5 attempts max

    // Create/find user, issue tokens
    const user = await this.authService.userinfofromemail(email);
    return await this.authService.signTokens(user.id);

    // In production, set refresh token in HttpOnly Secure cookie:
    // res.cookie('refresh_token', tokens.refresh, { httpOnly: true, secure: true, sameSite: 'lax', maxAge: ... })
  }
}

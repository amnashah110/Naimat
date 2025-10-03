import { Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post('login')
  login() {
    console.log('login');
    return { endpoint: 'login' };
  }

  @Post('register')
  register() {
    console.log('register');
    return { endpoint: 'register' };
  }

  @Post('logout')
  logout() {
    console.log('logout');
    return { endpoint: 'logout' };
  }
}

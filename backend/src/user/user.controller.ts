import { Body, Controller, Get, HttpCode, Put, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/updateUser.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getUserProfile(@Req() req) {
    return await this.userService.findById(req.user.id);
  }

  @Put('update')
  @HttpCode(201)
  async updateUser(@Body() user: UpdateUserDto)
  {
    return await this.userService.updateuser(user);
  }
}

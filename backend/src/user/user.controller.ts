import { Body, Controller, Get, HttpCode, Put, Req, UseGuards, Param, NotFoundException } from '@nestjs/common';
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

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getUserById(@Param('id') id: string) {
    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      throw new NotFoundException('Invalid user ID');
    }
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // Return only necessary fields for privacy
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  @Put('update')
  @HttpCode(201)
  async updateUser(@Body() user: UpdateUserDto)
  {
    return await this.userService.updateuser(user);
  }
}

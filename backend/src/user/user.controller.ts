import { Body, Controller, HttpCode, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/updateUser.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put('update')
  @HttpCode(201)
  async updateUser(@Body() user: UpdateUserDto)
  {
    return await this.userService.updateuser(user);
  }
}

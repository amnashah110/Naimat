import { Controller } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { FoodpostService } from './foodpost.service';

@Controller('foodpost')
export class FoodpostController {
  constructor(private readonly foodpostService: FoodpostService) {}


  //more to be added here later

  
  // GET /foodpost/unclaimed
  @Get('unclaimed')
  async getUnclaimedPosts() {
    return await this.foodpostService.findUnclaimedPosts();
  }
}
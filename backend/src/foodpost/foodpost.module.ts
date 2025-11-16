import { Module } from '@nestjs/common';
import { FoodpostController } from './foodpost.controller';
import { FoodpostService } from './foodpost.service';

@Module({
  controllers: [FoodpostController],
  providers: [FoodpostService]
})
export class FoodpostModule {}

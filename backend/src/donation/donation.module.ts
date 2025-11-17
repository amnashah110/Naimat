import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DonationController } from './donation.controller';
import { DonationService } from './donation.service';
import { FoodPost } from '../entities/foodpost.entity';

@Module({
  imports: [MulterModule.register({ dest: './uploads' }), TypeOrmModule.forFeature([FoodPost])],
  controllers: [DonationController],
  providers: [DonationService],
})
export class DonationModule {}

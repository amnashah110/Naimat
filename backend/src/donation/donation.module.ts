import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DonationController } from './donation.controller';
import { DonationService } from './donation.service';
import { FoodPost } from '../entities/foodpost.entity';
import { User } from '../entities/user.entity';
import { EmailService } from '../auth/strategies/passwordless-auth/services/email.service';
import { ConfigModule } from '@nestjs/config';
import emailConfig from 'src/auth/config/email.config';

@Module({
  imports: [
    MulterModule.register({ dest: './uploads' }), 
    TypeOrmModule.forFeature([FoodPost, User]),
    ConfigModule.forFeature(emailConfig),
  ],
  controllers: [DonationController],
  providers: [DonationService, EmailService],
})
export class DonationModule {}

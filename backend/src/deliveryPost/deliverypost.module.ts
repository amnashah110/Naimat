import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryPost } from '../entities/deliverypost.entity';
import { FoodPost } from '../entities/foodpost.entity';
import { User } from '../entities/user.entity';
import { DeliveryPostService } from './deliverypost.services';
import { DeliveryPostController } from './deliverypost.controller';
import { EmailService } from '../auth/strategies/passwordless-auth/services/email.service';
import emailConfig from '../auth/config/email.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([DeliveryPost, FoodPost, User]),
    ConfigModule.forFeature(emailConfig),
  ],
  controllers: [DeliveryPostController],
  providers: [DeliveryPostService, EmailService],
  exports: [DeliveryPostService],
})
export class DeliveryPostModule {}

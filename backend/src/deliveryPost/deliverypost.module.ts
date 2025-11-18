import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryPost } from '../entities/deliverypost.entity';
import { DeliveryPostService } from './deliverypost.services';
import { DeliveryPostController } from './deliverypost.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryPost])],
  controllers: [DeliveryPostController],
  providers: [DeliveryPostService],
  exports: [DeliveryPostService],
})
export class DeliveryPostModule {}

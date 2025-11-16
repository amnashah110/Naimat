import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RiderService } from './rider.services';
import { RiderController } from './rider.controller';
import { Rider } from '../entities/rider.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rider])],
  providers: [RiderService],
  controllers: [RiderController],
  exports: [RiderService],
})
export class RiderModule {}

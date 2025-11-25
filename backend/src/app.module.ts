import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import dbConfig from './config/db.config';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { DonationModule } from './donation/donation.module';
import { DeliveryPostModule } from './deliveryPost/deliverypost.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, expandVariables: true }),
    TypeOrmModule.forRootAsync({useFactory: dbConfig}),
    ThrottlerModule.forRoot([
      {
      ttl: 60,
      limit: 10,
      },
    ]),
    CacheModule.register({
      isGlobal: true,
      ttl: 0,
      max: 100, // maximum number of items in cache
    }),
    AuthModule,
    UserModule,
    DonationModule,
    DeliveryPostModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {provide: APP_GUARD, useClass: ThrottlerGuard},
    //{provide: APP_GUARD, useClass: JwtAuthGuard},
  ],
})
export class AppModule {}
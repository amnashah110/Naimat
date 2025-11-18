import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { DeliveryPostService } from './deliverypost.services';

@Controller('delivery-post')
export class DeliveryPostController {
  constructor(private service: DeliveryPostService) {}

  // 1. create entry
  @Post('create')
  async create(@Body() body: any) {
    return this.service.createDelivery(body);
  }

  // 2. get all
  @Get('all')
  async findAll() {
    return this.service.findAll();
  }

  // 3. find by ANY field
  @Get('find')
  async find(@Query('field') field: string, @Query('value') value: string) {
    return this.service.findByField(field as any, value);
  }
}

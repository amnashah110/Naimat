import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { RiderService } from './rider.services';
import { CreateRiderDto } from './dto/create-rider.dto';
import { UpdateRiderDto } from './dto/update-rider.dto';

@Controller('rider')
export class RiderController {
  constructor(private readonly riderService: RiderService) {}

  @Get()
  async getAll() {
    return this.riderService.findAll();
  }

  @Get(':userId')
  async getOne(@Param('userId') userId: number) {
    return this.riderService.findById(userId);
  }

  @Post()
  async create(@Body() dto: CreateRiderDto) {
    return this.riderService.create(dto);
  }

  @Put()
  async update(@Body() dto: UpdateRiderDto) {
    return this.riderService.update(dto);
  }

  @Delete(':userId')
  async delete(@Param('userId') userId: number) {
    return this.riderService.delete(userId);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rider } from '../entities/rider.entity';
import { CreateRiderDto } from './dto/create-rider.dto';
import { UpdateRiderDto } from './dto/update-rider.dto';

@Injectable()
export class RiderService {
  constructor(@InjectRepository(Rider) private riderRepo: Repository<Rider>) {}

  async findAll(): Promise<Rider[]> {
    return await this.riderRepo.find({ relations: ['user', 'currentLocation', 'assignedPosts'] });
  }

  async findById(userId: number): Promise<Rider> {
    const rider = await this.riderRepo.findOne({ where: { userId }, relations: ['user', 'currentLocation'] });
    if (!rider) throw new NotFoundException(`Rider with userId ${userId} not found`);
    return rider;
  }

  async create(dto: CreateRiderDto): Promise<Rider> {
    const rider = this.riderRepo.create(dto);
    return await this.riderRepo.save(rider);
  }

  async update(dto: UpdateRiderDto): Promise<Rider> {
    const { userId, ...updateData } = dto;
    const result = await this.riderRepo.update(userId, updateData);
    if (result.affected === 0) throw new NotFoundException(`Rider with userId ${userId} not found`);
    return this.findById(userId);
  }

  async delete(userId: number): Promise<void> {
    const result = await this.riderRepo.delete(userId);
    if (result.affected === 0) throw new NotFoundException(`Rider with userId ${userId} not found`);
  }
}

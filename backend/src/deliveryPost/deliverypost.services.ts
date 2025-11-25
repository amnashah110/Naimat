import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, IsNull } from 'typeorm';
import { DeliveryPost } from '../entities/deliverypost.entity';

@Injectable()
export class DeliveryPostService {
  constructor(
    @InjectRepository(DeliveryPost)
    private repo: Repository<DeliveryPost>,
  ) {}

  // 1. create an entry when delivery is chosen
  async createDelivery(data: {
    foodpost_id: number;
    rider_id?: number;
    recipient_id?: number;
    latitude?: number;
    longitude?: number;
  }) {
    const entry = this.repo.create(data);
    return await this.repo.save(entry);
  }

  // 2. show all
  async findAll() {
    return await this.repo.find({ 
      relations: ['foodpost'],
      where: {
        rider_id: IsNull(), // Only show unassigned deliveries
      }
    });
  }

  // 3. find specific using any field
  async findByField(field: keyof DeliveryPost, value: any) {
    const where: FindOptionsWhere<DeliveryPost> = { [field]: value };
    return await this.repo.find({ where });
  }
}

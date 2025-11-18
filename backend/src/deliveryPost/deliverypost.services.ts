import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
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
    rider_id: number;
    shipment_date: Date;
  }) {
    const entry = this.repo.create(data);
    return await this.repo.save(entry);
  }

  // 2. show all
  async findAll() {
    return await this.repo.find({ relations: ['foodpost'] });
  }

  // 3. find specific using any field
  async findByField(field: keyof DeliveryPost, value: any) {
    const where: FindOptionsWhere<DeliveryPost> = { [field]: value };
    return await this.repo.find({ where });
  }
}

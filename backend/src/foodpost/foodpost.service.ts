import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull , Repository, Not } from 'typeorm';
import { Foodpost } from '../entities/foodpost.entity';
import { CreateFoodpostDto } from './dto/createFoodpost.dto';
import { UpdateFoodpostDto } from './dto/UpdateFoodpost.dto';

@Injectable()
export class FoodpostService {
  constructor(
    @InjectRepository(Foodpost)
    private readonly foodpostRepo: Repository<Foodpost>,
  ) {}

  // CREATE a new post(make a donation)
  async create(dto: CreateFoodpostDto): Promise<Foodpost> {
    const post = this.foodpostRepo.create(dto);
    return this.foodpostRepo.save(post);
  }

  // GET all posts
  async findAll(): Promise<Foodpost[]> {
    // You commented out relations in the entity, so remove them here for now
    return this.foodpostRepo.find();
  }

  // GET a single post
  async findOne(id: number): Promise<Foodpost> {
    const post = await this.foodpostRepo.findOne({ where: { id } });

    if (!post) throw new NotFoundException(`Foodpost #${id} not found`);
    return post;
  }

  // UPDATE a post (any field)
  async update(id: number, dto: UpdateFoodpostDto): Promise<Foodpost> {
    const post = await this.findOne(id);

    Object.assign(post, dto); // Merge updated fields
    return this.foodpostRepo.save(post);
  }

  // DELETE a post
  async remove(id: number): Promise<Foodpost> {
    const post = await this.findOne(id);
    return this.foodpostRepo.remove(post);
  }

  // FIND foodposts available for riders to pick
  async findAvailableForRider(): Promise<Foodpost[]> {
    return this.foodpostRepo.find({
      where: {
        donorId: Not(IsNull()),
        recipientId: Not(IsNull()),
        riderId: IsNull(), // Rider not assigned yet
      },
    });
  }
  
  // Fetch all foodposts where recipientId is null(accept donations that are unclaimed)
  async findUnclaimedPosts(): Promise<Foodpost[]> {
    return await this.foodpostRepo.find({
      where: { recipientId: IsNull() },
    });
  }
}

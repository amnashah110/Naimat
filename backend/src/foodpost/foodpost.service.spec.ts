import { Test, TestingModule } from '@nestjs/testing';
import { FoodpostService } from './foodpost.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Foodpost } from '../entities/foodpost.entity';
import { Repository } from 'typeorm';

describe('FoodpostService', () => {
  let service: FoodpostService;
  let repo: Repository<Foodpost>;

  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FoodpostService,
        {
          provide: getRepositoryToken(Foodpost),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<FoodpostService>(FoodpostService);
    repo = module.get<Repository<Foodpost>>(getRepositoryToken(Foodpost));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new post', async () => {
    const dto = { donorId: 1, availability: true, category: 'cooked' };
    const savedPost = { id: 1, ...dto };
    mockRepo.create.mockReturnValue(dto);
    mockRepo.save.mockResolvedValue(savedPost);

    const result = await service.create(dto as any);

    expect(mockRepo.create).toHaveBeenCalledWith(dto);
    expect(mockRepo.save).toHaveBeenCalledWith(dto);
    expect(result).toEqual(savedPost);
  });

  it('should return all posts', async () => {
    const posts = [{ id: 1 }, { id: 2 }];
    mockRepo.find.mockResolvedValue(posts);

    const result = await service.findAll();

    expect(result).toEqual(posts);
  });

  it('should throw NotFoundException if post not found', async () => {
    mockRepo.findOne.mockResolvedValue(undefined);

    await expect(service.findOne(1)).rejects.toThrow();
  });
  
});

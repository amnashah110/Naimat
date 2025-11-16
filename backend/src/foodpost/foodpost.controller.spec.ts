import { Test, TestingModule } from '@nestjs/testing';
import { FoodpostController } from './foodpost.controller';

describe('FoodpostController', () => {
  let controller: FoodpostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FoodpostController],
    }).compile();

    controller = module.get<FoodpostController>(FoodpostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

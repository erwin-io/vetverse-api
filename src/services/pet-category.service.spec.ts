import { Test, TestingModule } from '@nestjs/testing';
import { PetCategoryService } from './pet-category.service';

describe('PetCategoryService', () => {
  let service: PetCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PetCategoryService],
    }).compile();

    service = module.get<PetCategoryService>(PetCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

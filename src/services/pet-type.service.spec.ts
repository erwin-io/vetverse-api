import { Test, TestingModule } from '@nestjs/testing';
import { PetTypeService } from './pet-type.service';

describe('PetTypeService', () => {
  let service: PetTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PetTypeService],
    }).compile();

    service = module.get<PetTypeService>(PetTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

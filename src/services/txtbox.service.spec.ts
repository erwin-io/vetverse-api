import { Test, TestingModule } from '@nestjs/testing';
import { TxtboxService } from './txtbox.service';

describe('TxtboxService', () => {
  let service: TxtboxService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TxtboxService],
    }).compile();

    service = module.get<TxtboxService>(TxtboxService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

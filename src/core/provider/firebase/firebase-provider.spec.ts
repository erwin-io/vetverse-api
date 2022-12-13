import { Test, TestingModule } from '@nestjs/testing';
import { FirebaseProvider } from './firebase-provider';

describe('FirebaseProvider', () => {
  let provider: FirebaseProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FirebaseProvider],
    }).compile();

    provider = module.get<FirebaseProvider>(FirebaseProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});

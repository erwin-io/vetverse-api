import { Test, TestingModule } from '@nestjs/testing';
import { GatewayConnectedUsersService } from './gateway-connected-users.service';

describe('GatewayConnectedUsersService', () => {
  let service: GatewayConnectedUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GatewayConnectedUsersService],
    }).compile();

    service = module.get<GatewayConnectedUsersService>(GatewayConnectedUsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

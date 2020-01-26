import { Test, TestingModule } from '@nestjs/testing';
import { EmpireService } from './empire.service';

describe('EmpireService', () => {
  let service: EmpireService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmpireService],
    }).compile();

    service = module.get<EmpireService>(EmpireService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

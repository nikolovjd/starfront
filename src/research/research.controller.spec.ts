import { Test, TestingModule } from '@nestjs/testing';
import { ResearchController } from './research.controller';

describe('Research Controller', () => {
  let controller: ResearchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResearchController],
    }).compile();

    controller = module.get<ResearchController>(ResearchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

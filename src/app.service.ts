import { Injectable } from '@nestjs/common';
import { BuildingService } from './empire/building.service';
import { Buildings } from './types';

@Injectable()
export class AppService {
  constructor(private readonly buildingService: BuildingService) {}
  async getHello() {
    await this.buildingService.buildBuilding(1, Buildings.URBAN_STRUCTURES);

    return 'OK';
  }
}

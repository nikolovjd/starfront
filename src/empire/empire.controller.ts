import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { EmpireService } from './empire.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Empire')
@Controller('empire')
@UseGuards(AuthGuard())
@ApiBearerAuth()
export class EmpireController {
  constructor(private readonly empireService: EmpireService) {}

  @Post()
  async create(@Req() request: any) {
    const empire = this.empireService.create(request.user.id);
    // TODO: make base
    return empire;
  }
}

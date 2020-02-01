import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { RegisterRequestDto } from './request/register-request.dto';
import { LoginRequestDto } from './request/login-request.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req, @Body() data: LoginRequestDto) {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() data: RegisterRequestDto) {
    return this.authService.register(data);
  }
}

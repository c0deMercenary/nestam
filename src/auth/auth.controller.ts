import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authServer: AuthService) {}

  @Post('signup')
  signup() {
    return 'Signing up';
  }

  @Post('signin')
  signin() {
    return 'Signing in';
  }
}

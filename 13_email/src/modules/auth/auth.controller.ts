import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { IsPublic } from "./guards/is-public";
import { RefreshTokenDto } from "./dto/refresh-token.dto";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @IsPublic() // This method is public and does not require authentication
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
  ) {
    return await this.authService.login(loginDto);
  }

  @IsPublic()
  @Post('refresh')
  async refreshTokens(
    @Body() refreshTokenDto: RefreshTokenDto,
  ) {
    return await this.authService.refreshTokens(refreshTokenDto);
  }
}

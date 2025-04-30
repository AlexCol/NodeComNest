import { BadRequestException, Body, Controller, HttpCode, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { IsPublic } from "./guards/is-public";
import { RefreshTokenDto } from "./dto/refresh-token.dto";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @IsPublic() // This method is public and does not require authentication
  @HttpCode(200) // By default, ALL POSTs return 201
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
  ) {
    return await this.authService.login(loginDto);
  }

  @IsPublic()
  @Post('refresh')
  @HttpCode(200) // By default, ALL POSTs return 201
  async refreshTokens(
    @Body() refreshTokenDto: RefreshTokenDto,
  ) {
    return await this.authService.refreshTokens(refreshTokenDto);
  }
}

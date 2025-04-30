import { HttpException, HttpStatus, Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { Repository } from "typeorm";
import { Pessoa } from "src/modules/pessoas/entities/pessoa.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { IHashingService } from "./hashing/hashing.service";
import { NotFoundError } from "rxjs";
import jwtConfig from "./config/jwt.config";
import { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { IsPublic } from "./guards/is-public";
import { RefreshTokenDto } from "./dto/refresh-token.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Pessoa) private readonly pessoaRepository: Repository<Pessoa>, // Injecting the Pessoa repository to interact with the database
    //
    @Inject(jwtConfig.KEY) private readonly jwtConfiguration: ConfigType<typeof jwtConfig>, // Injecting the JWT configuration
    //
    private readonly hashingService: IHashingService, // Injecting the hashing service for password hashing
    //
    private readonly jwtService: JwtService, // Injecting the JWT service for generating and verifying JWTs
  ) {
    //console.log(this.jwtConfiguration); // Logging the JWT secret for debugging purposes
  }

  async login(loginDto: LoginDto): Promise<{}> {
    const pessoa = await this.pessoaRepository.findOne({ where: { email: loginDto.email, ativo: true } }); // Find the user by email
    if (!pessoa) this.authThrowGenericError();

    const isPasswordValid = await this.hashingService.comparePassword(loginDto.password, pessoa.passwordHash); // Check if the password is valid
    if (!isPasswordValid) this.authThrowGenericError();

    const tokens = await this.createTokens(pessoa); // Create JWT tokens for the user

    return {
      message: "Login successful",
      ...tokens,
    };
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const { id } = await this.jwtService.verifyAsync(refreshTokenDto.refreshToken, this.jwtConfiguration); // Verify the refresh token and extract the user ID
      const pessoa = await this.pessoaRepository.findOne({ where: { id, ativo: true } }); // Find the user by ID
      if (!pessoa) {
        throw new NotFoundException('User not found'); // Throw a NotFoundException if the user is not found
      }
      const tokens = await this.createTokens(pessoa); // Create new JWT tokens for the user
      return {
        message: "Refresh token successful",
        ...tokens,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token'); // Throw an Unauthorized exception if the refresh token is invalid
    }
  }

  private async createTokens(pessoa: Pessoa) {
    const payload = { id: pessoa.id, email: pessoa.email, outraPropriedade: "outraPropriedade" }; // Create a payload with the user's ID and email
    const accessToken = await this.signJwtAsync(pessoa.id, this.jwtConfiguration.expiresIn, payload);
    const refreshToken = await this.signJwtAsync(pessoa.id, this.jwtConfiguration.jwtRefreshExpires);
    return {
      accessToken,
      refreshToken
    }
  }

  private async signJwtAsync<T>(id: number, expiresIn: number, payload?: T): Promise<string> {
    return await this.jwtService.signAsync(
      {
        id,
        ...payload
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        expiresIn: expiresIn,
        secret: this.jwtConfiguration.secret,
      }
    );
  }

  private authThrowGenericError() {
    //throw new NotFoundException(); // Throw a NotFoundException if the user is not found
    throw new UnauthorizedException('Invalid credentials'); // Throw an Unauthorized exception if the credentials are invalid
  }
}

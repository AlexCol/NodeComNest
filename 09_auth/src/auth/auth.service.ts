import { HttpException, HttpStatus, Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { Repository } from "typeorm";
import { Pessoa } from "src/modules/pessoas/entities/pessoa.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { IHashingService } from "./hashing/hashing.service";
import { NotFoundError } from "rxjs";
import jwtConfig from "./config/jwt.config";
import { ConfigType } from "@nestjs/config";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Pessoa) private readonly pessoaRepository: Repository<Pessoa>, // Injecting the Pessoa repository to interact with the database
    private readonly hashingService: IHashingService, // Injecting the hashing service for password hashing

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>, // Injecting the JWT configuration
  ) {
    console.log(this.jwtConfiguration); // Logging the JWT secret for debugging purposes
  }

  async login(loginDto: LoginDto): Promise<{}> {
    const pessoa = await this.pessoaRepository.findOne({ where: { email: loginDto.email } }); // Find the user by email
    if (!pessoa) this.authThrowGenericError();

    const isPasswordValid = await this.hashingService.comparePassword(loginDto.password, pessoa.passwordHash); // Check if the password is valid
    if (!isPasswordValid) this.authThrowGenericError();

    return {
      message: "Login successful",
    };
  }

  private authThrowGenericError() {
    //throw new NotFoundException(); // Throw a NotFoundException if the user is not found
    throw new UnauthorizedException('Invalid credentials'); // Throw an Unauthorized exception if the credentials are invalid
  }
}

import { compare } from 'bcryptjs';
import { Repository } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from './dto/login.dto';
import { AuthEntity } from './entity/auth.entity';
import { JwtInterface } from './interface/jwt.interface';
import { JwtPayloadInterface } from './interface/jwt-payload.interface';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import auth from 'src/config/auth';
import UserEntity from '../nonce/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @Inject(auth.KEY)
    private readonly authConfig: ConfigType<typeof auth>,
    private jwtService: JwtService,
  ) {}
  public async loginOrRegister(login: LoginDto): Promise<JwtInterface> {
    const { address, signature } = login;

    const user = await this.userRepository.findOneBy({ address });
    if (!user) {
      const newUser = new UserEntity();
      newUser.address = address;
      const finalizedUser = await this.userRepository.save(newUser);
      if (!finalizedUser) throw new Error('User creation failed');
    }

    const auth = await this.authRepository.findOneBy({ address, signature });
    if (auth) throw new Error('Signature is already used');
    const newAuth = new AuthEntity();
    newAuth.address = address;
    newAuth.signature = signature;

    return this.createToken(await this.authRepository.save(newAuth));
  }
  public createToken(auth: AuthEntity): JwtInterface {
    const { tokenExpiry } = this.authConfig;

    const jwtUser: JwtPayloadInterface = {
      id: auth.id,
      address: auth.address,
      signature: auth.signature,
    };

    return {
      token: {
        accessToken: this.jwtService.sign(jwtUser),
        expiresIn: tokenExpiry,
      },
    };
  }
  async getUser(id: number): Promise<AuthEntity> {
    return await this.authRepository.findOneBy({
      id,
    });
  }
}

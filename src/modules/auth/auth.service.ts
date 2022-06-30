import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddressDTO } from './dto/Address.dto';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import { JWTPayload, JWTResponse } from './jwt-payload';
import { AuthDTO } from './dto/Auth.dto';
import * as ethUtil from 'ethereumjs-util';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(addressDTO: AddressDTO): Promise<User | JWTResponse> {
    const { publicAddress } = addressDTO;
    const user = await this.findUser(publicAddress);
    if (user) {
      // Save nonce
      await this.repository.update(user.id, {
        nonce: user.nonce + 1,
      });
      return this.getToken(user);
    }
    let newUser = new User();
    newUser.publicAddress = addressDTO.publicAddress;
    newUser.nonce = 1;
    return await newUser.save();
  }

  async sign(authDTO: AuthDTO) {
    const { publicAddress, signature } = authDTO;
    const user = await this.findUser(publicAddress);
    if (!user) {
      throw new NotFoundException('User not registered!');
    }
    const nonceBuffer = ethUtil.toBuffer(
      ethUtil.fromUtf8(user.nonce.toString()),
    );
    const nonceHash = ethUtil.hashPersonalMessage(nonceBuffer);

    let address: string;
    try {
      const { v, r, s } = ethUtil.fromRpcSig(signature);
      address = ethUtil.bufferToHex(
        ethUtil.pubToAddress(ethUtil.ecrecover(nonceHash, v, r, s)),
      );
    } catch (e) {
      throw new NotAcceptableException('Invalid proof');
    }

    if (address.toLocaleLowerCase() !== publicAddress.toLocaleLowerCase()) {
      throw new NotAcceptableException('Invalid proof');
    }

    return this.getToken(user);
  }

  async getMe(address: string): Promise<User> {
    const user = await this.findUser(address);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  private async findUser(publicAddress: string): Promise<User> {
    const user = this.repository.findOneBy({ publicAddress });
    return user;
  }

  private async getToken(user: User): Promise<JWTResponse> {
    const payload: JWTPayload = {
      address: user.publicAddress,
      nonce: user.nonce,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}

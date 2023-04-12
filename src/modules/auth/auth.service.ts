import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddressDTO } from './dto/Address.dto';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import { JWTPayload, JWTResponse } from './jwt-payload';
import { AuthDTO } from './dto/Auth.dto';
import { verifyMessage } from 'ethers/lib/utils';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async getNonce(addressDTO: AddressDTO): Promise<User> {
    const { publicAddress } = addressDTO;
    const user = await this.findUser(publicAddress);
    if (user) {
      return user;
    }
    let newUser = new User();
    newUser.publicAddress = addressDTO.publicAddress;
    newUser.nonce = 1;
    return await newUser.save();
  }

  async login(authDTO: AuthDTO) {
    const { publicAddress, signature } = authDTO;
    const user = await this.findUser(publicAddress);
    if (!user) {
      throw new NotFoundException('User not registered!');
    }
    const address = verifyMessage(`${user.nonce}`, signature);
    if (address.toLocaleLowerCase() !== publicAddress.toLocaleLowerCase()) {
      throw new NotFoundException('Invalid proof');
    }
    await this.repository.update(user.id, {
      nonce: user.nonce + 1,
    });
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
    if (!publicAddress) {
      return;
    }
    const user = await this.repository.findOneBy({ publicAddress });
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

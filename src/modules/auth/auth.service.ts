import { Repository } from 'typeorm';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { AddressDTO } from './dto/Address.dto';
import { User } from './user.entity';
import { JWTPayload, JWTResponse } from './jwt-payload';
import { AuthDTO } from './dto/Auth.dto';
import { verifyMessage } from 'ethers/lib/utils';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  async getMessage(addressDTO: AddressDTO): Promise<{ message: string }> {
    const { publicAddress } = addressDTO;
    let user = await this.findUser(publicAddress);
    if (!user) {
      let user = new User();
      user.publicAddress = addressDTO.publicAddress;
      user.nonce = 1;
      user = await user.save();
    }

    return {
      message: this.getMessageSign(user),
    }
  }

  async login(authDTO: AuthDTO) {
    const { publicAddress, signature } = authDTO;
    const user = await this.findUser(publicAddress);
    if (!user) {
      throw new NotFoundException('User not registered!');
    }
    const address = verifyMessage(this.getMessageSign(user), signature);
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

  private getMessageSign(user: User): string {
    return this.configService.get('auth.message')
      .replaceAll('{domain}', 'localhost:3000')
      .replaceAll('{from}', user.publicAddress)
      .replaceAll('{nonce}', user.nonce.toString())
      .replaceAll('{issuedAt}', new Date(user.updatedAt).toISOString());
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

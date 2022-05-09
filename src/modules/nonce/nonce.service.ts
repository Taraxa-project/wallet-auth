import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import randomNumber from 'random-number-csprng';
import { Repository } from 'typeorm/repository/Repository';
import UserEntity from './entities/user.entity';
import UserNonceEntity from './entities/userNonce.entity';

@Injectable()
export default class NonceService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserNonceEntity)
    private readonly userNonceRepository: Repository<UserNonceEntity>,
  ) {}

  public async registerUser(user: UserEntity): Promise<UserEntity> {
    return await this.userRepository.save(user);
  }

  public async getNonce(account: string): Promise<UserNonceEntity> {
    const user = await this.userRepository.findOneBy({ address: account });
    if (!user) throw new Error('User not found');
    let exists = true;
    let nonceGenerated = '-1';
    let newNonce: UserNonceEntity;
    while (exists) {
      nonceGenerated = `0x${(await randomNumber(1, 1000000)).toString(16)}`;
      const nonce = await this.userNonceRepository.findOneBy({
        id: user.id,
        nonce: nonceGenerated,
      });
      if (!nonce) {
        const newNonceTemp = new UserNonceEntity();
        newNonceTemp.id = user.id;
        newNonceTemp.nonce = nonceGenerated;
        newNonce = await this.userNonceRepository.save(newNonceTemp);
        exists = false;
      }
    }

    return newNonce;
  }
}

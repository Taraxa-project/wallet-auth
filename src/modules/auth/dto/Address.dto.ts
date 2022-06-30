import { IsEthereumAddress, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddressDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsEthereumAddress()
  publicAddress: string;
}

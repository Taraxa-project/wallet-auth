import { IsEthereumAddress, IsNotEmpty, IsHexadecimal } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsEthereumAddress()
  publicAddress: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsHexadecimal()
  signature: string;
}

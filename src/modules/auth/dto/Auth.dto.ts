import { IsEthereumAddress, IsNotEmpty, IsHexadecimal } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { StartsWith } from '../../utils/validators/StartsWith';
import { IsHexLen } from '../../utils/validators/IsHexLen';

export class AuthDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsEthereumAddress()
  publicAddress: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsHexadecimal()
  @StartsWith('0x')
  @IsHexLen(130)
  signature: string;
}

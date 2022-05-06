import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly address: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly signature: string;
}

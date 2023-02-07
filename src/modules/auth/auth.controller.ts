import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AddressDTO } from './dto/Address.dto';
import { AuthDTO } from './dto/Auth.dto';
import { GetAddress } from './get-address.decorator';
import { JWTResponse } from './jwt-payload';
import { User } from './user.entity';

@ApiTags('auth')
@Controller('/auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Get()
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Returns new user or token',
  })
  public getNonce(
    @Query(ValidationPipe) addressDTO: AddressDTO,
  ): Promise<User> {
    return this.service.getNonce(addressDTO);
  }

  @Post('login')
  @ApiResponse({
    status: HttpStatus.OK,
    type: User,
    description: 'Returns a new created pool',
  })
  public async login(@Body() authDTO: AuthDTO): Promise<JWTResponse> {
    return await this.service.login(authDTO);
  }

  @Get('me')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({
    status: HttpStatus.OK,
    type: User,
    description: `Returns current user`,
  })
  public async getMe(@GetAddress() address: string): Promise<User> {
    return await this.service.getMe(address);
  }
}

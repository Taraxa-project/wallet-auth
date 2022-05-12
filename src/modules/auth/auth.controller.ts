import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiTags,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import NonceService from '../nonce/nonce.service';

@ApiTags('auth')
@Controller('auth')
export default class AuthController {
  constructor(
    private readonly nonceService: NonceService,
    private readonly authService: AuthService,
  ) {}

  @ApiCreatedResponse({
    description: 'The nonce has been successfully created',
  })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'Nonce generation successful',
  })
  @Get('/nonce/:id')
  async getNonce(@Param('id') account: string): Promise<string> {
    return (await this.nonceService.getNonce(account)).nonce;
  }

  @ApiCreatedResponse({
    description: 'Login/Registration succeeded',
  })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
  })
  @HttpCode(HttpStatus.OK)
  @Post()
  async loginOrRegister(@Body() loginDto: LoginDto) {
    return await this.authService.loginOrRegister(loginDto);
  }

  @ApiCreatedResponse({
    description: 'Address Authorization succeeded',
  })
  @ApiBadRequestResponse({ description: 'Invalid address' })
  @ApiResponse({
    status: 200,
    description: 'Authorization successful',
  })
  @HttpCode(HttpStatus.OK)
  @Post('/:address')
  async authorizeAddress(@Param('address') address: string): Promise<boolean> {
    return await this.authService.authorizeAddress(address);
  }

  @ApiBadRequestResponse({ description: 'Unauthorized address' })
  @ApiResponse({
    status: 200,
    description: 'Address authorized',
  })
  @HttpCode(HttpStatus.OK)
  @Get('/:address')
  async getAddress(@Param('address') address: string): Promise<string> {
    return (await this.authService.getUserByAddress(address)).address;
  }
}

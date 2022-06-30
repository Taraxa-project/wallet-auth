import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  secret: process.env.AUTH_SECRET || 'secret',
  tokenExpiry: process.env.JWT_EXPIRY_TIME || 60 * 60 * 24 * 30,
}));

import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  secret: process.env.AUTH_SECRET || 'secret',
  tokenExpiry: process.env.JWT_EXPIRY_TIME || '30 days',
  message: `{domain} wants you to sign in with your Ethereum account:
{from}

I accept the MetaMask Terms of Service: https://community.metamask.io/tos

URI: https://{domain}
Version: 1
Nonce: {nonce}
Issued At: {issuedAt}`,
}));

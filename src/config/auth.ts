import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  secret: process.env.AUTH_SECRET || 'secret',
  tokenExpiry: process.env.JWT_EXPIRY_TIME || '30 days',
  domain: process.env.AUTH_DOMAIN || 'wallet.taraxa.io',
  tos: process.env.AUTH_TOS_URL || 'https://taraxa.io/privacy',
  chainId: process.env.AUTH_CHAIN_ID || 841,
  version: process.env.AUTH_VERSION || 1,
  message: `{domain} wants you to sign in with your Ethereum account:
{from}

I accept the {domain} Terms of Service: {tos}

URI: https://{domain}
Version: {version}
Chain ID: {chainId}
Nonce: {nonce}
Issued At: {issuedAt}`}));
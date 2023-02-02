import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import auth from 'src/config/auth';
import { JWTPayload } from './jwt-payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(auth.KEY) authConfig: ConfigType<typeof auth>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: authConfig.secret,
    });
  }

  async validate(payload: JWTPayload) {
    return { address: payload.address };
  }
}

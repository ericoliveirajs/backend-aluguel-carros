// src/auth/strategies/jwt.strategy.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      // 1. Diz ao Passport como extrair o Token (do Header 'Authorization')
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // 2. Usa o MESMO segredo que usamos para criar o token (do .env)
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  /**
   * Este método é chamado pelo Passport DEPOIS de validar o token.
   * O 'payload' é o que colocamos dentro do token (sub: user._id, email: user.email)
   */
  async validate(payload: { sub: string; email: string }) {
    // 3. Pega o ID do payload e busca o usuário no banco
    const user = await this.usersService.findById(payload.sub); // <-- Vamos criar este método

    if (!user) {
      throw new UnauthorizedException('Token inválido');
    }

    // 4. O objeto 'user' que retornamos aqui será "injetado"
    // em qualquer rota protegida, dentro do `req.user`
    const { password, ...result } = user.toObject();
    return result;
  }
}
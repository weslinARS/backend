import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException('No se ha enviado el token');
    try {
      const payload = await this.jwtService.verifyAsync(token);
      request['IdUsuario'] = payload['idUsuario'];
      //agregar el rol
      request['rol'] = payload['rol'];
      //agregar el id segun rol
      request['idUsRol'] = payload['idSegunRol'];
    } catch (error) {
      throw new UnauthorizedException('Token invalido');
    }
    return true;
  }
  private extractTokenFromHeader(request: Request): string {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

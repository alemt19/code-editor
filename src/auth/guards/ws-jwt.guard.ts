import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsJwtGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const client = context.switchToWs().getClient();

    // Extraemos el token preferiblemente desde handshake.auth.token (recomendado)
    // Si no está, intentamos desde handshake.headers.authorization
    let token = client.handshake.auth?.token || client.handshake.headers?.authorization || '';

    // Aseguramos que el token tenga el prefijo 'Bearer '
    if (token && !token.startsWith('Bearer ')) {
      token = `Bearer ${token}`;
    }

    // Retornamos un objeto que simula una request HTTP con el header authorization
    return {
      headers: {
        authorization: token,
      },
    };
  }

  handleRequest(err, user, info, context) {
    if (err || !user) {
      throw err || new WsException('Unauthorized');
    }

    const client = context.switchToWs().getClient();
    // Adjuntamos la instancia del usuario validado al cliente para usar en handlers y decoradores
    client.user = user;

    return user;
  }
}

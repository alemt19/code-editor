import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

type Protocol = 'http' | 'ws';

export const GetUser = createParamDecorator(
  (protocol: Protocol = 'http', ctx: ExecutionContext) => {
    let user: User;

    if (protocol === 'ws') {
      const client = ctx.switchToWs().getClient();
      user = client.user;
      if (!user) {
        throw new InternalServerErrorException('User not found (WebSocket client)');
      }
    } else {
      const req = ctx.switchToHttp().getRequest();
      user = req.user;
      if (!user) {
        throw new InternalServerErrorException('User not found (HTTP request)');
      }
    }
    return user;
  },
);

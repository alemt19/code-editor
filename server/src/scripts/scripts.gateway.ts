import { WebSocketGateway, SubscribeMessage, WebSocketServer, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { ScriptsService } from './scripts.service';
import { UpdateScriptContentDto } from './dto/update-script-content.dto';
import { Server, Socket } from 'socket.io';
import { DockerService } from './docker.service';
import { UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { RunScriptDto } from './dto/run-script.dto';
import { WsJwtGuard } from 'src/auth/guards/ws-jwt.guard';

@WebSocketGateway({ cors: true })
export class ScriptsGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly scriptsService: ScriptsService,
    private readonly dockerService: DockerService,
  ) {}

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('saveScript')
  async handleSaveScript(
    @GetUser('ws') user: User,
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: UpdateScriptContentDto,
  ) {
    const script = await this.scriptsService.updateContent(payload, user);
    client.emit('scriptSaved', script);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('runScript')
  async handleRunScript(
    @GetUser('ws') user: User,
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: RunScriptDto,
  ) {
    const script = await this.scriptsService.findOne(payload.id, user);
    if (!script) {
      client.emit('scriptError', { message: 'Script no encontrado' });
      return;
    }
    this.dockerService.executeScript(
      payload.language,
      script.content,
      (output) => {
        client.emit('scriptOutput', { type: 'stdout', data: output });
      },
      (error) => {
        client.emit('scriptOutput', { type: 'stderr', data: error });
      },
    );
  }

}

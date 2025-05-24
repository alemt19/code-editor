import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { ScriptsService } from './scripts.service';
import { CreateScriptDto } from './dto/create-script.dto';
import { UpdateScriptDto } from './dto/update-script.dto';
import { Server, Socket } from 'socket.io';
import { DockerService } from './docker.service';

@WebSocketGateway({ cors: true })
export class ScriptsGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly scriptsService: ScriptsService,
    private readonly dockerService: DockerService,
  ) {}

  @SubscribeMessage('saveScript')
  async handleSaveScript(client: Socket, payload: { userId: string; language: string; content: string }) {
    const script = await this.scriptsService.saveOrUpdateScript(payload.userId, payload.language, payload.content);
    client.emit('scriptSaved', script);
  }

  @SubscribeMessage('runScript')
  async handleRunScript(client: Socket, payload: { userId: string; language: 'python' | 'javascript' }) {
    const script = await this.scriptsService.getScript(payload.userId, payload.language);
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

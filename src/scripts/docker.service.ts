import { Injectable } from '@nestjs/common';
import * as Docker from 'dockerode';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DockerService {
  private docker = new Docker({ socketPath: '/var/run/docker.sock' });

  async executeScript(
    language: 'python' | 'javascript',
    code: string,
    onOutput: (data: string) => void,
    onError: (error: string) => void,
  ) {
    let container: Docker.Container | null = null;
    try {
      // 1. Directorio temporal dentro del contenedor NestJS (mapeado al volumen)
      const containerTempDir = '/temp-vol';
      fs.mkdirSync(containerTempDir, { recursive: true });
      const filename = `script_${Date.now()}.${language === 'python' ? 'py' : 'js'}`;
      const scriptPath = path.join(containerTempDir, filename);
      
      fs.writeFileSync(scriptPath, code);

      // 2. Crear contenedor de ejecución montando el volumen completo
      container = await this.docker.createContainer({
        Image: language === 'python' ? 'python:3.12-slim-bookworm' : 'node:lts-alpine',
        Cmd: [
          language === 'python' ? 'python' : 'node',
          `/temp-vol/${filename}`
        ],
        HostConfig: {
          // Monta el volumen completo en /temp-vol
          Binds: [
            'code-editor_temp-vol:/temp-vol:ro'
          ],
          Memory: 256 * 1024 * 1024,
          ReadonlyRootfs: true,
          NetworkMode: 'none',
          SecurityOpt: ['no-new-privileges'],
        },
        User: '1000:1000'
      });

      await container.start();

      const stream = await container.logs({
        follow: true,
        stdout: true,
        stderr: true,
      });

      stream.on('data', (chunk: Buffer) => onOutput(chunk.toString()));
      stream.on('error', (err) => onError(err.toString()));
      stream.on('end', async () => {
        try {
          await container?.remove();
          if (fs.existsSync(scriptPath)) {
            fs.unlinkSync(scriptPath);
          }
        } catch (err) {
          console.error('Error en limpieza:', err);
        }
      });
    } catch (error) {
      console.error('Error al ejecutar script:', error);
      onError(`Error: ${error instanceof Error ? error.message : 'Desconocido'}`);
      try {
        await container?.remove();
      } catch (err) {
        console.error('Error eliminando contenedor:', err);
      }
    }
  }
}

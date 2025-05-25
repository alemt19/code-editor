import { Injectable } from '@nestjs/common';
import * as Docker from 'dockerode';
import * as fs from 'fs';
import * as path from 'path';

interface LanguageConfig {
  image: string;
  cmd: (filename: string) => string[];
  extension: string;
}

@Injectable()
export class DockerService {
  private docker = new Docker();

  private languageConfig: Record<string, LanguageConfig> = {
    python: {
      image: 'python:3.12-slim-bookworm',
      cmd: (filename) => ['python', `/temp-vol/${filename}`],
      extension: 'py',
    },
    javascript: {
      image: 'node:lts-alpine',
      cmd: (filename) => ['node', `/temp-vol/${filename}`],
      extension: 'js',
    },
    ruby: {
      image: 'ruby:3.2-alpine',
      cmd: (filename) => ['ruby', `/temp-vol/${filename}`],
      extension: 'rb',
    },
    php: {
      image: 'php:8.2-cli-alpine',
      cmd: (filename) => ['php', `/temp-vol/${filename}`],
      extension: 'php',
    },
    perl: {
      image: 'perl:slim',
      cmd: (filename) => ['perl', `/temp-vol/${filename}`],
      extension: 'pl',
    },
  };

  async executeScript(
    language: string,
    code: string,
    onOutput: (data: string) => void,
    onError: (error: string) => void,
  ) {
    const config = this.languageConfig[language];
    if (!config) {
      onError(`Language "${language}" is not supported.`);
      return;
    }

    let container: Docker.Container | null = null;
    try {
      const containerTempDir = '/temp-vol';
      fs.mkdirSync(containerTempDir, { recursive: true });

      const filename = `script_${Date.now()}.${config.extension}`;
      const scriptPath = path.join(containerTempDir, filename);
      fs.writeFileSync(scriptPath, code);

      container = await this.docker.createContainer({
        Image: config.image,
        Cmd: config.cmd(filename),
        HostConfig: {
          Binds: ['code-editor_temp-vol:/temp-vol:ro'],
          Memory: 256 * 1024 * 1024, // 256 MB
          NanoCpus: 5e8, // 0.5 CPU
          ReadonlyRootfs: true,
          NetworkMode: 'none',
          SecurityOpt: ['no-new-privileges'],
        },
        User: '1000:1000',
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
          console.error('Error cleaning up:', err);
        }
      });
    } catch (error) {
      console.error('Error executing script:', error);
      onError(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      try {
        await container?.remove();
      } catch (err) {
        console.error('Error removing container:', err);
      }
    }
  }
}

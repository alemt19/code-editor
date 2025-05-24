import { Module } from '@nestjs/common';
import { ScriptsService } from './scripts.service';
import { ScriptsGateway } from './scripts.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Script } from './entities/script.entity';
import { DockerService } from './docker.service';

@Module({
  providers: [ScriptsGateway, ScriptsService, DockerService],
  imports: [
    TypeOrmModule.forFeature([User, Script]),
  ],
})
export class ScriptsModule {}

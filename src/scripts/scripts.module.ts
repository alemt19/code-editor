import { Module } from '@nestjs/common';
import { ScriptsService } from './scripts.service';
import { ScriptsGateway } from './scripts.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Script } from './entities/script.entity';
import { DockerService } from './docker.service';
import { ScriptsController } from './scripts.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [ScriptsGateway, ScriptsService, DockerService],
  imports: [
    TypeOrmModule.forFeature([User, Script]),
    AuthModule,
  ],
  controllers: [ScriptsController],
})
export class ScriptsModule {}

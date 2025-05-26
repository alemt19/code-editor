import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScriptsModule } from './scripts/scripts.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,  
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'postgres',
      database: process.env.DB_NAME || 'editor',
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV === 'development' ? true : false, // Solo para desarrollo
    }),
    ScriptsModule,
    UsersModule,
    AuthModule,
],
  controllers: [],
  providers: [],
})
export class AppModule {}

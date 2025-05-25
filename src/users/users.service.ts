import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const saltRounds: number = Number(this.configService.get('SALT_ROUNDS') ?? '10');
      const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);
      const user = this.userRepository.create({
        email: createUserDto.email,
        password: hashedPassword,
      });
      
      await this.userRepository.save(user)

      const userPayload: JwtPayload = {
        id: user.id,
        email: user.email,
      }; 

      return {
        ...userPayload,
        token: await this.authService.getJwtToken(userPayload),
      };
    } catch (err) {
      console.error('Error creating user', err);
      throw new InternalServerErrorException('Error creating user');
    }
  }
}

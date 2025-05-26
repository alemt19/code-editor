import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  
  constructor(
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
      private readonly jwtService: JwtService,
  ) {}

  async login(loginUserDto: LoginUserDto) {
    try {
      const { email, password } = loginUserDto;

      const user = await this.userRepository.findOneBy({ email });

      if (!user || !await bcrypt.compare(password, user.password)) {
        throw new UnauthorizedException('Credentials are not valid.')
      }

      const userPayload: JwtPayload = {
        id: user.id,
        email: user.email,
      }; 

      return {
        ...userPayload,
        token: await this.getJwtToken(userPayload),
      };
    } catch (err) {
      console.error('Error while login', err);
      throw new InternalServerErrorException('Error while login');
    }
  }
  
  async getJwtToken(payload: JwtPayload) {
    const token = await this.jwtService.signAsync( payload );
    return token;
  }
}

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateScriptDto } from './dto/create-script.dto';
import { UpdateScriptDto } from './dto/update-script.dto';
import { Script } from './entities/script.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ScriptsService {

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Script)
    private readonly scriptsRepository: Repository<Script>,
  ) {}

  async saveOrUpdateScript(userId: string, language: string, content: string) {
    let script = await this.scriptsRepository.findOne({ where: { user: { id: userId }, language } });
    if (script) {
      script.content = content;
      script.updatedAt = new Date();
      return this.scriptsRepository.save(script);
    } else {
      const user = await this.usersRepository.findOne({ where: { id: userId } });
      if (!user) {
        const newUser = this.usersRepository.create({ id: userId });
        await this.usersRepository.save(newUser);
        script = this.scriptsRepository.create({ language, content, user: newUser });
        return this.scriptsRepository.save(script);
      }
      script = this.scriptsRepository.create({ language, content, user });
      return this.scriptsRepository.save(script);
    }
  }

  async getScript(userId: string, language: string) {
    const script = await this.scriptsRepository.findOne({
      where: { user: { id: userId }, language },
      relations: ['user'],
    })
    if (!script) {
      throw new InternalServerErrorException('Script not found');
    }
    return script;
  }
}

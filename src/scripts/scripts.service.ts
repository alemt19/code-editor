import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateScriptDto } from './dto/create-script.dto';
import { UpdateScriptContentDto } from './dto/update-script-content.dto';
import { Script } from './entities/script.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ScriptsService {

  constructor(
    @InjectRepository(Script)
    private readonly scriptsRepository: Repository<Script>,
  ) {}

  async updateContent(payload: UpdateScriptContentDto, user: User) {
    let script = await this.scriptsRepository.findOneBy({
        id: payload.id,
        user: { id: user.id },
      });

    if (!script) throw new NotFoundException('Script not found');

    script.content = payload.content;
    script.updatedAt = new Date();
    return this.scriptsRepository.save(script);
  }

  async findOne(id: string, user: User) {
    const script = await this.scriptsRepository.findOneBy({
      id,
      user: { id: user.id },
    });
    if (!script) {
      throw new InternalServerErrorException('Script not found');
    }
    return script;
  }

  async findAllByUser(user: User) {
    try {
      const scripts = await this.scriptsRepository.find({
        where: { user },
        select: {
          id: true,
          name: true,
          language: true,
          updatedAt: true,
        }
      });
      return scripts;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching scripts');
    }
  }

  async create(createScriptDto: CreateScriptDto, user: User) {
    try {
      const script = this.scriptsRepository.create({
        ...createScriptDto,
        user
        });
      return this.scriptsRepository.save(script);
    } catch (error) {
      throw new InternalServerErrorException('Error creating script');
    }
  }

  async delete(id: string, user: User) {
    try {
      const script = await this.scriptsRepository.findOneBy({
        id,
        user: { id: user.id },
      });
      if (!script) {
        throw new InternalServerErrorException('Script not found');
      }
      await this.scriptsRepository.delete(id);
      return { message: 'Script deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Error deleting script');
    }
  }
}

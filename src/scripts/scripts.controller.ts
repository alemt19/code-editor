import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ScriptsService } from './scripts.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/users/entities/user.entity';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { CreateScriptDto } from './dto/create-script.dto';

@Controller('scripts')
export class ScriptsController {
    constructor(
        private readonly scriptsService: ScriptsService,
    ) {}

    @UseGuards(AuthGuard())
    @Get(':id')
    async findOne(@Param('id') id: string, @GetUser() user: User) {
        return this.scriptsService.findOne(id, user);
    }

    @UseGuards(AuthGuard())
    @Get()
    async findAllByUser(@GetUser() user: User) {
        return this.scriptsService.findAllByUser(user);
    }

    @UseGuards(AuthGuard())
    @Post()
    async create(@Body() createScriptDto: CreateScriptDto, @GetUser() user: User) {
        return this.scriptsService.create(createScriptDto, user);
    }

    @UseGuards(AuthGuard())
    @Delete(':id')
    async delete(@Param() id: string, @GetUser() user: User) {
        return this.scriptsService.delete(id, user);
    }
}

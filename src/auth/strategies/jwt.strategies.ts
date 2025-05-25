import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { User } from "src/users/entities/user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        configService: ConfigService
    ) {
        const jwtSecret = configService.get('JWT_SECRET');

        super({
            secretOrKey: jwtSecret,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }

    async validate(payload: JwtPayload): Promise<User> {
        const { id, email } = payload;

        const user = await this.userRepository.findOne({
            where: {
                id,
                email,
            }
        });

        if (!user) throw new UnauthorizedException('');

        return user;
    }

}
import { Contains, IsEmail, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateUserDto {
    @IsEmail()
    @IsOptional()
    email: string; 

    @IsString()
    @MinLength(3)
    @MaxLength(20)
    @Contains('[a-zA-Z]')
    @IsOptional()
    name: string;

    @IsString()
    @MinLength(3)
    @MaxLength(20)
    @IsOptional()
    username: string;

    @IsString()
    @MinLength(8)
    @IsOptional()
    password: string;
}

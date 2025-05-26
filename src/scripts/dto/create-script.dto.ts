import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateScriptDto {
    @IsString()
    @MinLength(1)
    @MaxLength(30)
    name: string;

    @IsString()
    @Matches(/^(python|javascript|php|perl|ruby)$/)
    language: string;
}

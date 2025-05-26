import { IsUUID, Matches } from "class-validator";

export class RunScriptDto {
    @IsUUID()
    id: string;

    @Matches(/^(python|javascript|php|perl|ruby)$/)
    language: string;
}
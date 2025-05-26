import { IsString, IsUUID, MaxLength } from "class-validator";

export class UpdateScriptContentDto {
    @IsUUID()
    id: string;

    @IsString()
    @MaxLength(1000)
    content: string;
}

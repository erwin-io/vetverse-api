import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreatePetTypeDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
}

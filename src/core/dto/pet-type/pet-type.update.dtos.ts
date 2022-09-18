import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class PetTypeDto {
  @ApiProperty()
  @IsNotEmpty()
  petTypeId: string;

  @ApiProperty()
  @IsNotEmpty()
  name: string;
}

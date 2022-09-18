import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class PetCategoryDto {
  @ApiProperty()
  @IsNotEmpty()
  petCategoryId: string;

  @ApiProperty()
  @IsNotEmpty()
  petTypeId: string;

  @ApiProperty()
  @IsNotEmpty()
  name: string;
}

import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class RoleAccessDto {
  @ApiProperty()
  @IsNotEmpty()
  roleId: string;

  @ApiProperty()
  @IsNotEmpty()
  access: string;
}

import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsBooleanString,
  IsNotEmpty,
  IsOptional,
} from "class-validator";
import { ToBoolean } from "src/common/helper/env.helper";
import { Transform, Type } from "class-transformer";

export class CreateServiceTypeDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  price: number;

  @ApiProperty()
  @IsNotEmpty()
  durationInHours: number;

  @ApiProperty({ required: false, default: true })
  @IsBoolean()
  @Transform(
    (value: any) =>
      value === "true" || value === true || value === 1 || value === "1"
  )
  @ToBoolean()
  isMedicalServiceType = false;
}

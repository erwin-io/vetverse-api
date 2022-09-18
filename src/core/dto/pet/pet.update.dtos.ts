import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsDateString, IsNotEmpty, IsNumber } from "class-validator";
import * as moment from "moment";

export class PetDto {
  @ApiProperty()
  @IsNotEmpty()
  petId: string;

  @ApiProperty()
  @IsNotEmpty()
  petCategoryId: string;

  @ApiProperty({
    type: Date,
    default: moment().format("YYYY-MM-DD"),
  })
  @IsDateString()
  @Type(() => Date)
  @Transform((value) => moment(new Date(value.value)).format("YYYY-MM-DD"))
  @IsNotEmpty()
  birthDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: Number,
    default: 0.0,
  })
  @IsNotEmpty()
  @IsNumber()
  weight: number;

  @ApiProperty()
  @IsNotEmpty()
  genderId: string;
}

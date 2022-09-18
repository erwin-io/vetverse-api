import { ApiProperty } from "@nestjs/swagger";
import { Type, Transform } from "class-transformer";
import { IsDateString, IsNotEmpty, IsNumber } from "class-validator";
import * as moment from "moment";

export class CreatePetDto {
  @ApiProperty()
  @IsNotEmpty()
  petCategoryId: string;

  @ApiProperty()
  @IsNotEmpty()
  clientId: string;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: Date,
    default: moment().format("YYYY-MM-DD"),
  })
  @IsDateString()
  @Type(() => Date)
  @Transform((value) => moment(new Date(value.value)).format("YYYY-MM-DD"))
  @IsNotEmpty()
  birthDate: Date;

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

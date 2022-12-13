import { ApiProperty } from "@nestjs/swagger";
import { Type, Transform } from "class-transformer";
import { IsDateString, IsNotEmpty, IsString } from "class-validator";
import * as moment from "moment";

export class CreatePaymentDto {
  @ApiProperty({
    type: Date,
    default: moment().format("YYYY-MM-DD"),
  })
  @IsDateString()
  @Type(() => Date)
  @Transform((value) => moment(new Date(value.value)).format("YYYY-MM-DD"))
  @IsNotEmpty()
  paymentDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  paymentTypeId: string;

  @ApiProperty()
  @IsNotEmpty()
  appointmentId: string;

  @ApiProperty()
  @IsString()
  referenceNo: string;
}

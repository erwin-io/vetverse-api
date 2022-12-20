import { ApiProperty } from "@nestjs/swagger";
import { Type, Transform } from "class-transformer";
import { IsDateString, IsNotEmpty } from "class-validator";
import * as moment from "moment";

export class PaymentDto {
  @ApiProperty()
  @IsNotEmpty()
  paymentId: string;
}

export class UpdateReferenceNumberDto extends PaymentDto {
  @ApiProperty()
  @IsNotEmpty()
  referenceNo: string;
}

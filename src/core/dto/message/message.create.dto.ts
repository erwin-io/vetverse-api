import { ApiProperty } from "@nestjs/swagger";
import { Type, Transform } from "class-transformer";
import { IsDateString, IsNotEmpty, IsNumber } from "class-validator";
import * as moment from "moment";

export class CreateMessageDto {
  @ApiProperty()
  @IsNotEmpty()
  message: string;

  @ApiProperty()
  @IsNotEmpty()
  isClient: boolean;

  @ApiProperty()
  @IsNotEmpty()
  fromUserId: string;

  @ApiProperty()
  @IsNotEmpty()
  toUserId: string;

  @ApiProperty()
  @IsNotEmpty()
  appointmentId: string;
}

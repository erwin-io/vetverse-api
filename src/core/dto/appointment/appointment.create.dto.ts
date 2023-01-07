import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  IsDate,
  IsDateString,
  IsMilitaryTime,
  isMilitaryTime,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import * as moment from "moment";
import { Timestamp } from "typeorm";

export class CreateAppointmentDto {
  @ApiProperty({
    type: Date,
    default: moment().format("YYYY-MM-DD"),
  })
  @IsDateString()
  @Type(() => Date)
  @Transform((value) => moment(new Date(value.value)).format("YYYY-MM-DD"))
  @IsNotEmpty()
  appointmentDate: Date;

  @ApiProperty({
    default: moment().format("HH:MM"),
  })
  @IsMilitaryTime()
  @IsNotEmpty()
  time: string;

  @ApiProperty()
  @IsNotEmpty()
  veterenarianId: string;

  @ApiProperty()
  @IsNotEmpty()
  serviceTypeId: string;

  @ApiProperty()
  @IsString()
  @Type(() => String)
  comments: string;
}

export class CreatePaidAppointmentDto extends CreateAppointmentDto {
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
}

export class CreateOnsiteAppointmentDto extends CreatePaidAppointmentDto {
  @ApiProperty()
  @IsNotEmpty()
  clientId: string;

  @ApiProperty()
  @IsNotEmpty()
  petId: string;

  @ApiProperty()
  @IsOptional()
  appointmentAttachments: any[];
}

export class CreateWalkInAppointmentDto extends CreatePaidAppointmentDto {
  @ApiProperty()
  @IsNotEmpty()
  clientName: string;

  @ApiProperty()
  @IsNotEmpty()
  petName: string;
}

export class CreateClientAppointmentDto extends CreateAppointmentDto {
  @ApiProperty()
  @IsNotEmpty()
  clientId: string;

  @ApiProperty()
  @IsNotEmpty()
  petId: string;

  @ApiProperty()
  @IsNotEmpty()
  consultaionTypeId: string;

  @ApiProperty()
  @IsOptional()
  appointmentAttachments: any[];
}

export class CreateClientCashlessAppointmentDto extends CreateAppointmentDto {
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
  clientId: string;

  @ApiProperty()
  @IsNotEmpty()
  petId: string;

  @ApiProperty()
  @IsNotEmpty()
  consultaionTypeId: string;

  @ApiProperty()
  @IsOptional()
  appointmentAttachments: any[];
}
import { ApiProperty } from "@nestjs/swagger";
import { Type, Transform } from "class-transformer";
import { IsDateString, IsMilitaryTime, IsNotEmpty } from "class-validator";
import * as moment from "moment";

export class AppointmentDto {
  @ApiProperty()
  @IsNotEmpty()
  appointmentId: string;
}

export class UpdateAppointmentStatusDto extends AppointmentDto {
  @ApiProperty()
  @IsNotEmpty()
  appointmentStatusId: string;
}

export class RescheduleAppointmentDto extends AppointmentDto {
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
}

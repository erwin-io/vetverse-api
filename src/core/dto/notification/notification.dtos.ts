import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class NotificationsDto {
  @ApiProperty()
  @IsNotEmpty()
  notificationId: string;
}

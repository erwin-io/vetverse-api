/* eslint-disable @typescript-eslint/no-inferrable-types */
import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { CustomResponse } from "src/common/helper/customresponse.helpers";
import { JwtAuthGuard } from "src/core/auth/jwt.auth.guard";
import { UpdateDiagnosisAndTreatment } from "src/core/dto/appointment/appointment.update.dtos";
import { NotificationService } from "src/services/notification.service";
import { Notifications } from "src/shared/entities/Notifications";
import { NotificationsDto } from "src/core/dto/notification/notification.dtos";

@ApiTags("notification")
@Controller("notification")
@ApiBearerAuth()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get("getAllByClientIdPage")
  @ApiQuery({ name: "clientId", required: false })
  @ApiQuery({
    name: "page",
    description: "page",
    required: true,
    type: Number,
  })
  @ApiQuery({
    name: "limit",
    description: "limit",
    required: true,
    type: Number,
  })
  //@UseGuards(JwtAuthGuard)
  async getAllByClientIdPage(
    @Query("clientId") clientId: string = "",
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit = 10
  ) {
    const res: CustomResponse = {};
    try {
      page = page <= 0 ? 1 : page;
      limit = limit > 40 ? 40 : limit;
      const result = await this.notificationService.getAllByClientIdPage(
        clientId,
        {
          page,
          limit,
        }
      );
      res.data = result;
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Get("getTotalUnreadByClientId")
  @ApiQuery({ name: "clientId", required: false })
  //@UseGuards(JwtAuthGuard)
  async getTotalUnreadByClientId(@Query("clientId") clientId: string = "") {
    const res: CustomResponse = {};
    try {
      res.data = await this.notificationService.getTotalUnreadByClientId(
        clientId
      );
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("updateReadStatus")
  //@UseGuards(JwtAuthGuard)
  async updateReadStatus(@Body() dto: NotificationsDto) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.notificationService.updateReadStatus(dto);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}

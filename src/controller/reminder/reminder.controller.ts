import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import { CustomResponse } from "src/common/helper/customresponse.helpers";
import { JwtAuthGuard } from "src/core/auth/jwt.auth.guard";
import { CreateReminderDto } from "src/core/dto/reminder/reminder.create.dto";
import { ReminderService } from "src/services/reminder.service";

@ApiTags("reminder")
@Controller("reminder")
export class ReminderController {
  constructor(private readonly reminderService: ReminderService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    const res: CustomResponse = {};
    try {
      res.data = await this.reminderService.findAll();
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Get("geAllReminderByDate")
  @ApiQuery({ name: "filterDate", type: Date, required: false })
  async geAllReminderByDate(
    @Query("filterDate")
    filterDate: Date
  ) {
    const res: CustomResponse = {};
    try {
      res.data = await this.reminderService.geAllReminderByDate(
        filterDate,
        false
      );
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Get(":reminderId")
  @UseGuards(JwtAuthGuard)
  async findOne(@Param("reminderId") reminderId: string) {
    const res: CustomResponse = {};
    try {
      res.data = await this.reminderService.findById(reminderId);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("")
  @UseGuards(JwtAuthGuard)
  async add(@Body() createReminderDto: CreateReminderDto) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.reminderService.add(createReminderDto);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Delete(":reminderId")
  @UseGuards(JwtAuthGuard)
  async delete(@Param("reminderId") reminderId: string) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.reminderService.delete(reminderId);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}

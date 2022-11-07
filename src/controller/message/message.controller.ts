import {
  Controller,
  Get,
  Query,
  UseGuards,
  DefaultValuePipe,
  ParseIntPipe,
  Body,
  Post,
} from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { CustomResponse } from "src/common/helper/customresponse.helpers";
import { JwtAuthGuard } from "src/core/auth/jwt.auth.guard";
import { MessageService } from "src/services/message.service";
import { CreateMessageDto } from "src/core/dto/message/message.create.dto";

@ApiTags("message")
@Controller("message")
@ApiBearerAuth()
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get("findByAppointmentPage")
  @ApiQuery({
    name: "appointmentId",
    description: "Appointment Id",
    required: true,
    type: String,
  })
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
  @UseGuards(JwtAuthGuard)
  async findByAppointmentPage(
    @Query("appointmentId") appointmentId,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit = 10
  ) {
    const res: CustomResponse = {};
    try {
      page = page <= 0 ? 1 : page;
      limit = limit > 40 ? 40 : limit;
      const result = await this.messageService.findByAppointmentPage(
        appointmentId,
        {
          page,
          limit,
        }
      );
      res.data = result;
      res.data.items = res.data.items.map((message) => {
        message.fromUser = this.messageService._sanitizeUser(message.fromUser);
        message.toUser = this.messageService._sanitizeUser(message.toUser);
        return message;
      });
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
  async add(@Body() messageDto: CreateMessageDto) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.messageService.addMessage(messageDto);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}

import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { Messages } from "src/shared/entities/Messages";
import { Repository } from "typeorm";
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from "nestjs-typeorm-paginate";
import { getAge } from "src/common/utils/utils";
import { CreateMessageDto } from "src/core/dto/message/message.create.dto";
import { Clients } from "src/shared/entities/Clients";
import { Gender } from "src/shared/entities/Gender";
import { Users } from "src/shared/entities/Users";
import { Appointment } from "src/shared/entities/Appointment";
import { ChatGateway } from "src/gateway/chat/chat.gateway";
import { GatewayConnectedUsers } from "src/shared/entities/GatewayConnectedUsers";
import { GatewayConnectedUsersService } from "./gateway-connected-users.service";

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Messages)
    private readonly messagesRepo: Repository<Messages>,
    private chatGateway: ChatGateway
  ) {}

  async findByAppointmentPage(
    appointmentId: string,
    options: IPaginationOptions
  ) {
    const queryBuilder = this.messagesRepo.manager
      .createQueryBuilder()
      .select("m")
      .from(Messages, "m")
      .leftJoinAndSelect("m.appointment", "a")
      .leftJoinAndSelect("m.fromUser", "fu")
      .leftJoinAndSelect("m.toUser", "tu")
      .where("m.appointmentId= :appointmentId", { appointmentId });
    queryBuilder.orderBy("m.messageId", "DESC"); // Or whatever you need to do

    return paginate<Messages>(queryBuilder, options);
  }

  async addMessage(messageDto: CreateMessageDto) {
    return await this.chatGateway.addMessage(messageDto);
  }

  _sanitizeUser(user: Users) {
    try {
      delete user.password;
      delete user.currentHashedRefreshToken;
      return user;
    } catch (e) {
      return e;
    }
  }
}

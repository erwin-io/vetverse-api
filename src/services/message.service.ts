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

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Messages)
    private readonly messagesRepo: Repository<Messages>
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
    return await this.messagesRepo.manager.transaction(
      async (entityManager) => {
        if (messageDto.fromUserId.includes(messageDto.toUserId)) {
          throw new HttpException(
            `sender and receiver should bot be the same`,
            HttpStatus.NOT_FOUND
          );
        }
        const fromUser: any = await entityManager.findOne(Users, {
          where: { userId: messageDto.fromUserId },
        });
        if (!fromUser) {
          throw new HttpException(`User doesn't exist`, HttpStatus.NOT_FOUND);
        }
        const toUser: any = await entityManager.findOne(Users, {
          where: { userId: messageDto.toUserId },
        });
        if (!toUser) {
          throw new HttpException(`User doesn't exist`, HttpStatus.NOT_FOUND);
        }
        const appointment: any = await entityManager.findOne(Appointment, {
          where: { appointmentId: messageDto.appointmentId },
        });
        if (!appointment) {
          throw new HttpException(
            `Appointment doesn't exist`,
            HttpStatus.NOT_FOUND
          );
        }
        let message = new Messages();
        message.message = messageDto.message;
        message.fromUser = fromUser;
        message.toUser = toUser;
        message.isClient = messageDto.isClient;
        message.appointment = appointment;
        message.dateTime = new Date();
        message = await entityManager.save(Messages, message);
        message.fromUser = this._sanitizeUser(message.fromUser);
        message.toUser = this._sanitizeUser(message.toUser);
        return message;
      }
    );
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

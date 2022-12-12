import {
  HttpException,
  HttpStatus,
  OnModuleInit,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Socket } from "socket.io";
import { CreateMessageDto } from "src/core/dto/message/message.create.dto";
import { AuthService } from "src/services/auth.service";
import { GatewayConnectedUsersService } from "src/services/gateway-connected-users.service";
import { MessageService } from "src/services/message.service";
import { UsersService } from "src/services/users.service";
import { Appointment } from "src/shared/entities/Appointment";
import { Messages } from "src/shared/entities/Messages";
import { Users } from "src/shared/entities/Users";
import { Repository } from "typeorm";

@WebSocketGateway({ cors: true })
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  @WebSocketServer()
  server;
  constructor(
    @InjectRepository(Messages)
    private readonly messagesRepo: Repository<Messages>,
    private authService: AuthService,
    private userService: UsersService,
    private gatewayConnectedUsersService: GatewayConnectedUsersService
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async onModuleInit() {
    this.gatewayConnectedUsersService.deleteAll();
  }

  async handleConnection(socket) {
    try {
      const decodedToken = await this.authService.verifyJwt(
        socket.handshake.headers.authorization
      );
      const res: any = await this.userService.findById(decodedToken.userId);
      if (!res) {
        return this.disconnect(socket);
      } else {
        socket.data.user = res.user;
        // Save connection to DB
        await this.gatewayConnectedUsersService.add({
          socketId: socket.id,
          userId: res.user.userId,
        });
      }
    } catch (ex) {
      console.log(ex);
      return this.disconnect(socket);
    }
  }

  // async handleConnection() {

  // }

  async handleDisconnect(socket: Socket) {
    // remove connection from DB
    socket.disconnect();
  }

  private disconnect(socket: Socket) {
    socket.emit("Error", new UnauthorizedException());
    socket.disconnect();
  }

  async addMessage(messageDto: CreateMessageDto) {
    try {
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

          const connectedUser: any =
            await this.gatewayConnectedUsersService.findByUserId(
              messageDto.toUserId
            );
          await this.server
            .to(connectedUser.socketId)
            .emit("messageAdded", message);
          return message;
        }
      );
    } catch (ex) {
      throw ex;
    }
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

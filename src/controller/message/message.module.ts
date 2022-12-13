import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FirebaseProviderModule } from "src/core/provider/firebase/firebase-provider.module";
import { ChatGateway } from "src/gateway/chat/chat.gateway";
import { GatewayConnectedUsersService } from "src/services/gateway-connected-users.service";
import { MessageService } from "src/services/message.service";
import { GatewayConnectedUsers } from "src/shared/entities/GatewayConnectedUsers";
import { Messages } from "src/shared/entities/Messages";
import { AuthModule } from "../auth/auth.module";
import { UsersModule } from "../users/users.module";
import { MessageController } from "./message.controller";

@Module({
  imports: [
    AuthModule,
    FirebaseProviderModule,
    UsersModule,
    TypeOrmModule.forFeature([Messages, GatewayConnectedUsers])],
  controllers: [MessageController],
  providers: [MessageService, ChatGateway, GatewayConnectedUsersService],
  exports: [MessageService, ChatGateway, GatewayConnectedUsersService],
})
export class MessageModule {}

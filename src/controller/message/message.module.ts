import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MessageService } from "src/services/message.service";
import { Messages } from "src/shared/entities/Messages";
import { MessageController } from "./message.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Messages])],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}

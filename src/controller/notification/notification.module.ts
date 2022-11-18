import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NotificationService } from "src/services/notification.service";
import { Notifications } from "src/shared/entities/Notifications";
import { NotificationController } from "./notification.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Notifications])],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}

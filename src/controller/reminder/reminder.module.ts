import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReminderService } from "src/services/reminder.service";
import { Reminder } from "src/shared/entities/Reminder";
import { ReminderController } from "./reminder.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Reminder])],
  controllers: [ReminderController],
  providers: [ReminderService],
  exports: [ReminderService],
})
export class ReminderModule {}

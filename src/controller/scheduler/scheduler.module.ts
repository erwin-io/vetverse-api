import { Module } from "@nestjs/common";
import { FirebaseProviderModule } from "src/core/provider/firebase/firebase-provider.module";
import { SchedulerService } from "src/services/scheduler.service";
import { AppointmentModule } from "../appointment/appointment.module";
import { SchedulerController } from "./scheduler.controller";

@Module({
  imports: [AppointmentModule, FirebaseProviderModule],
  controllers: [SchedulerController],
  providers: [SchedulerService],
  exports: [SchedulerService],
})
export class SchedulerModule {}
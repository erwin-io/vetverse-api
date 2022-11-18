import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm/dist/typeorm.module";
import { AppointmentService } from "../../services/appointment.service";
import { Appointment } from "../../shared/entities/Appointment";
import { AppointmentController } from "./appointment.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Appointment])],
  controllers: [AppointmentController],
  providers: [AppointmentService],
  exports: [AppointmentService],
})
export class AppointmentModule {}

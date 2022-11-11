import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DashboardService } from "src/services/dashboard.service";
import { Appointment } from "src/shared/entities/Appointment";
import { Payment } from "src/shared/entities/Payment";
import { DashboardController } from "./dashboard.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, Payment])],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}

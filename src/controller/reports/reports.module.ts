import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReportsService } from "src/services/reports.service";
import { Appointment } from "src/shared/entities/Appointment";
import { Payment } from "src/shared/entities/Payment";
import { ServiceType } from "src/shared/entities/ServiceType";
import { ReportsController } from "./reports.controller";

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([ServiceType, Payment, Appointment]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PaymentService } from "src/services/payment.service";
import { Payment } from "src/shared/entities/Payment";
import { PaymentsController } from "./payments.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Payment])],
  controllers: [PaymentsController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentsModule {}

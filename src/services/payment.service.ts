import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreatePaymentDto } from "src/core/dto/payment/payment.create.dto";
import {
  PaymentDto,
  UpdateReferenceNumberDto,
} from "src/core/dto/payment/payment.update.dto";
import { Appointment } from "src/shared/entities/Appointment";
import { Payment } from "src/shared/entities/Payment";
import { PaymentType } from "src/shared/entities/PaymentType";
import { Repository } from "typeorm";

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment) private readonly paymentRepo: Repository<Payment>
  ) {}

  async findAll(): Promise<Payment[]> {
    try {
      const query: any = await this.paymentRepo.manager
        .createQueryBuilder("Payment", "p")
        //Appointment
        .leftJoinAndSelect("p.appointment", "a")
        //consultation
        .leftJoinAndSelect("a.consultaionType", "ct")
        //status
        .leftJoinAndSelect("a.appointmentStatus", "as")
        .getMany();
      return query;
    } catch (e) {
      throw e;
    }
  }

  async findOne(options?: any) {
    try {
      // const serviceType = await this.appointmentRepo.findOneBy(options);
      const query: any = await this.paymentRepo.manager
        .createQueryBuilder("Payment", "p")
        //Appointment
        .leftJoinAndSelect("p.appointment", "a")
        //consultation
        .leftJoinAndSelect("a.consultaionType", "ct")
        //status
        .leftJoinAndSelect("a.appointmentStatus", "as")
        .where(options)
        .getOne();
      const result: Payment = query;
      return result;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async findById(paymentId: string) {
    try {
      const payment = await this.findOne({ paymentId });
      if (!payment) {
        throw new HttpException("Appointment not found", HttpStatus.NOT_FOUND);
      }
      return payment;
    } catch (e) {
      throw e;
    }
  }

  async add(createPaymentDto: CreatePaymentDto) {
    try {
      const isPaid = await this.paymentRepo.findOneBy({
        appointment: { appointmentId: createPaymentDto.appointmentId },
        isVoid: false,
      });

      if (isPaid) {
        throw new HttpException(
          "The appointment was already paid.",
          HttpStatus.BAD_REQUEST
        );
      }

      const payment = new Payment();
      payment.appointment = new Appointment();
      payment.appointment.appointmentId = createPaymentDto.appointmentId;
      payment.paymentDate = createPaymentDto.paymentDate;
      payment.paymentType = new PaymentType();
      payment.paymentType.paymentTypeId = createPaymentDto.paymentTypeId;
      payment.referenceNo = createPaymentDto.referenceNo;
      return await this.paymentRepo.save(payment);
    } catch (e) {
      throw e;
    }
  }

  async updateReferenceNumber(dto: UpdateReferenceNumberDto) {
    try {
      const payment = await this.paymentRepo.findOneBy({
        paymentId: dto.paymentId,
        isVoid: false,
      });

      if (!payment) {
        throw new HttpException(
          "There was no payment found.",
          HttpStatus.BAD_REQUEST
        );
      }
      payment.referenceNo = dto.referenceNo;
      return await this.paymentRepo.save(payment);
    } catch (e) {
      throw e;
    }
  }

  async void(dto: PaymentDto) {
    try {
      const payment = await this.paymentRepo.findOneBy({
        paymentId: dto.paymentId,
        isVoid: false,
      });

      if (!payment) {
        throw new HttpException(
          "There was no payment found.",
          HttpStatus.BAD_REQUEST
        );
      }
      payment.isVoid = true;
      return await this.paymentRepo.save(payment);
    } catch (e) {
      throw e;
    }
  }
}

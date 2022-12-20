import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CustomResponse } from "src/common/helper/customresponse.helpers";
import { JwtAuthGuard } from "src/core/auth/jwt.auth.guard";
import { CreatePaymentDto } from "src/core/dto/payment/payment.create.dto";
import { PaymentDto, UpdateReferenceNumberDto } from "src/core/dto/payment/payment.update.dto";
import { PaymentService } from "src/services/payment.service";

@ApiTags("payments")
@Controller("payments")
@ApiBearerAuth()
export class PaymentsController {
  constructor(private readonly paymentService: PaymentService) {}
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    const res: CustomResponse = {};
    try {
      res.data = await this.paymentService.findAll();
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Get(":paymentId")
  @UseGuards(JwtAuthGuard)
  async getById(@Param("paymentId") paymentId: string) {
    const res: CustomResponse = {};
    try {
      res.data = await this.paymentService.findById(paymentId);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("")
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreatePaymentDto) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.paymentService.add(dto);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("updateReferenceNumber/")
  @UseGuards(JwtAuthGuard)
  async updateReferenceNumber(@Body() dto: UpdateReferenceNumberDto) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.paymentService.updateReferenceNumber(dto);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("void/")
  @UseGuards(JwtAuthGuard)
  async void(@Body() dto: PaymentDto) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.paymentService.void(dto);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}

import {
  Controller,
  Get,
  Query,
  Req,
  Res,
  StreamableFile,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { CustomResponse } from "src/common/helper/customresponse.helpers";
import { ReportsService } from "src/services/reports.service";
import { Response } from "express";
import { Readable, Stream } from "stream";
import * as moment from "moment";
import { JwtAuthGuard } from "src/core/auth/jwt.auth.guard";

@ApiTags("reports")
@Controller("reports")
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}
  @Get("getServiceReport")
  @ApiQuery({ name: "from", required: false })
  @ApiQuery({ name: "to", required: false })
  @UseGuards(JwtAuthGuard)
  async getServiceReport(
    @Query("from") from: Date = new Date(),
    @Query("to") to: Date = new Date(),
    @Res() response: Response
  ) {
    const res: CustomResponse = {};
    try {
      const stream: Stream = await this.reportsService.getServiceReport(
        from,
        to
      );

      response.set({
        "Content-Type": "application/pdf",
      });

      stream.pipe(response);
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Get("getPaymentsReport")
  @ApiQuery({ name: "from", required: false })
  @ApiQuery({ name: "to", required: false })
  @UseGuards(JwtAuthGuard)
  async getPaymentsReport(
    @Query("from") from: Date = new Date(),
    @Query("to") to: Date = new Date(),
    @Res() response: Response
  ) {
    const res: CustomResponse = {};
    try {
      const stream: Stream = await this.reportsService.getPaymentsReport(
        from,
        to
      );

      response.set({
        "Content-Type": "application/pdf",
      });

      stream.pipe(response);
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Get("getAppointmentsReport")
  @ApiQuery({ name: "from", required: false })
  @ApiQuery({ name: "to", required: false })
  // @UseGuards(JwtAuthGuard)
  async getAppointmentsReport(
    @Query("from") from: Date = new Date(),
    @Query("to") to: Date = new Date(),
    @Res() response: Response
  ) {
    const res: CustomResponse = {};
    try {
      const stream: Stream = await this.reportsService.getAppointmentsReport(
        from,
        to
      );

      response.set({
        "Content-Type": "application/pdf",
      });

      stream.pipe(response);
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Get("getClientsReport")
  // @UseGuards(JwtAuthGuard)
  async getClientsReport(@Res() response: Response) {
    const res: CustomResponse = {};
    try {
      const stream: Stream = await this.reportsService.getClientsReport();

      response.set({
        "Content-Type": "application/pdf",
      });

      stream.pipe(response);
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Get("getPetsReport")
  // @UseGuards(JwtAuthGuard)
  async getPetsReport(@Res() response: Response) {
    const res: CustomResponse = {};
    try {
      const stream: Stream = await this.reportsService.getPetsReport();

      response.set({
        "Content-Type": "application/pdf",
      });

      stream.pipe(response);
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Get("getStaffReport")
  // @UseGuards(JwtAuthGuard)
  async getStaffReport(@Res() response: Response) {
    const res: CustomResponse = {};
    try {
      const stream: Stream = await this.reportsService.getStaffReport();

      response.set({
        "Content-Type": "application/pdf",
      });

      stream.pipe(response);
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}

import {
  Controller,
  Get,
  Query,
  Req,
  Res,
  StreamableFile,
} from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { CustomResponse } from "src/common/helper/customresponse.helpers";
import { ReportsService } from "src/services/reports.service";
import { Response } from "express";
import { Readable, Stream } from "stream";
import * as moment from "moment";

@ApiTags("reports")
@Controller("reports")
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}
  @Get("getServiceReport")
  @ApiQuery({ name: "from", required: false })
  @ApiQuery({ name: "to", required: false })
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
}

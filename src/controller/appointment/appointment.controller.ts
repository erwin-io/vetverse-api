import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { CustomResponse } from "src/common/helper/customresponse.helpers";
import { JwtAuthGuard } from "src/core/auth/jwt.auth.guard";
import {
  CreateClientAppointmentDto,
  CreateClientCashlessAppointmentDto,
  CreateOnsiteAppointmentDto,
  CreateWalkInAppointmentDto,
} from "src/core/dto/appointment/appointment.create.dto";
import {
  AddAttachmentFileDto,
  RescheduleAppointmentDto,
  UpdateAppointmentConferencePeer,
  UpdateAppointmentStatusDto,
  UpdateDiagnosisAndTreatment,
} from "src/core/dto/appointment/appointment.update.dtos";
import { AppointmentService } from "src/services/appointment.service";

@ApiTags("appointment")
@Controller("appointment")
@ApiBearerAuth("jwt")
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    const res: CustomResponse = {};
    try {
      res.data = await this.appointmentService.findAll();
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Get("getClientAppointmentsByStatus")
  @ApiQuery({ name: "clientId", required: false })
  @ApiQuery({ name: "appointmentStatus", required: false })
  @UseGuards(JwtAuthGuard)
  async getClientAppointmentsByStatus(
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    @Query("clientId") clientId: string = "",
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    @Query("appointmentStatus")
    appointmentStatus: string = ""
  ) {
    const res: CustomResponse = {};
    try {
      res.data = await this.appointmentService.getClientAppointmentsByStatus(
        clientId,
        appointmentStatus.trim() === "" ? [] : appointmentStatus.split(",")
      );
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Get("getByAdvanceSearch")
  @ApiQuery({ name: "isAdvance", required: false })
  @ApiQuery({ name: "keyword", required: false })
  @ApiQuery({ name: "isWalkIn", required: false })
  @ApiQuery({ name: "clientName", required: false })
  @ApiQuery({ name: "vetName", required: false })
  @ApiQuery({ name: "appointmentStatus", required: false })
  @ApiQuery({ name: "serviceType", required: false })
  @ApiQuery({ name: "consultaionType", required: false })
  @ApiQuery({ name: "appointmentDateFrom", type: Date, required: false })
  @ApiQuery({ name: "appointmentDateTo", required: false })
  @UseGuards(JwtAuthGuard)
  async getByAdvanceSearch(
    @Query("isAdvance") isAdvance: boolean,
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    @Query("keyword") keyword: string = "",
    @Query("isWalkIn") isWalkIn: boolean,
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    @Query("clientName") clientName: string = "",
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    @Query("vetName") vetName: string = "",
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    @Query("appointmentStatus")
    appointmentStatus: string = "",
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    @Query("serviceType") serviceType: string = "",
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    @Query("consultaionType") consultaionType: string = "",
    @Query("appointmentDateFrom") appointmentDateFrom: Date,
    @Query("appointmentDateTo") appointmentDateTo: Date
  ) {
    const res: CustomResponse = {};
    try {
      res.data = await this.appointmentService.findByFilter(
        isAdvance,
        keyword,
        isWalkIn,
        clientName,
        vetName,
        appointmentStatus.trim() === "" ? [] : appointmentStatus.split(","),
        serviceType.trim() === "" ? [] : serviceType.split(","),
        consultaionType.trim() === "" ? [] : consultaionType.split(","),
        appointmentDateFrom,
        appointmentDateTo
      );
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Get(":appointmentId")
  @UseGuards(JwtAuthGuard)
  async getById(@Param("appointmentId") appointmentId: string) {
    const res: CustomResponse = {};
    try {
      res.data = await this.appointmentService.findById(appointmentId);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Get("getAppointmentConferencePeer/:appointmentId")
  async getAppointmentConferencePeer(
    @Param("appointmentId") appointmentId: string
  ) {
    const res: CustomResponse = {};
    try {
      res.data = await this.appointmentService.getAppointmentConferencePeer(
        appointmentId
      );
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Get("getAppointmentsForADay/:date")
  @UseGuards(JwtAuthGuard)
  async getAppointmentsForADay(@Param("date") dateString: string) {
    const res: CustomResponse = {};
    try {
      res.data = await this.appointmentService.getAppointmentsForADay(
        dateString
      );
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("createClientAppointment")
  @UseGuards(JwtAuthGuard)
  async createClientAppointment(@Body() dto: CreateClientAppointmentDto) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.appointmentService.createClientAppointment(dto);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("createClientCashlessAppointment")
  @UseGuards(JwtAuthGuard)
  async createClientCashlessAppointment(
    @Body() dto: CreateClientCashlessAppointmentDto
  ) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.appointmentService.createClientCashlessAppointment(
        dto
      );
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("createOnsiteAppointment")
  @UseGuards(JwtAuthGuard)
  async CreateOnsiteAppointment(@Body() dto: CreateOnsiteAppointmentDto) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.appointmentService.createOnsiteAppointment(dto);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("createWalkInAppointment")
  @UseGuards(JwtAuthGuard)
  async createWalkInAppointment(@Body() dto: CreateWalkInAppointmentDto) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.appointmentService.createWalkInAppointment(dto);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("rescheduleAppointment")
  @UseGuards(JwtAuthGuard)
  async rescheduleAppointment(@Body() dto: RescheduleAppointmentDto) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.appointmentService.updateSchedule(dto);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("updateAppointmentStatus")
  @UseGuards(JwtAuthGuard)
  async updateAppointmentStatus(@Body() dto: UpdateAppointmentStatusDto) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.appointmentService.updateStatus(dto);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("updateAppointmentConferencePeer")
  @UseGuards(JwtAuthGuard)
  async updateAppointmentConferencePeer(
    @Body() dto: UpdateAppointmentConferencePeer
  ) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.appointmentService.updateAppointmentConferencePeer(
        dto
      );
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("updateAppointmentDiagnosisAndTreatment")
  @UseGuards(JwtAuthGuard)
  async updateAppointmentDiagnosisAndTreatment(
    @Body() dto: UpdateDiagnosisAndTreatment
  ) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data =
        await this.appointmentService.updateAppointmentDiagnosisAndTreatment(
          dto
        );
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("addAttachmentFile")
  @UseGuards(JwtAuthGuard)
  async addAttachmentFile(@Body() dto: AddAttachmentFileDto) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.appointmentService.addAttachmentFile(dto);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("addDiagnosisAttachmentFile")
  @UseGuards(JwtAuthGuard)
  async addDiagnosisAttachmentFile(@Body() dto: AddAttachmentFileDto) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.appointmentService.addDiagnosisAttachmentFile(dto);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Delete("removeAttachmentFile/:appointmentAttachmentId")
  @UseGuards(JwtAuthGuard)
  async removeAttachmentFile(
    @Param("appointmentAttachmentId") appointmentAttachmentId: string
  ) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.appointmentService.removeAttachmentFile(
        appointmentAttachmentId
      );
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Delete("removeDiagnosisAttachmentFile/:diagnosisAttachmentsId")
  @UseGuards(JwtAuthGuard)
  async removeDiagnosisAttachmentFile(
    @Param("diagnosisAttachmentsId") diagnosisAttachmentsId: string
  ) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.appointmentService.removeDiagnosisAttachmentFile(
        diagnosisAttachmentsId
      );
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}

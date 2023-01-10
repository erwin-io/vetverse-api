import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiQuery, ApiParam } from "@nestjs/swagger";
import * as moment from "moment";
import { CustomResponse } from "src/common/helper/customresponse.helpers";
import { JwtAuthGuard } from "src/core/auth/jwt.auth.guard";
import { AppointmentService } from "src/services/appointment.service";
import { DashboardService } from "src/services/dashboard.service";

@Controller("dashboard")
@ApiTags("dashboard")
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardServiceService: DashboardService) {}

  @Get("getVetAppointmentSummary")
  @ApiQuery({ name: "staffId", required: false })
  @ApiQuery({ name: "year", required: false })
  //@UseGuards(JwtAuthGuard)
  async getVetAppointmentSummary(
    @Query("staffId") staffId = "",
    @Query("year") year = new Date().getFullYear()
  ) {
    const res: CustomResponse = {};
    try {
      res.data =
        await this.dashboardServiceService.getVetYearlyAppointmentSummary(
          staffId,
          year
        );
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Get("getVetYearlyAppointmentGraph")
  @ApiQuery({ name: "staffId", required: false })
  @ApiQuery({ name: "appointmentStatusId", required: false })
  @ApiQuery({ name: "year", required: false })
  //@UseGuards(JwtAuthGuard)
  async getVetYearlyClosedAppointmentGraph(
    @Query("staffId") staffId = "",
    @Query("appointmentStatusId") appointmentStatusId = "",
    @Query("year") year = new Date().getFullYear()
  ) {
    const res: CustomResponse = {};
    try {
      res.data =
        await this.dashboardServiceService.getVetYearlyAppointmentGraph(
          staffId,
          appointmentStatusId,
          year
        );
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Get("getYearlyRevenue")
  @ApiQuery({ name: "year", required: false })
  //@UseGuards(JwtAuthGuard)
  async getYearlyRevenue(@Query("year") year = new Date().getFullYear()) {
    const res: CustomResponse = {};
    try {
      res.data = await this.dashboardServiceService.getYearlyRevenue(year);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Get("getYearlyRevenueGraph")
  @ApiQuery({ name: "year", required: false })
  //@UseGuards(JwtAuthGuard)
  async getYearlyRevenueGraph(@Query("year") year = new Date().getFullYear()) {
    const res: CustomResponse = {};
    try {
      res.data = await this.dashboardServiceService.getYearlyRevenueGraph(year);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Get("getClientUpcomingAppointment")
  //@UseGuards(JwtAuthGuard)
  @ApiQuery({ name: "clientId", required: true })
  @ApiQuery({ name: "date", required: false })
  async getClientUpcomingAppointment(
    @Query("clientId") clientId,
    @Query("date") date = new Date()
  ) {
    const res: CustomResponse = {};
    try {
      res.data =
        await this.dashboardServiceService.getClientUpcomingAppointment(
          clientId,
          moment(date).format("YYYY-MM-DD")
        );
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Get("getClientLatestAppointmentNotif/:clientId")
  //@UseGuards(JwtAuthGuard)
  async getClientLatestAppointmentNotif(@Param("clientId") clientId: string) {
    const res: CustomResponse = {};
    try {
      res.data =
        await this.dashboardServiceService.getClientLatestAppointmentNotif(
          clientId
        );
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Get("getClientLatestAnnouncements/:clientId")
  //@UseGuards(JwtAuthGuard)
  async getClientLatestAnnouncements(@Param("clientId") clientId: string) {
    const res: CustomResponse = {};
    try {
      res.data =
        await this.dashboardServiceService.getClientLatestAnnouncements(
          clientId
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

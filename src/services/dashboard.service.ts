import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AppointmentViewModel } from "src/core/view-model/appointment.view-model";
import { Appointment } from "src/shared/entities/Appointment";
import { Payment } from "src/shared/entities/Payment";
import { Repository } from "typeorm";
import * as moment from "moment";

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>
  ) {}

  async getVetYearlyAppointmentSummary(staffId, year: number) {
    try {
      const appointmentDateFrom = new Date(`${year}-01-01`);
      const appointmentDateTo = new Date(year, 11, 31);
      let query = await this.appointmentRepo.manager
        .createQueryBuilder("Appointment", "a")
        //staff
        .leftJoinAndSelect("a.staff", "s")
        //status
        .leftJoinAndSelect("a.appointmentStatus", "as");

      if (
        appointmentDateFrom instanceof Date &&
        appointmentDateFrom.toDateString() !== "Invalid Date" &&
        appointmentDateTo instanceof Date &&
        appointmentDateTo.toDateString() !== "Invalid Date"
      ) {
        query = query.andWhere(
          "a.appointmentDate between :appointmentDateFrom and :appointmentDateTo",
          { appointmentDateFrom, appointmentDateTo }
        );
        // params.appointmentDateFrom =
        //   moment(appointmentDateFrom).format("YYYY-MM-DD");
        // params.appointmentDateTo =
        //   moment(appointmentDateTo).format("YYYY-MM-DD");
      }
      return {
        pending: await query
          .andWhere("s.staffId =:staffId", { staffId })
          .andWhere("as.appointmentStatusId =:appointmentStatusId", {
            appointmentStatusId: "1",
          })
          .getCount(),
        approved: await query
          .andWhere("s.staffId =:staffId", { staffId })
          .andWhere("as.appointmentStatusId =:appointmentStatusId", {
            appointmentStatusId: "2",
          })
          .getCount(),
        completed: await query
          .andWhere("s.staffId =:staffId", { staffId })
          .andWhere("as.appointmentStatusId =:appointmentStatusId", {
            appointmentStatusId: "3",
          })
          .getCount(),
        cancelled: await query
          .andWhere("s.staffId =:staffId", { staffId })
          .andWhere("as.appointmentStatusId =:appointmentStatusId", {
            appointmentStatusId: "4",
          })
          .getCount(),
      };
    } catch (e) {
      throw e;
    }
  }

  async getVetYearlyAppointmentGraph(
    staffId,
    appointmentStatusId,
    year: number
  ) {
    try {
      let query = await this.appointmentRepo.manager
        .createQueryBuilder("Appointment", "a")
        //staff
        .leftJoinAndSelect("a.staff", "s")
        //status
        .leftJoinAndSelect("a.appointmentStatus", "as")
        .andWhere("s.staffId =:staffId", { staffId })
        .andWhere("as.appointmentStatusId =:appointmentStatusId", {
          appointmentStatusId: appointmentStatusId,
        });
      const result = {};
      for (let i = 0; i < 12; i++) {
        query = query.andWhere(
          "a.appointmentDate between :appointmentDateFrom and :appointmentDateTo",
          {
            appointmentDateFrom: new Date(year, i, 0),
            appointmentDateTo: new Date(year, i + 1, 0),
          }
        );
        result[i] = await query.getCount();
      }
      return result;
    } catch (e) {
      throw e;
    }
  }

  async getYearlyRevenue(year: number) {
    try {
      const paymentDateFrom = new Date(`${year}-01-01`);
      const paymentDateTo = new Date(year, 11, 31);
      const query = await this.paymentRepo.manager
        .createQueryBuilder("Payment", "p")
        .leftJoinAndSelect("p.appointment", "a")
        .leftJoinAndSelect("a.serviceType", "s")
        .leftJoinAndSelect("p.paymentType", "pt");

      let cashResult;
      let gCashResult;
      if (
        paymentDateFrom instanceof Date &&
        paymentDateFrom.toDateString() !== "Invalid Date" &&
        paymentDateTo instanceof Date &&
        paymentDateTo.toDateString() !== "Invalid Date"
      ) {
        const cash = await query
          .andWhere(
            "p.paymentDate between :paymentDateFrom and :paymentDateTo",
            {
              paymentDateFrom,
              paymentDateTo,
            }
          )
          .andWhere("p.isVoid =:isVoid", { isVoid: false })
          .andWhere("pt.paymentTypeId =:paymentTypeId", { paymentTypeId: 1 })
          .getMany();
        const gcash = await query
          .andWhere(
            "p.paymentDate between :paymentDateFrom and :paymentDateTo",
            {
              paymentDateFrom,
              paymentDateTo,
            }
          )
          .andWhere("p.isVoid =:isVoid", { isVoid: false })
          .andWhere("pt.paymentTypeId =:paymentTypeId", { paymentTypeId: 2 })
          .getMany();

        let totalCash = 0;
        let totalGCash = 0;
        cash.forEach((x: Payment) => {
          totalCash = totalCash + x.appointment.serviceType.price;
        });
        gcash.forEach((x: Payment) => {
          totalGCash = totalGCash + x.appointment.serviceType.price;
        });
        cashResult = totalCash;
        gCashResult = totalGCash;
      }
      return {
        cash: cashResult,
        gcash: gCashResult,
      };
    } catch (e) {
      throw e;
    }
  }

  async getYearlyRevenueGraph(year: number) {
    try {
      const query = await this.appointmentRepo.manager
        .createQueryBuilder("Payment", "p")
        .leftJoinAndSelect("p.appointment", "a")
        .leftJoinAndSelect("a.serviceType", "s")
        .leftJoinAndSelect("p.paymentType", "pt");
      const cashResult = {};
      const gCashResult = {};
      let cashQuery = null;
      let gCashQuery = null;
      for (let i = 0; i < 12; i++) {
        cashQuery = query
          .andWhere("p.isVoid =:isVoid", { isVoid: false })
          .andWhere(
            "p.paymentDate between :paymentDateFrom and :paymentDateTo",
            {
              paymentDateFrom: new Date(year, i, 0),
              paymentDateTo: new Date(year, i + 1, 0),
            }
          )
          .andWhere("pt.paymentTypeId =:paymentTypeId", { paymentTypeId: 1 });
        gCashQuery = query
          .andWhere("p.isVoid =:isVoid", { isVoid: false })
          .andWhere(
            "p.paymentDate between :paymentDateFrom and :paymentDateTo",
            {
              paymentDateFrom: new Date(year, i, 0),
              paymentDateTo: new Date(year, i + 1, 0),
            }
          );
        const cash = await cashQuery
          .andWhere("pt.paymentTypeId =:paymentTypeId", { paymentTypeId: 1 })
          .getMany();
        const gcash = await gCashQuery
          .andWhere("pt.paymentTypeId =:paymentTypeId", { paymentTypeId: 2 })
          .getMany();

        let totalCash = 0;
        let totalGCash = 0;
        cash.forEach((x: Payment) => {
          totalCash = totalCash + x.appointment.serviceType.price;
        });
        gcash.forEach((x: Payment) => {
          totalGCash = totalGCash + x.appointment.serviceType.price;
        });
        cashResult[i] = totalCash;
        gCashResult[i] = totalGCash;
      }
      return {
        cash: cashResult,
        gcash: gCashResult,
      };
    } catch (e) {
      throw e;
    }
  }
}

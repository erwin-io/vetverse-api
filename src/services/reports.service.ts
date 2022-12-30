import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ServiceType } from "src/shared/entities/ServiceType";
import { Repository } from "typeorm";
import { HttpService } from "@nestjs/axios";
import { catchError, firstValueFrom } from "rxjs";
import * as moment from "moment";
import axios from "axios";
import { ConfigService } from "@nestjs/config";
import { Payment } from "src/shared/entities/Payment";
import { Appointment } from "src/shared/entities/Appointment";
import { Clients } from "src/shared/entities/Clients";
import { Pet } from "src/shared/entities/Pet";
import { Staff } from "src/shared/entities/Staff";
import { AppointmentStatusEnum } from "src/common/enums/appointment-status.enum";

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(ServiceType)
    private readonly serviceTypeRepo: Repository<ServiceType>,
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
    private readonly httpService: HttpService,
    @Inject(ConfigService)
    private readonly config: ConfigService
  ) {}

  async getServiceReport(from: Date, to: Date) {
    try {
      const data = {
        report: {
          name: "Service report",
          dateRange: {
            from: moment(from.toString()).format("MMM DD, YYYY"),
            to: moment(to.toString()).format("MMM DD, YYYY"),
          },
        },
        items: [],
      };
      const services = <ServiceType[]>await this.serviceTypeRepo.manager
        .createQueryBuilder("ServiceType", "st")
        .leftJoinAndSelect("st.appointments", "a")
        .leftJoinAndSelect("a.appointmentStatus", "as")
        .where("a.appointmentDate between :from and :to", {
          from: new Date(new Date(from).setHours(0, 0, 0, 0)),
          to: new Date(new Date(to).setHours(23, 59, 59, 999)),
        })
        .andWhere("as.name = :status", {
          status: "Completed",
        })
        .getMany();

      data.items = services.map((x) => {
        const item = {
          name: x.name,
          price: x.price,
          durationInHours: x.durationInHours,
          timesConducted: x.appointments.length,
        };
        return item;
      });
      const params = {
        template: {
          name: "service-report",
        },
        data: data,
      };
      const url = this.config.get<string>("JSREPORTS_URL").toString();
      const username = this.config.get<string>("JSREPORTS_USERNAME").toString();
      const password = this.config.get<string>("JSREPORTS_PASSWORD").toString();
      const result = await firstValueFrom(
        this.httpService
          .post<any>(url, JSON.stringify(params), {
            auth: {
              username,
              password,
            },
            responseType: "stream",
            headers: {
              "Content-Type": "application/json",
            },
          })
          .pipe(
            catchError((error) => {
              throw new HttpException(
                error.response.data,
                HttpStatus.BAD_REQUEST
              );
            })
          )
      );
      return result.data;
    } catch (e) {
      throw e;
    }
  }

  async getPaymentsReport(from: Date, to: Date) {
    try {
      const data = {
        report: {
          name: "Payments report",
          dateRange: {
            from: moment(from.toString()).format("MMM DD, YYYY"),
            to: moment(to.toString()).format("MMM DD, YYYY"),
          },
        },
        items: [],
      };
      const services = <Payment[]>await this.paymentRepo.manager
        .createQueryBuilder("Payment", "p")
        .leftJoinAndSelect("p.appointment", "a")
        .leftJoinAndSelect("p.paymentType", "pt")
        .where("p.paymentDate between :from and :to", {
          from: new Date(new Date(from).setHours(0, 0, 0, 0)),
          to: new Date(new Date(to).setHours(23, 59, 59, 999)),
        })
        .andWhere("p.isVoid = :isVoid", { isVoid: false })
        .getMany();

      data.items = services.map((x) => {
        const item = {
          referenceNo: x.referenceNo,
          paymentType: x.paymentType.name,
          paymentDate: moment(x.paymentDate).format("MMM DD, YYYY"),
          amount: x.appointment.serviceRate,
        };
        return item;
      });
      const params = {
        template: {
          name: "payments-report",
        },
        data: data,
      };
      const url = this.config.get<string>("JSREPORTS_URL").toString();
      const username = this.config.get<string>("JSREPORTS_USERNAME").toString();
      const password = this.config.get<string>("JSREPORTS_PASSWORD").toString();
      const result = await firstValueFrom(
        this.httpService
          .post<any>(url, JSON.stringify(params), {
            auth: {
              username,
              password,
            },
            responseType: "stream",
            headers: {
              "Content-Type": "application/json",
            },
          })
          .pipe(
            catchError((error) => {
              throw new HttpException(
                error.response.data,
                HttpStatus.BAD_REQUEST
              );
            })
          )
      );
      return result.data;
    } catch (e) {
      throw e;
    }
  }

  async getAppointmentsReport(from: Date, to: Date) {
    try {
      const data = {
        report: {
          name: "Appointments report",
          dateRange: {
            from: moment(from.toString()).format("MMM DD, YYYY"),
            to: moment(to.toString()).format("MMM DD, YYYY"),
          },
        },
        items: [],
      };
      const services = <Appointment[]>await this.appointmentRepo.manager
        .createQueryBuilder("Appointment", "a")
        .leftJoinAndSelect("a.consultaionType", "ct")
        .leftJoinAndSelect("a.serviceType", "st")
        .leftJoinAndSelect("a.staff", "s")
        .leftJoinAndSelect("a.appointmentStatus", "as")
        .where("a.appointmentDate between :from and :to", {
          from: new Date(new Date(from).setHours(0, 0, 0, 0)),
          to: new Date(new Date(to).setHours(23, 59, 59, 999)),
        })
        .andWhere("as.appointmentStatusId = :appointmentStatusId", {
          appointmentStatusId: 3,
        })
        .getMany();

      data.items = services.map((x) => {
        const item = {
          type: x.consultaionType.name,
          service: x.serviceType.name,
          duration: x.serviceType.durationInHours,
          appointmentDate: x.appointmentDate,
          vet:
            x.staff.middleName && x.staff.middleName !== ""
              ? `${x.staff.firstName} ${x.staff.middleName} ${x.staff.lastName}`
              : `${x.staff.firstName} ${x.staff.lastName}`,
        };
        return item;
      });
      const params = {
        template: {
          name: "appointments-report",
        },
        data: data,
      };
      const url = this.config.get<string>("JSREPORTS_URL").toString();
      const username = this.config.get<string>("JSREPORTS_USERNAME").toString();
      const password = this.config.get<string>("JSREPORTS_PASSWORD").toString();
      const result = await firstValueFrom(
        this.httpService
          .post<any>(url, JSON.stringify(params), {
            auth: {
              username,
              password,
            },
            responseType: "stream",
            headers: {
              "Content-Type": "application/json",
            },
          })
          .pipe(
            catchError((error) => {
              throw new HttpException(
                error.response.data,
                HttpStatus.BAD_REQUEST
              );
            })
          )
      );
      return result.data;
    } catch (e) {
      throw e;
    }
  }

  async getClientsReport() {
    try {
      const data = {
        report: {
          name: "Clients report",
          dateRange: {},
        },
        items: [],
      };
      const services = <Clients[]>await this.appointmentRepo.manager
        .createQueryBuilder("Clients", "c")
        .leftJoinAndSelect("c.user", "u")
        .leftJoinAndSelect("u.entityStatus", "es")
        .where("es.entityStatusId = :entityStatusId", {
          entityStatusId: 1,
        })
        .getMany();

      data.items = services.map((x) => {
        const item = {
          name:
            x.middleName && x.middleName !== ""
              ? `${x.firstName} ${x.middleName} ${x.lastName}`
              : `${x.firstName} ${x.lastName}`,
          contact: x.mobileNumber,
          address: x.address,
          email: x.email,
        };
        return item;
      });
      const params = {
        template: {
          name: "clients-report",
        },
        data: data,
      };
      const url = this.config.get<string>("JSREPORTS_URL").toString();
      const username = this.config.get<string>("JSREPORTS_USERNAME").toString();
      const password = this.config.get<string>("JSREPORTS_PASSWORD").toString();
      const result = await firstValueFrom(
        this.httpService
          .post<any>(url, JSON.stringify(params), {
            auth: {
              username,
              password,
            },
            responseType: "stream",
            headers: {
              "Content-Type": "application/json",
            },
          })
          .pipe(
            catchError((error) => {
              throw new HttpException(
                error.response.data,
                HttpStatus.BAD_REQUEST
              );
            })
          )
      );
      return result.data;
    } catch (e) {
      throw e;
    }
  }

  async getPetsReport() {
    try {
      const data = {
        report: {
          name: "Pets report",
          dateRange: {},
        },
        items: [],
      };
      const services = <Pet[]>await this.appointmentRepo.manager
        .createQueryBuilder("Pet", "p")
        .leftJoinAndSelect("p.client", "c")
        .where("p.entityStatusId = :entityStatusId", {
          entityStatusId: 1,
        })
        .getMany();

      data.items = services.map((x) => {
        const item = {
          name: x.name,
          owner:
            x.client.middleName && x.client.middleName !== ""
              ? `${x.client.firstName} ${x.client.middleName} ${x.client.lastName}`
              : `${x.client.firstName} ${x.client.lastName}`,
        };
        return item;
      });
      const params = {
        template: {
          name: "pets-report",
        },
        data: data,
      };
      const url = this.config.get<string>("JSREPORTS_URL").toString();
      const username = this.config.get<string>("JSREPORTS_USERNAME").toString();
      const password = this.config.get<string>("JSREPORTS_PASSWORD").toString();
      const result = await firstValueFrom(
        this.httpService
          .post<any>(url, JSON.stringify(params), {
            auth: {
              username,
              password,
            },
            responseType: "stream",
            headers: {
              "Content-Type": "application/json",
            },
          })
          .pipe(
            catchError((error) => {
              throw new HttpException(
                error.response.data,
                HttpStatus.BAD_REQUEST
              );
            })
          )
      );
      return result.data;
    } catch (e) {
      throw e;
    }
  }

  async getStaffReport() {
    try {
      const data = {
        report: {
          name: "Staff report",
          dateRange: {},
        },
        items: [],
      };
      const services = <Staff[]>await this.appointmentRepo.manager
        .createQueryBuilder("Staff", "s")
        .leftJoinAndSelect("s.user", "u")
        .leftJoinAndSelect("u.role", "r")
        .leftJoinAndSelect("u.entityStatus", "es")
        .where("r.roleId IN(:...roleIds)", { roleIds: [1, 2, 3, 4] })
        .andWhere("es.entityStatusId = :entityStatusId", {
          entityStatusId: 1,
        })
        .getMany();

      data.items = services.map((x) => {
        const item = {
          name:
            x.middleName && x.middleName !== ""
              ? `${x.firstName} ${x.middleName} ${x.lastName}`
              : `${x.firstName} ${x.lastName}`,
          role: x.user.role.name,
          contact: x.mobileNumber,
          address: x.address,
          email: x.email,
        };
        return item;
      });
      const params = {
        template: {
          name: "staff-report",
        },
        data: data,
      };
      const url = this.config.get<string>("JSREPORTS_URL").toString();
      const username = this.config.get<string>("JSREPORTS_USERNAME").toString();
      const password = this.config.get<string>("JSREPORTS_PASSWORD").toString();
      const result = await firstValueFrom(
        this.httpService
          .post<any>(url, JSON.stringify(params), {
            auth: {
              username,
              password,
            },
            responseType: "stream",
            headers: {
              "Content-Type": "application/json",
            },
          })
          .pipe(
            catchError((error) => {
              throw new HttpException(
                error.response.data,
                HttpStatus.BAD_REQUEST
              );
            })
          )
      );
      return result.data;
    } catch (e) {
      throw e;
    }
  }

  async getVetReport(from: Date, to: Date) {
    try {
      const data = {
        report: {
          name: "Veterinarian report",
          dateRange: {},
        },
        items: [],
      };
      const services = <Staff[]>await this.appointmentRepo.manager
        .createQueryBuilder("Staff", "s")
        .leftJoinAndSelect("s.user", "u")
        .leftJoinAndSelect("u.role", "r")
        .leftJoinAndSelect("u.entityStatus", "es")
        .leftJoinAndSelect("s.appointments", "a")
        .leftJoinAndSelect("a.appointmentStatus", "as")
        .where("r.roleId = :roleId", {
          roleId: 3,
        })
        .andWhere("es.entityStatusId = :entityStatusId", {
          entityStatusId: 1,
        })
        .andWhere("as.appointmentStatusId IN(:...appointmentStatusId)", {
          appointmentStatusId: ["3", "4"],
        })
        .andWhere("a.appointmentDate between :from and :to", {
          from: new Date(new Date(from).setHours(0, 0, 0, 0)),
          to: new Date(new Date(to).setHours(23, 59, 59, 999)),
        })
        .getMany();

      const items = services.map((x) => {
        const item = {
          name:
            x.middleName && x.middleName !== ""
              ? `${x.firstName} ${x.middleName} ${x.lastName}`
              : `${x.firstName} ${x.lastName}`,
          completed: x.appointments.filter(
            (x) =>
              Number(x.appointmentStatus.appointmentStatusId) ===
              Number(AppointmentStatusEnum.COMPLETED)
          ).length,
          cancelled: x.appointments.filter(
            (x) =>
              Number(x.appointmentStatus.appointmentStatusId) ===
              Number(AppointmentStatusEnum.CANCELLED)
          ).length,
          appointments: x.appointments.length,
        };
        return item;
      });
      data.items = items;
      const params = {
        template: {
          name: "vet-report",
        },
        data: data,
      };
      const url = this.config.get<string>("JSREPORTS_URL").toString();
      const username = this.config.get<string>("JSREPORTS_USERNAME").toString();
      const password = this.config.get<string>("JSREPORTS_PASSWORD").toString();
      const result = await firstValueFrom(
        this.httpService
          .post<any>(url, JSON.stringify(params), {
            auth: {
              username,
              password,
            },
            responseType: "stream",
            headers: {
              "Content-Type": "application/json",
            },
          })
          .pipe(
            catchError((error) => {
              throw new HttpException(
                error.response.data,
                HttpStatus.BAD_REQUEST
              );
            })
          )
      );
      return result.data;
    } catch (e) {
      throw e;
    }
  }
}

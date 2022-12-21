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

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(ServiceType)
    private readonly serviceTypeRepo: Repository<ServiceType>,
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
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
          to: new Date(new Date(to).setHours(0, 0, 0, 0)),
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
          to: new Date(new Date(to).setHours(0, 0, 0, 0)),
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
}

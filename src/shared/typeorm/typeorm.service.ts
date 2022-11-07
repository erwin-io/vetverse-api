import { EntityStatus } from "./../entities/EntityStatus";
import { UserType } from "./../entities/UserType";
import { Gender } from "./../entities/Gender";
import { Staff } from "./../entities/Staff";
import { Clients } from "./../entities/Clients";
import { Users } from "./../entities/Users";
import { Injectable, Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Roles } from "../entities/Roles";
import { PetType } from "../entities/PetType";
import { PetCategory } from "../entities/PetCategory";
import { ServiceType } from "../entities/ServiceType";
import { Appointment } from "../entities/Appointment";
import { AppointmentStatus } from "../entities/AppointmentStatus";
import { ClientAppointment } from "../entities/ClientAppointment";
import { Payment } from "../entities/Payment";
import { PaymentType } from "../entities/PaymentType";
import { ConsultaionType } from "../entities/ConsultaionType";
import { Diagnosis } from "../entities/Diagnosis";
import { Pet } from "../entities/Pet";
import { PetAppointment } from "../entities/PetAppointment";
import { Messages } from "../entities/Messages";
import { Notifications } from "../entities/Notifications";

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  @Inject(ConfigService)
  private readonly config: ConfigService;

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: "mssql",
      host: this.config.get<string>("DATABASE_HOST"),
      // port: Number(this.config.get<number>("DATABASE_PORT")),
      database: this.config.get<string>("DATABASE_NAME"),
      username: this.config.get<string>("DATABASE_USER"),
      password: this.config.get<string>("DATABASE_PASSWORD"),
      entities: [
        Users,
        Roles,
        Clients,
        Staff,
        Pet,
        PetType,
        PetCategory,
        Gender,
        UserType,
        EntityStatus,
        ServiceType,
        Appointment,
        ConsultaionType,
        Diagnosis,
        AppointmentStatus,
        ClientAppointment,
        PetAppointment,
        Payment,
        PaymentType,
        Notifications,
        Messages,
      ],
      synchronize: false, // never use TRUE in production!
      options: { encrypt: false },
    };
  }
}

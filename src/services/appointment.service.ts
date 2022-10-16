import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
// import moment from "moment";
import * as moment from "moment";
import { AppointmentStatusEnum } from "src/common/enums/appointment-status.enum";
import { PaymentTypeEnum } from "src/common/enums/payment-type.enum";
import { addHours } from "src/common/utils/utils";
import {
  CreateClientAppointmentDto,
  CreateClientCashlessAppointmentDto,
  CreateOnsiteAppointmentDto,
  CreateWalkInAppointmentDto,
} from "src/core/dto/appointment/appointment.create.dto";
import {
  RescheduleAppointmentDto,
  UpdateAppointmentStatusDto,
} from "src/core/dto/appointment/appointment.update.dtos";
import { AppointmentViewModel } from "src/core/view-model/appointment.view-model";
import { Appointment } from "src/shared/entities/Appointment";
import { AppointmentStatus } from "src/shared/entities/AppointmentStatus";
import { ClientAppointment } from "src/shared/entities/ClientAppointment";
import { Clients } from "src/shared/entities/Clients";
import { ConsultaionType } from "src/shared/entities/ConsultaionType";
import { Payment } from "src/shared/entities/Payment";
import { PaymentType } from "src/shared/entities/PaymentType";
import { Pet } from "src/shared/entities/Pet";
import { PetAppointment } from "src/shared/entities/PetAppointment";
import { ServiceType } from "src/shared/entities/ServiceType";
import { Staff } from "src/shared/entities/Staff";
import { Users } from "src/shared/entities/Users";
import { In, Repository } from "typeorm";

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>
  ) {}

  async findAll() {
    try {
      const query = <Appointment[]>await this.appointmentRepo.manager
        .createQueryBuilder("Appointment", "a")
        //staff
        .leftJoinAndSelect("a.staff", "s")
        .leftJoinAndSelect("s.user", "u")
        //service
        .leftJoinAndSelect("a.serviceType", "st")
        //consultation
        .leftJoinAndSelect("a.consultaionType", "ct")
        //status
        .leftJoinAndSelect("a.appointmentStatus", "as")
        //payments
        .leftJoinAndSelect("a.payments", "ap")
        //mapping client
        .leftJoinAndSelect("a.clientAppointment", "ca")
        .leftJoinAndSelect("ca.client", "cl")
        .orderBy("a.appointmentDate", "DESC")
        .getMany();

      return query.map((a: Appointment) => {
        return new AppointmentViewModel(a);
      });
    } catch (e) {
      throw e;
    }
  }

  async findByFilter(
    advanceSearch: boolean,
    keyword: string,
    isWalkIn: boolean,
    clientName: string,
    vetName: string,
    status: string[],
    serviceType: string[],
    consultaionType: string[],
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    appointmentDateFrom: Date,
    appointmentDateTo: Date
  ) {
    try {
      const params: any = {
        keyword: `%${keyword}%`,
        status:
          status.length === 0
            ? ["Pending", "Approved", "Completed", "Cancelled"]
            : status,
      };

      let query = this.appointmentRepo.manager
        .createQueryBuilder("Appointment", "a")
        //staff
        .leftJoinAndSelect("a.staff", "s")
        //service
        .leftJoinAndSelect("a.serviceType", "st")
        //consultation
        .leftJoinAndSelect("a.consultaionType", "ct")
        //status
        .leftJoinAndSelect("a.appointmentStatus", "as")
        //payments
        .leftJoinAndSelect("a.payments", "ap")
        //mapping client
        .leftJoinAndSelect("a.clientAppointment", "ca")
        .leftJoinAndSelect("ca.client", "cl");
      if (advanceSearch) {
        if (
          appointmentDateFrom instanceof Date &&
          appointmentDateFrom.toDateString() !== "Invalid Date" &&
          appointmentDateTo instanceof Date &&
          appointmentDateTo.toDateString() !== "Invalid Date"
        ) {
          query = query.andWhere(
            "a.appointmentDate between :appointmentDateFrom and :appointmentDateTo"
          );
          params.appointmentDateFrom =
            moment(appointmentDateFrom).format("YYYY-MM-DD");
          params.appointmentDateTo =
            moment(appointmentDateTo).format("YYYY-MM-DD");
        }
        if (!isWalkIn) {
          query = query
            .orWhere("ISNULL(cl.firstName, '') like :clientName")
            .orWhere("ISNULL(cl.middleName, '') like :clientName")
            .orWhere("ISNULL(cl.lastName, '') like :clientName");
          params.clientName = `%${clientName}%`;
        } else {
          query = query.andWhere("a.walkInAppointmentNotes like :clientName");
          query = query.andWhere("a.isWalkIn = :isWalkIn");
          params.clientName = `%${clientName}%`;
          params.isWalkIn = isWalkIn;
        }
        query = query.andWhere("s.fullName like :vetName");
        params.vetName = `%${vetName}%`;
        if (serviceType.length > 0) {
          query = query.andWhere("st.name IN(:...serviceType)");
          params.serviceType = serviceType;
        }
        if (consultaionType.length > 0) {
          query = query.andWhere("ct.name IN(:...consultaionType)");
          params.consultaionType = consultaionType;
        }

        query = query
          .andWhere("as.name IN(:...status)")
          .orderBy("as.appointmentStatusId", "ASC")
          .addOrderBy("a.appointmentDate", "ASC");
      } else {
        query = query
          .orWhere("a.appointmentId like :keyword")
          .orWhere("a.appointmentDate like :keyword")
          .orWhere("a.walkInAppointmentNotes like :keyword")
          .orWhere("st.name like :keyword")
          .orWhere("ct.name like :keyword")
          .orWhere("s.firstName like :keyword")
          .orWhere("s.middleName like :keyword")
          .orWhere("s.lastName like :keyword")
          .orderBy("as.appointmentStatusId", "ASC")
          .addOrderBy("a.appointmentDate", "ASC");
      }
      query = query.setParameters(params);

      return <AppointmentViewModel[]>(await query.getMany()).map(
        (a: Appointment) => {
          return new AppointmentViewModel(a);
        }
      );
    } catch (e) {
      throw e;
    }
  }

  async getClientAppointmentsByStatus(clientId: string, status: string[]) {
    try {
      const params: any = {
        clientId,
        status:
          status.length === 0
            ? ["Pending", "Approved", "Completed", "Cancelled"]
            : status,
      };

      let query = this.appointmentRepo.manager
        .createQueryBuilder("Appointment", "a")
        //staff
        .leftJoinAndSelect("a.staff", "s")
        //service
        .leftJoinAndSelect("a.serviceType", "st")
        //consultation
        .leftJoinAndSelect("a.consultaionType", "ct")
        //status
        .leftJoinAndSelect("a.appointmentStatus", "as")
        //payments
        .leftJoinAndSelect("a.payments", "ap")
        //mapping client
        .leftJoinAndSelect("a.clientAppointment", "ca")
        .leftJoinAndSelect("ca.client", "cl")
        .where("cl.clientId = :clientId")
        .andWhere("as.name IN(:...status)");
      query = query.setParameters(params);

      return <AppointmentViewModel[]>(await query.getMany()).map(
        (a: Appointment) => {
          return new AppointmentViewModel(a);
        }
      );
    } catch (e) {
      throw e;
    }
  }

  async findOne(options?: any) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const query = <Appointment>await this.appointmentRepo.manager
        .createQueryBuilder("Appointment", "a")
        //staff
        .leftJoinAndSelect("a.staff", "s")
        .leftJoinAndSelect("s.user", "u")
        //service
        .leftJoinAndSelect("a.serviceType", "st")
        //consultation
        .leftJoinAndSelect("a.consultaionType", "ct")
        //status
        .leftJoinAndSelect("a.appointmentStatus", "as")
        //payments
        .leftJoinAndSelect("a.payments", "ap")
        .leftJoinAndSelect("ap.paymentType", "apt")
        //mapping client
        .leftJoinAndSelect("a.clientAppointment", "ca")
        .leftJoinAndSelect("ca.client", "cl")
        //mapping pet
        .leftJoinAndSelect("a.petAppointment", "pa")
        .leftJoinAndSelect("pa.pet", "p")
        .leftJoinAndSelect("p.petCategory", "pc")
        .leftJoinAndSelect("pc.petType", "pt")
        .where(options)
        .getOne();
      return new AppointmentViewModel(query);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async findById(appointmentId: string) {
    try {
      const appointment = await this.findOne({ appointmentId });
      if (!appointment) {
        throw new HttpException("Appointment not found", HttpStatus.NOT_FOUND);
      }
      return appointment;
    } catch (e) {
      throw e;
    }
  }

  async createClientAppointment(dto: CreateClientAppointmentDto) {
    try {
      return await this.appointmentRepo.manager.transaction(
        async (entityManager) => {
          const newAppointment = new Appointment();
          const appointmentDate = moment(
            `${moment(new Date(dto.appointmentDate)).format("YYYY-MM-DD")} ${
              dto.time
            }`
          ).format("YYYY-MM-DD h:mm:ss a");
          newAppointment.appointmentDate = new Date(appointmentDate);
          const service = await entityManager.findOne(ServiceType, {
            where: { serviceTypeId: dto.serviceTypeId },
          });
          if (!service) {
            throw new HttpException(
              "Service not found!",
              HttpStatus.BAD_REQUEST
            );
          }
          newAppointment.comments = dto.comments;
          newAppointment.timeStart = moment(new Date(appointmentDate)).format(
            "h:mm:ss a"
          );
          newAppointment.timeEnd = moment(
            addHours(service.durationInHours, new Date(appointmentDate))
          ).format("h:mm:ss a");
          newAppointment.isWalkIn = false;
          newAppointment.serviceType = service;
          const vet = await entityManager.findOne(Staff, {
            where: { staffid: dto.veterenarianId },
          });
          newAppointment.staff = vet;
          newAppointment.consultaionType = new ConsultaionType();
          newAppointment.consultaionType.consultaionTypeId =
            dto.consultaionTypeId;
          const appointment = await entityManager.save(
            Appointment,
            newAppointment
          );
          const newClientAppointment = new ClientAppointment();
          newClientAppointment.appointment = appointment;
          newClientAppointment.client = await entityManager.findOne(Clients, {
            where: { clientId: dto.clientId },
          });
          const clientAppointment = await entityManager.save(
            ClientAppointment,
            newClientAppointment
          );
          const newPetAppointment = new PetAppointment();
          newPetAppointment.appointment = appointment;
          newPetAppointment.pet = await entityManager.findOne(Pet, {
            where: { petId: dto.petId },
          });
          return await entityManager.save(PetAppointment, newPetAppointment);
        }
      );
    } catch (e) {
      throw e;
    }
  }

  async createClientCashlessAppointment(
    dto: CreateClientCashlessAppointmentDto
  ) {
    try {
      return await this.appointmentRepo.manager.transaction(
        async (entityManager) => {
          const newAppointment = new Appointment();
          const appointmentDate = moment(
            `${moment(new Date(dto.appointmentDate)).format("YYYY-MM-DD")} ${
              dto.time
            }`
          ).format("YYYY-MM-DD h:mm:ss a");
          newAppointment.appointmentDate = new Date(appointmentDate);
          newAppointment.comments = dto.comments;
          const service = await entityManager.findOne(ServiceType, {
            where: { serviceTypeId: dto.serviceTypeId },
          });
          if (!service) {
            throw new HttpException(
              "Service not found!",
              HttpStatus.BAD_REQUEST
            );
          }
          newAppointment.timeStart = moment(new Date(appointmentDate)).format(
            "h:mm:ss a"
          );
          newAppointment.timeEnd = moment(
            addHours(service.durationInHours, new Date(appointmentDate))
          ).format("h:mm:ss a");
          newAppointment.isWalkIn = false;
          newAppointment.serviceType = service;
          const vet = await entityManager.findOne(Staff, {
            where: { staffid: dto.veterenarianId },
          });
          newAppointment.staff = vet;
          newAppointment.consultaionType = new ConsultaionType();
          newAppointment.consultaionType.consultaionTypeId =
            dto.consultaionTypeId;
          const appointment = await entityManager.save(
            Appointment,
            newAppointment
          );
          const addPayment = new Payment();
          addPayment.paymentDate = dto.paymentDate;
          addPayment.paymentType = await entityManager.findOne(PaymentType, {
            where: { paymentTypeId: PaymentTypeEnum.GCASH.toString() },
          });
          addPayment.appointment = appointment;
          const payment = await entityManager.save(Payment, addPayment);
          if (!payment) {
            throw new HttpException(
              "Error adding payments!",
              HttpStatus.BAD_REQUEST
            );
          }
          const newClientAppointment = new ClientAppointment();
          newClientAppointment.appointment = appointment;
          newClientAppointment.client = await entityManager.findOne(Clients, {
            where: { clientId: dto.clientId },
          });
          const clientAppointment = await entityManager.save(
            ClientAppointment,
            newClientAppointment
          );
          const newPetAppointment = new PetAppointment();
          newPetAppointment.appointment = appointment;
          newPetAppointment.pet = await entityManager.findOne(Pet, {
            where: { petId: dto.petId },
          });
          return await entityManager.save(PetAppointment, newPetAppointment);
        }
      );
    } catch (e) {
      throw e;
    }
  }

  async createOnsiteAppointment(dto: CreateOnsiteAppointmentDto) {
    try {
      return await this.appointmentRepo.manager.transaction(
        async (entityManager) => {
          const newAppointment = new Appointment();
          const appointmentDate = moment(
            `${moment(new Date(dto.appointmentDate)).format("YYYY-MM-DD")} ${
              dto.time
            }`
          ).format("YYYY-MM-DD h:mm:ss a");
          newAppointment.appointmentDate = new Date(appointmentDate);
          newAppointment.comments = dto.comments;
          const service = await entityManager.findOne(ServiceType, {
            where: { serviceTypeId: dto.serviceTypeId },
          });
          if (!service) {
            throw new HttpException(
              "Service not found!",
              HttpStatus.BAD_REQUEST
            );
          }
          newAppointment.timeStart = moment(new Date(appointmentDate)).format(
            "h:mm:ss a"
          );
          newAppointment.timeEnd = moment(
            addHours(service.durationInHours, new Date(appointmentDate))
          ).format("h:mm:ss a");
          newAppointment.isWalkIn = false;
          newAppointment.serviceType = service;
          const vet = await entityManager.findOne(Staff, {
            where: { staffid: dto.veterenarianId },
          });
          newAppointment.staff = vet;
          newAppointment.consultaionType = new ConsultaionType();
          newAppointment.consultaionType.consultaionTypeId = "1";
          const appointment = await entityManager.save(
            Appointment,
            newAppointment
          );
          const addPayment = new Payment();
          addPayment.paymentDate = dto.paymentDate;
          addPayment.paymentType = await entityManager.findOne(PaymentType, {
            where: { paymentTypeId: dto.paymentTypeId },
          });
          addPayment.appointment = appointment;
          const payment = await entityManager.save(Payment, addPayment);
          if (!payment) {
            throw new HttpException(
              "Error adding payments!",
              HttpStatus.BAD_REQUEST
            );
          }
          const newClientAppointment = new ClientAppointment();
          newClientAppointment.appointment = appointment;
          newClientAppointment.client = await entityManager.findOne(Clients, {
            where: { clientId: dto.clientId },
          });
          const clientAppointment = await entityManager.save(
            ClientAppointment,
            newClientAppointment
          );
          const newPetAppointment = new PetAppointment();
          newPetAppointment.appointment = appointment;
          newPetAppointment.pet = await entityManager.findOne(Pet, {
            where: { petId: dto.petId },
          });
          return await entityManager.save(PetAppointment, newPetAppointment);
        }
      );
    } catch (e) {
      throw e;
    }
  }

  async createWalkInAppointment(dto: CreateWalkInAppointmentDto) {
    try {
      return await this.appointmentRepo.manager.transaction(
        async (entityManager) => {
          const newAppointment = new Appointment();
          const appointmentDate = moment(
            `${moment(new Date(dto.appointmentDate)).format("YYYY-MM-DD")} ${
              dto.time
            }`
          ).format("YYYY-MM-DD h:mm:ss a");
          newAppointment.appointmentDate = new Date(appointmentDate);
          const service = await entityManager.findOne(ServiceType, {
            where: { serviceTypeId: dto.serviceTypeId },
          });

          if (!service) {
            throw new HttpException(
              "Service not found!",
              HttpStatus.BAD_REQUEST
            );
          }
          newAppointment.comments = dto.comments;
          newAppointment.timeStart = moment(new Date(appointmentDate)).format(
            "h:mm:ss a"
          );
          newAppointment.timeEnd = moment(
            addHours(service.durationInHours, new Date(appointmentDate))
          ).format("h:mm:ss a");
          newAppointment.isWalkIn = true;
          newAppointment.walkInAppointmentNotes = `Client name: ${dto.clientName} \n Pet name: ${dto.petName}`;
          newAppointment.serviceType = service;
          const vet = await entityManager.findOne(Staff, {
            where: { staffid: dto.veterenarianId },
          });
          newAppointment.staff = vet;
          newAppointment.consultaionType = new ConsultaionType();
          newAppointment.consultaionType.consultaionTypeId = "1";
          const appointment = await entityManager.save(
            Appointment,
            newAppointment
          );
          const addPayment = new Payment();
          addPayment.paymentDate = dto.paymentDate;
          addPayment.paymentType = new PaymentType();
          addPayment.paymentType.paymentTypeId = dto.paymentTypeId;
          addPayment.appointment = appointment;
          const payment = await entityManager.save(Payment, addPayment);
          if (!payment) {
            throw new HttpException(
              "Error adding payments!",
              HttpStatus.BAD_REQUEST
            );
          }
          return await entityManager.save(Appointment, appointment);
        }
      );
    } catch (e) {
      throw e;
    }
  }

  async updateSchedule(dto: RescheduleAppointmentDto) {
    try {
      const { appointmentId } = dto;
      return await this.appointmentRepo.manager.transaction(
        async (entityManager) => {
          const appointment = await entityManager.findOne(Appointment, {
            where: { appointmentId },
            relations: ["appointmentStatus", "serviceType"],
          });
          if (
            appointment.appointmentStatus.appointmentStatusId !==
            AppointmentStatusEnum.PENDING.toString()
          ) {
            throw new HttpException(
              "Rescheduling only allowed to pending appointments",
              HttpStatus.BAD_REQUEST
            );
          }

          const appointmentDate = moment(
            `${moment(new Date(dto.appointmentDate)).format("YYYY-MM-DD")} ${
              dto.time
            }`
          ).format("YYYY-MM-DD h:mm:ss a");
          appointment.appointmentDate = new Date(appointmentDate);
          const service = await entityManager.findOne(ServiceType, {
            where: { serviceTypeId: appointment.serviceType.serviceTypeId },
          });
          appointment.timeStart = moment(new Date(appointmentDate)).format(
            "h:mm:ss a"
          );
          appointment.timeEnd = moment(
            addHours(service.durationInHours, new Date(appointmentDate))
          ).format("h:mm:ss a");
          return await entityManager.save(Appointment, appointment);
        }
      );
    } catch (e) {
      throw e;
    }
  }

  async updateStatus(dto: UpdateAppointmentStatusDto) {
    try {
      const { appointmentId } = dto;
      return await this.appointmentRepo.manager.transaction(
        async (entityManager) => {
          const appointment = await entityManager.findOne(Appointment, {
            where: { appointmentId },
            relations: ["appointmentStatus"],
          });
          if (
            appointment.appointmentStatus.appointmentStatusId !==
              AppointmentStatusEnum.PENDING.toString() &&
            dto.appointmentStatusId === AppointmentStatusEnum.PENDING.toString()
          ) {
            throw new HttpException(
              "Unable to change status, appointment is being processed",
              HttpStatus.BAD_REQUEST
            );
          }
          if (
            appointment.appointmentStatus.appointmentStatusId ===
              AppointmentStatusEnum.PENDING.toString() &&
            dto.appointmentStatusId ===
              AppointmentStatusEnum.COMPLETED.toString()
          ) {
            throw new HttpException(
              "Unable to change status, please approved appointment",
              HttpStatus.BAD_REQUEST
            );
          }
          if (
            appointment.appointmentStatus.appointmentStatusId ===
              AppointmentStatusEnum.COMPLETED.toString() &&
            dto.appointmentStatusId ===
              AppointmentStatusEnum.APPROVED.toString()
          ) {
            throw new HttpException(
              "Unable to change status, appointment is already completed",
              HttpStatus.BAD_REQUEST
            );
          }
          if (
            appointment.appointmentStatus.appointmentStatusId ===
              AppointmentStatusEnum.CANCELLED.toString() &&
            dto.appointmentStatusId ===
              AppointmentStatusEnum.COMPLETED.toString()
          ) {
            throw new HttpException(
              "Unable to change status, appointment is already cancelled",
              HttpStatus.BAD_REQUEST
            );
          }
          if (
            appointment.appointmentStatus.appointmentStatusId ===
              AppointmentStatusEnum.COMPLETED.toString() &&
            dto.appointmentStatusId ===
              AppointmentStatusEnum.CANCELLED.toString()
          ) {
            throw new HttpException(
              "Unable to change status, appointment is already completed",
              HttpStatus.BAD_REQUEST
            );
          }
          appointment.appointmentStatus = await entityManager.findOne(
            AppointmentStatus,
            {
              where: { appointmentStatusId: dto.appointmentStatusId },
            }
          );
          return await entityManager.save(Appointment, appointment);
        }
      );
    } catch (e) {
      throw e;
    }
  }
}

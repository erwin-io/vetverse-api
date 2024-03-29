import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { isEmpty } from "class-validator";
// import moment from "moment";
import * as moment from "moment";
import { ConsultaionTypeEnum } from "src/common/enums/consultation-type.enum";
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
  AddAttachmentFileDto,
  RescheduleAppointmentDto,
  UpdateAppointmentConferencePeer,
  UpdateAppointmentStatusDto,
  UpdateDiagnosisAndTreatment,
} from "src/core/dto/appointment/appointment.update.dtos";
import { AppointmentViewModel } from "src/core/view-model/appointment.view-model";
import { Appointment } from "src/shared/entities/Appointment";
import { AppointmentStatus } from "src/shared/entities/AppointmentStatus";
import { ClientAppointment } from "src/shared/entities/ClientAppointment";
import { Clients } from "src/shared/entities/Clients";
import { ConsultaionType } from "src/shared/entities/ConsultaionType";
import { Notifications } from "src/shared/entities/Notifications";
import { Payment } from "src/shared/entities/Payment";
import { PaymentType } from "src/shared/entities/PaymentType";
import { Pet } from "src/shared/entities/Pet";
import { PetAppointment } from "src/shared/entities/PetAppointment";
import { PetType } from "src/shared/entities/PetType";
import { ServiceType } from "src/shared/entities/ServiceType";
import { Staff } from "src/shared/entities/Staff";
import { Users } from "src/shared/entities/Users";
import { In, IsNull, Repository } from "typeorm";
import { isNullOrUndefined } from "util";
import {
  NotificationTitleConstant,
  NotificationDescriptionConstant,
} from "../common/constant/notifications.constant";
import { IPaginationOptions, paginate } from "nestjs-typeorm-paginate";
import { FirebaseProvider } from "src/core/provider/firebase/firebase-provider";
import { MessagingDevicesResponse } from "firebase-admin/lib/messaging/messaging-api";
import { ReminderService } from "./reminder.service";
import { Reminder } from "src/shared/entities/Reminder";
import { AppointmentAttachments } from "src/shared/entities/AppointmentAttachments";
import { Files } from "src/shared/entities/Files";
import { v4 as uuid } from "uuid";
import { extname } from "path";
import { DiagnosisAttachments } from "src/shared/entities/DiagnosisAttachments";
import { NotificationTypeEnum } from "src/common/enums/notifications-type.enum";

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
    private firebaseProvoder: FirebaseProvider,
    private reminderService: ReminderService
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
          query = query
            .where(
              "a.appointmentDate between :appointmentDateFrom and :appointmentDateTo"
            )
            .andWhere("as.name IN(:...status)");
          params.appointmentDateFrom =
            moment(appointmentDateFrom).format("YYYY-MM-DD");
          params.appointmentDateTo =
            moment(appointmentDateTo).format("YYYY-MM-DD");
        }
        if (!isWalkIn) {
          query.andWhere(
            "CONCAT(cl.firstName, ' ', cl.middleName, ' ', cl.lastName) LIKE :clientName"
          );
          params.clientName = `%${clientName}%`;
        } else {
          query = query.andWhere("a.walkInAppointmentNotes like :clientName");
          query = query.andWhere("a.isWalkIn = :isWalkIn");
          params.clientName = `%${clientName}%`;
          params.isWalkIn = isWalkIn;
        }
        query.andWhere(
          "CONCAT(s.firstName, ' ', s.middleName, ' ', s.lastName) LIKE :vetName"
        );
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
          .orderBy("as.appointmentStatusId", "ASC")
          .addOrderBy("a.appointmentDate", "ASC");
      } else {
        query = query
          .where("a.appointmentId like :keyword")
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

      return <AppointmentViewModel[]>(
        await query.setParameters(params).getMany()
      ).map((a: Appointment) => {
        return new AppointmentViewModel(a);
      });
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
        .leftJoinAndSelect("s.user", "su")
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
        .leftJoinAndSelect("cl.user", "cu")
        //mapping pet
        .leftJoinAndSelect("a.petAppointment", "pa")
        .leftJoinAndSelect("pa.pet", "p")
        .leftJoinAndSelect("p.petCategory", "pc")
        .leftJoinAndSelect("pc.petType", "pt")
        .leftJoinAndSelect("p.gender", "pg")
        .leftJoinAndSelect("a.appointmentAttachments", "aa")
        .leftJoinAndSelect("aa.file", "aaf")
        .leftJoinAndSelect("a.diagnosisAttachments", "da")
        .leftJoinAndSelect("da.file", "daf")
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

  async getAppointmentsForADay(dateString: string) {
    try {
      dateString = moment(dateString).format("YYYY-MM-DD");
      const dateFilter = {
        from: new Date(
          moment(`${dateString} 00:00`).format("YYYY-MM-DD HH:mm")
        ),
        to: new Date(moment(`${dateString} 23:59`).format("YYYY-MM-DD HH:mm")),
      };
      const query = await this.appointmentRepo.manager
        .createQueryBuilder("Appointment", "a")
        .leftJoinAndSelect("a.appointmentStatus", "as")
        .where("a.appointmentDate between :from and :to", dateFilter)
        .andWhere("as.name IN(:...status)", {
          status: ["Pending", "Approved"],
        })
        .getMany();
      return <AppointmentViewModel[]>query.map((a: Appointment) => {
        return new AppointmentViewModel(a);
      });
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
          newAppointment.serviceRate = service.price;
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
          if (!clientAppointment) {
            throw new HttpException(
              "Error saving Client appointment!",
              HttpStatus.BAD_REQUEST
            );
          }
          const newPetAppointment = new PetAppointment();
          newPetAppointment.appointment = appointment;
          newPetAppointment.pet = await entityManager.findOne(Pet, {
            where: { petId: dto.petId },
          });
          if (dto.consultaionTypeId === ConsultaionTypeEnum.VIDEO.toString()) {
            let reminder = new Reminder();
            reminder.isAppointment = true;
            const reminderDate: any = newAppointment.appointmentDate;
            const MS_PER_MINUTE = 60000;
            const MS_PRIOR_REMINDER = 20;
            reminder.title =
              NotificationTitleConstant.APPOINTMENT_VIDEO_REMINDER;
            reminder.description =
              NotificationDescriptionConstant.APPOINTMENT_VIDEO_REMINDER.replace(
                "{0}",
                `${moment(newAppointment.appointmentDate).format(
                  "MMMM DD, YYYY"
                )} @ ${moment(newAppointment.appointmentDate).format(
                  "hh:mm a"
                )}`
              );
            reminder.dueDate = new Date(
              reminderDate + MS_PRIOR_REMINDER * MS_PER_MINUTE
            );
            reminder.appointment = appointment;
            reminder = await entityManager.save(Reminder, reminder);
            if (!reminder) {
              throw new HttpException(
                "Error saving reminder!",
                HttpStatus.BAD_REQUEST
              );
            }
          }
          const petAppointment = await entityManager.save(
            PetAppointment,
            newPetAppointment
          );
          if (!petAppointment) {
            throw new HttpException(
              "Error saving pet appoimtment!",
              HttpStatus.BAD_REQUEST
            );
          }
          if (
            dto.appointmentAttachments &&
            dto.appointmentAttachments.length > 0
          ) {
            for (const attachment of dto.appointmentAttachments) {
              if (attachment) {
                let appointmentAttachment = new AppointmentAttachments();
                const newFileName: string = uuid();
                const bucket = this.firebaseProvoder.app.storage().bucket();

                const file = new Files();
                file.fileName = `${newFileName}${extname(attachment.fileName)}`;

                const bucketFile = bucket.file(
                  `appointments/attachments/${newFileName}${extname(
                    attachment.fileName
                  )}`
                );
                const img = Buffer.from(attachment.data, "base64");
                await bucketFile.save(img).then(async () => {
                  const url = await bucketFile.getSignedUrl({
                    action: "read",
                    expires: "03-09-2500",
                  });
                  file.url = url[0];
                  appointmentAttachment.file = await entityManager.save(
                    Files,
                    file
                  );
                });
                appointmentAttachment.appointment = appointment;
                appointmentAttachment = await entityManager.save(
                  AppointmentAttachments,
                  appointmentAttachment
                );
              }
            }
          }
          return await entityManager.findOne(Appointment, {
            where: { appointmentId: appointment.appointmentId },
          });
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
          newAppointment.isPaid = true;
          newAppointment.serviceRate = service.price;
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
          if (!clientAppointment) {
            throw new HttpException(
              "Error saving Client appointment!",
              HttpStatus.BAD_REQUEST
            );
          }
          const newPetAppointment = new PetAppointment();
          newPetAppointment.appointment = appointment;
          newPetAppointment.pet = await entityManager.findOne(Pet, {
            where: { petId: dto.petId },
          });
          if (dto.consultaionTypeId === ConsultaionTypeEnum.VIDEO.toString()) {
            let reminder = new Reminder();
            reminder.isAppointment = true;
            const reminderDate: any = newAppointment.appointmentDate;
            const MS_PER_MINUTE = 60000;
            const MS_PRIOR_REMINDER = 20;
            reminder.title =
              NotificationTitleConstant.APPOINTMENT_VIDEO_REMINDER;
            reminder.description =
              NotificationDescriptionConstant.APPOINTMENT_VIDEO_REMINDER.replace(
                "{0}",
                `${moment(newAppointment.appointmentDate).format(
                  "MMMM DD, YYYY"
                )} @ ${moment(newAppointment.appointmentDate).format(
                  "hh:mm a"
                )}`
              );
            reminder.dueDate = new Date(
              reminderDate + MS_PRIOR_REMINDER * MS_PER_MINUTE
            );
            reminder.appointment = appointment;
            reminder = await entityManager.save(Reminder, reminder);
            if (!reminder) {
              throw new HttpException(
                "Error saving reminder!",
                HttpStatus.BAD_REQUEST
              );
            }
          }
          if (
            dto.appointmentAttachments &&
            dto.appointmentAttachments.length > 0
          ) {
            for (const attachment of dto.appointmentAttachments) {
              if (attachment) {
                let appointmentAttachment = new AppointmentAttachments();
                const newFileName: string = uuid();
                const bucket = this.firebaseProvoder.app.storage().bucket();

                const file = new Files();
                file.fileName = `${newFileName}${extname(attachment.fileName)}`;

                const bucketFile = bucket.file(
                  `appointments/attachments/${newFileName}${extname(
                    attachment.fileName
                  )}`
                );
                const img = Buffer.from(attachment.data, "base64");
                await bucketFile.save(img).then(async () => {
                  const url = await bucketFile.getSignedUrl({
                    action: "read",
                    expires: "03-09-2500",
                  });
                  file.url = url[0];
                  appointmentAttachment.file = await entityManager.save(
                    Files,
                    file
                  );
                });
                appointmentAttachment.appointment = appointment;
                appointmentAttachment = await entityManager.save(
                  AppointmentAttachments,
                  appointmentAttachment
                );
              }
            }
          }
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
          newAppointment.serviceRate = service.price;
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
          appointment.isPaid = true;
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
          if (
            dto.appointmentAttachments &&
            dto.appointmentAttachments.length > 0
          ) {
            for (const attachment of dto.appointmentAttachments) {
              if (attachment) {
                let appointmentAttachment = new AppointmentAttachments();
                const newFileName: string = uuid();
                const bucket = this.firebaseProvoder.app.storage().bucket();

                const file = new Files();
                file.fileName = `${newFileName}${extname(attachment.fileName)}`;

                const bucketFile = bucket.file(
                  `appointments/attachments/${newFileName}${extname(
                    attachment.fileName
                  )}`
                );
                const img = Buffer.from(attachment.data, "base64");
                await bucketFile.save(img).then(async () => {
                  const url = await bucketFile.getSignedUrl({
                    action: "read",
                    expires: "03-09-2500",
                  });
                  file.url = url[0];
                  appointmentAttachment.file = await entityManager.save(
                    Files,
                    file
                  );
                });
                appointmentAttachment.appointment = appointment;
                appointmentAttachment = await entityManager.save(
                  AppointmentAttachments,
                  appointmentAttachment
                );
              }
            }
          }
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
          newAppointment.serviceRate = service.price;
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
          appointment.isPaid = true;
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
          let appointment = await entityManager.findOne(Appointment, {
            where: { appointmentId },
            relations: ["appointmentStatus", "serviceType", "consultaionType"],
          });
          const clientAppointment = await entityManager.findOne(
            ClientAppointment,
            {
              where: { appointmentId },
              relations: ["appointment", "client"],
            }
          );
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
          appointment = await entityManager.save(Appointment, appointment);
          if (!appointment.isWalkIn) {
            let notif = new Notifications();
            notif.notificationTypeId = NotificationTypeEnum.APPOINTMENT.toString();
            notif.appointment = appointment;
            notif.client = await entityManager.findOne(Clients, {
              where: { clientId: clientAppointment.client.clientId },
            });
            notif.title = NotificationTitleConstant.APPOINTMENT_RESCHEDULED;
            notif.date = new Date();
            notif.description =
              NotificationDescriptionConstant.APPOINTMENT_RESCHEDULED.replace(
                "{0}",
                `${appointment.serviceType.name}`
              ).replace(
                "{1}",
                `${moment(appointment.appointmentDate).format(
                  "MMM DD, YYYY"
                )} at ${appointment.timeStart} `
              );
            notif = await entityManager.save(Notifications, notif);
            if (!notif) {
              throw new HttpException(
                "Error adding notifications!",
                HttpStatus.BAD_REQUEST
              );
            } else {
              if (
                appointment.consultaionType.consultaionTypeId ===
                ConsultaionTypeEnum.VIDEO.toString()
              ) {
                let reminder = new Reminder();
                reminder.isAppointment = true;
                const reminderDate: any = appointment.appointmentDate;
                const MS_PER_MINUTE = 60000;
                const MS_PRIOR_REMINDER = 20;
                reminder.title =
                  NotificationTitleConstant.APPOINTMENT_VIDEO_REMINDER;
                reminder.description =
                  NotificationDescriptionConstant.APPOINTMENT_VIDEO_REMINDER.replace(
                    "{0}",
                    `${moment(appointment.appointmentDate).format(
                      "MMMM DD, YYYY"
                    )} @ ${moment(appointment.appointmentDate).format(
                      "hh:mm a"
                    )}`
                  );
                reminder.dueDate = new Date(
                  reminderDate + MS_PRIOR_REMINDER * MS_PER_MINUTE
                );
                reminder.appointment = appointment;
                reminder = await entityManager.save(Reminder, reminder);
                if (!reminder) {
                  throw new HttpException(
                    "Error saving reminder!",
                    HttpStatus.BAD_REQUEST
                  );
                }
              }

              const notificationId = notif.notificationId;
              notif = <Notifications>await entityManager
                .createQueryBuilder("Notifications", "n")
                .leftJoinAndSelect("n.client", "c")
                .leftJoinAndSelect("c.user", "u")
                .leftJoinAndSelect("n.appointment", "a")
                .where("n.notificationId = :notificationId", {
                  notificationId,
                })
                .getOne();
              if (
                notif.client.user.firebaseToken &&
                notif.client.user.firebaseToken !== ""
              ) {
                return await this.firebaseProvoder.app
                  .messaging()
                  .sendToDevice(
                    notif.client.user.firebaseToken,
                    {
                      notification: {
                        title: notif.title,
                        body: notif.description,
                        sound: "notif_alert",
                      },
                    },
                    {
                      priority: "high",
                      timeToLive: 60 * 24,
                      android: { sound: "notif_alert" },
                    }
                  )
                  .then((response: MessagingDevicesResponse) => {
                    console.log("Successfully sent message:", response);
                    return appointment;
                  })
                  .catch((error) => {
                    throw new HttpException(
                      `Error sending notif! ${error.message}`,
                      HttpStatus.BAD_REQUEST
                    );
                  });
              }
            }
          } else {
            return appointment;
          }
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
          let appointment = await entityManager.findOne(Appointment, {
            where: { appointmentId },
            relations: ["appointmentStatus", "serviceType"],
          });
          const clientAppointment = await entityManager.findOne(
            ClientAppointment,
            {
              where: { appointmentId },
              relations: ["appointment", "client"],
            }
          );
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
          appointment = await entityManager.save(Appointment, appointment);
          if (!appointment.isWalkIn) {
            let notif = new Notifications();
            notif.notificationTypeId = NotificationTypeEnum.APPOINTMENT.toString();
            notif.appointment = appointment;
            notif.date = new Date();
            notif.client = await entityManager.findOne(Clients, {
              where: { clientId: clientAppointment.client.clientId },
            });
            if (
              Number(dto.appointmentStatusId) === AppointmentStatusEnum.APPROVED
            ) {
              notif.title = NotificationTitleConstant.APPOINTMENT_APPROVED;
              notif.description =
                NotificationDescriptionConstant.APPOINTMENT_APPROVED.replace(
                  "{0}",
                  `on ${moment(appointment.appointmentDate).format(
                    "MMM DD, YYYY"
                  )} ${appointment.timeStart} for ${
                    appointment.serviceType.name
                  }`
                );
            } else if (
              Number(dto.appointmentStatusId) ===
              AppointmentStatusEnum.COMPLETED
            ) {
              notif.title = NotificationTitleConstant.APPOINTMENT_COMPLETED;
              notif.description =
                NotificationDescriptionConstant.APPOINTMENT_COMPLETED.replace(
                  "{0}",
                  `on ${moment(appointment.appointmentDate).format(
                    "MMM DD, YYYY"
                  )} for ${appointment.serviceType.name}`
                );
            } else if (
              Number(dto.appointmentStatusId) ===
              AppointmentStatusEnum.CANCELLED
            ) {
              if (dto.isUpdatedByClient) {
                let client = notif.client;
                client.lastCancelledDate = new Date();
                const numberOfCancelledAttempt =
                  Number(client.numberOfCancelledAttempt) + 1;
                client.numberOfCancelledAttempt =
                  numberOfCancelledAttempt.toString();
                client = await entityManager.save(Clients, client);
                if (!client) {
                  throw new HttpException(
                    "Error updating Clients!",
                    HttpStatus.BAD_REQUEST
                  );
                }
              }
              notif.title = NotificationTitleConstant.APPOINTMENT_CANCELLED;
              notif.description =
                NotificationDescriptionConstant.APPOINTMENT_CANCELLED.replace(
                  "{0}",
                  `on ${moment(appointment.appointmentDate).format(
                    "MMM DD, YYYY"
                  )} for ${appointment.serviceType.name}`
                );
            }
            if (!dto.isUpdatedByClient) {
              notif = await entityManager.save(Notifications, notif);
              if (!notif) {
                throw new HttpException(
                  "Error adding notifications!",
                  HttpStatus.BAD_REQUEST
                );
              } else {
                const notificationId = notif.notificationId;
                notif = <Notifications>await entityManager
                  .createQueryBuilder("Notifications", "n")
                  .leftJoinAndSelect("n.client", "c")
                  .leftJoinAndSelect("c.user", "u")
                  .leftJoinAndSelect("n.appointment", "a")
                  .where("n.notificationId = :notificationId", {
                    notificationId,
                  })
                  .getOne();
                if (
                  notif.client.user.firebaseToken &&
                  notif.client.user.firebaseToken !== ""
                ) {
                  return await this.firebaseProvoder.app
                    .messaging()
                    .sendToDevice(
                      notif.client.user.firebaseToken,
                      {
                        notification: {
                          title: notif.title,
                          body: notif.description,
                          sound: "notif_alert",
                        },
                      },
                      {
                        priority: "high",
                        timeToLive: 60 * 24,
                        android: { sound: "notif_alert" },
                      }
                    )
                    .then((response: MessagingDevicesResponse) => {
                      console.log("Successfully sent message:", response);
                      return appointment;
                    })
                    .catch((error) => {
                      throw new HttpException(
                        `Error sending notif! ${error.message}`,
                        HttpStatus.BAD_REQUEST
                      );
                    });
                }
              }
            } else {
              return appointment;
            }
          } else {
            return appointment;
          }
        }
      );
    } catch (e) {
      throw e;
    }
  }

  async updateAppointmentConferencePeer(dto: UpdateAppointmentConferencePeer) {
    try {
      const appointment = await this.appointmentRepo.findOne({
        where: { appointmentId: dto.appointmentId },
      });
      if (!appointment) {
        throw new HttpException(
          "Appointment not found",
          HttpStatus.BAD_REQUEST
        );
      }
      appointment.conferencePeerId = dto.conferencePeerId;
      return await this.appointmentRepo.save(appointment);
    } catch (e) {
      throw e;
    }
  }

  async updateAppointmentDiagnosisAndTreatment(
    dto: UpdateDiagnosisAndTreatment
  ) {
    try {
      return await this.appointmentRepo.manager.transaction(
        async (entityManager) => {
          let appointment = await entityManager.findOne(Appointment, {
            where: { appointmentId: dto.appointmentId },
            relations: ["serviceType", "clientAppointment"],
          });
          const clientAppointment = await entityManager.findOne(
            ClientAppointment,
            {
              where: { appointmentId: dto.appointmentId },
              relations: ["appointment", "client"],
            }
          );
          if (!appointment) {
            throw new HttpException(
              "Appointment not found",
              HttpStatus.BAD_REQUEST
            );
          }
          appointment.diagnosisAndTreatment = dto.diagnosisAndTreatment;
          appointment = await entityManager.save(Appointment, appointment);
          if (!appointment.isWalkIn) {
            let notif = new Notifications();
            notif.notificationTypeId = NotificationTypeEnum.APPOINTMENT.toString();
            notif.appointment = appointment;
            notif.client = await entityManager.findOne(Clients, {
              where: { clientId: clientAppointment.client.clientId },
            });
            notif.title =
              NotificationTitleConstant.APPOINTMENT_DIAGNOSIS_AND_TREATMENT;
            notif.date = new Date();
            notif.description =
              NotificationDescriptionConstant.APPOINTMENT_DIAGNOSIS_AND_TREATMENT.replace(
                "{0}",
                `on ${moment(appointment.appointmentDate).format(
                  "MMM DD, YYYY"
                )} ${appointment.timeStart} for ${appointment.serviceType.name}`
              );
            notif = await entityManager.save(Notifications, notif);
            if (!notif) {
              throw new HttpException(
                "Error adding notifications!",
                HttpStatus.BAD_REQUEST
              );
            } else {
              const notificationId = notif.notificationId;
              notif = <Notifications>await entityManager
                .createQueryBuilder("Notifications", "n")
                .leftJoinAndSelect("n.client", "c")
                .leftJoinAndSelect("c.user", "u")
                .leftJoinAndSelect("n.appointment", "a")
                .where("n.notificationId = :notificationId", {
                  notificationId,
                })
                .getOne();
              if (
                notif.client.user.firebaseToken &&
                notif.client.user.firebaseToken !== ""
              ) {
                return await this.firebaseProvoder.app
                  .messaging()
                  .sendToDevice(
                    notif.client.user.firebaseToken,
                    {
                      notification: {
                        title: notif.title,
                        body: notif.description,
                        sound: "notif_alert",
                      },
                    },
                    {
                      priority: "high",
                      timeToLive: 60 * 24,
                      android: { sound: "notif_alert" },
                    }
                  )
                  .then((response: MessagingDevicesResponse) => {
                    console.log("Successfully sent message:", response);
                    return appointment;
                  })
                  .catch((error) => {
                    throw new HttpException(
                      `Error sending notif! ${error.message}`,
                      HttpStatus.BAD_REQUEST
                    );
                  });
              }
            }
          } else {
            return appointment;
          }
        }
      );
    } catch (e) {
      throw e;
    }
  }

  async getAppointmentConferencePeer(appointmentId: string) {
    try {
      const appointment = await this.appointmentRepo.findOneBy({
        appointmentId,
      });
      if (!appointment) {
        throw new HttpException("Appointment not found", HttpStatus.NOT_FOUND);
      }
      return appointment.conferencePeerId;
    } catch (e) {
      throw e;
    }
  }

  async addAttachmentFile(dto: AddAttachmentFileDto) {
    try {
      return await this.appointmentRepo.manager.transaction( async(entityManager)=> {
        if(dto.data) {
          let appointmentAttachment = new AppointmentAttachments();
          const newFileName: string = uuid();
          const bucket = this.firebaseProvoder.app.storage().bucket();

          const file = new Files();
          file.fileName = `${newFileName}${extname(dto.fileName)}`;

          const bucketFile = bucket.file(
            `appointments/attachments/${newFileName}${extname(
              dto.fileName
            )}`
          );
          const img = Buffer.from(dto.data, "base64");
          await bucketFile.save(img).then(async () => {
            const url = await bucketFile.getSignedUrl({
              action: "read",
              expires: "03-09-2500",
            });
            file.url = url[0];
            appointmentAttachment.file = await entityManager.save(
              Files,
              file
            );
          });
          appointmentAttachment.appointment = await entityManager.findOneBy(Appointment, { appointmentId: dto.appointmentId });
          await entityManager.save(
            AppointmentAttachments,
            appointmentAttachment
          );
          return entityManager.find(AppointmentAttachments, { 
            where: { 
              appointment: { appointmentId: dto.appointmentId }
            },
            relations: ["file"]
          });
        } else {
          return [];
        }
      })
    } catch (e) {
      throw e;
    }
  }

  async addDiagnosisAttachmentFile(dto: AddAttachmentFileDto) {
    try {
      return await this.appointmentRepo.manager.transaction( async(entityManager)=> {
        if(dto.data) {
          let diagnosisAttachment = new DiagnosisAttachments();
          const newFileName: string = uuid();
          const bucket = this.firebaseProvoder.app.storage().bucket();

          const file = new Files();
          file.fileName = `${newFileName}${extname(dto.fileName)}`;

          const bucketFile = bucket.file(
            `appointments/diagnosis-attachment/${newFileName}${extname(
              dto.fileName
            )}`
          );
          const img = Buffer.from(dto.data, "base64");
          await bucketFile.save(img).then(async () => {
            const url = await bucketFile.getSignedUrl({
              action: "read",
              expires: "03-09-2500",
            });
            file.url = url[0];
            diagnosisAttachment.file = await entityManager.save(
              Files,
              file
            );
          });
          diagnosisAttachment.appointment = await entityManager.findOneBy(Appointment, { appointmentId: dto.appointmentId });
          await entityManager.save(
            DiagnosisAttachments,
            diagnosisAttachment
          );
          return entityManager.find(DiagnosisAttachments, { 
            where: { 
              appointment: { appointmentId: dto.appointmentId }
            },
            relations: ["file"]
          });
        } else {
          return [];
        }
      })
    } catch (e) {
      throw e;
    }
  }

  async removeAttachmentFile(appointmentAttachmentId: string) {
    try {
      return await this.appointmentRepo.manager.transaction( async(entityManager)=> {
        const appointmentAttachment = await entityManager.findOne(AppointmentAttachments, 
          { where: { appointmentAttachmentId}, relations: ["file", "appointment"] }, 
        );
        if(appointmentAttachment) {
          await entityManager.delete(AppointmentAttachments, { appointmentAttachmentId });
          const file = appointmentAttachment.file;
          await entityManager.delete(Files, { fileId: file.fileId });
          
          try {
            const bucket = this.firebaseProvoder.app.storage().bucket();
            const deleteFile = bucket.file(
              `appointments/attachments/${appointmentAttachment.file.fileName}`
            );
            deleteFile.delete();
          } catch (ex) {
            console.log(ex);
          }

          const appoimtment = appointmentAttachment.appointment;
          return entityManager.find(AppointmentAttachments, { 
            where: { 
              appointment: { appointmentId: appoimtment.appointmentId }
            },
            relations: ["file"]
          });
        } else {
          return [];
        }
      })
    } catch (e) {
      throw e;
    }
  }

  async removeDiagnosisAttachmentFile(diagnosisAttachmentsId: string) {
    try {
      return await this.appointmentRepo.manager.transaction( async(entityManager)=> {
        const diagnosisAttachment = await entityManager.findOne(DiagnosisAttachments, 
          { where: { diagnosisAttachmentsId }, relations: ["file", "appointment"] }, 
        );
        if(diagnosisAttachment) {
          await entityManager.delete(DiagnosisAttachments, { diagnosisAttachmentsId });
          const file = diagnosisAttachment.file;
          await entityManager.delete(Files, { fileId: file.fileId });
          
          try {
            const bucket = this.firebaseProvoder.app.storage().bucket();
            const deleteFile = bucket.file(
              `appointments/diagnosis-attachment/${diagnosisAttachment.file.fileName}`
            );
            deleteFile.delete();
          } catch (ex) {
            console.log(ex);
          }

          const appoimtment = diagnosisAttachment.appointment;
          return entityManager.find(DiagnosisAttachments, { 
            where: { 
              appointment: { appointmentId: appoimtment.appointmentId }
            },
            relations: ["file"]
          });
        } else {
          return [];
        }
      })
    } catch (e) {
      throw e;
    }
  }
}

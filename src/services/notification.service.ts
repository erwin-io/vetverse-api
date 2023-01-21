import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Notifications } from "src/shared/entities/Notifications";
import { Repository } from "typeorm";
import { IPaginationOptions, paginate } from "nestjs-typeorm-paginate";
import { Appointment } from "src/shared/entities/Appointment";
import { Clients } from "src/shared/entities/Clients";
import { EntityStatus } from "src/shared/entities/EntityStatus";
import { ClientAppointment } from "src/shared/entities/ClientAppointment";
import { NotificationTypeEnum } from "src/common/enums/notifications-type.enum";

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notifications)
    private readonly notificationsRepo: Repository<Notifications>
  ) {}
  async getAllByClientIdPage(clientId: string, options: IPaginationOptions) {
    const queryBuilder = this.notificationsRepo.manager
      .createQueryBuilder()
      .select("n")
      .from(Notifications, "n")
      .leftJoinAndSelect("n.appointment", "a")
      .leftJoinAndSelect("a.appointmentStatus", "as")
      .leftJoinAndSelect("n.client", "c")
      .where("n.clientId= :clientId", { clientId });
    queryBuilder.orderBy("n.notificationId", "DESC"); // Or whatever you need to do

    return paginate<Notifications>(queryBuilder, options);
  }

  async addAppointmentNotification(
    dto: {
      appointment: Appointment;
      client: Clients;
      date: Date;
      title: string;
      description: string;
    }[]
  ) {
    return await this.notificationsRepo.manager.transaction(
      async (entityManager) => {
        const notifications = dto.map((x) => {
          const notification = new Notifications();
          notification.appointment = x.appointment;
          notification.client = x.client;
          notification.date = x.date;
          notification.title = x.title;
          notification.description = x.description;
          notification.isRead = false;
          return notification;
        });
        const res = await entityManager
          .createQueryBuilder()
          .insert()
          .into(Notifications)
          .values(notifications)
          .execute();
        return res;
      }
    );
  }

  async addRemindersToAll(dto: {
    date: Date;
    title: string;
    description: string;
  }) {
    try {
      return await this.notificationsRepo.manager.transaction(
        async (entityManager) => {
          const clients = await entityManager.find(Clients, {
            where: {
              user: {
                entityStatus: { entityStatusId: "1" },
                enable: true,
              },
            },
            relations: ["user"],
          });
          const notifications = clients.map((x) => {
            const notification = new Notifications();
            notification.client = x;
            notification.date = dto.date;
            notification.title = dto.title;
            notification.description = dto.description;
            notification.isRead = false;
            notification.notificationTypeId =
              NotificationTypeEnum.ANNOUNCEMENTS.toString();
            return notification;
          });

          const res = await entityManager
            .createQueryBuilder()
            .insert()
            .into(Notifications)
            .values(notifications)
            .execute();
          return res;
        }
      );
    } catch (e) {
      throw e;
    }
  }

  async updateReadStatus(dto) {
    try {
      return await this.notificationsRepo.manager.transaction(
        async (entityManager) => {
          const notification = await entityManager.findOne(Notifications, {
            where: { notificationId: dto.notificationId },
            relations: ["client"],
          });
          if (!notification) {
            throw new HttpException(
              "Notification not found",
              HttpStatus.NOT_FOUND
            );
          }
          notification.isRead = true;
          await entityManager.save(notification);

          const isRead = false;
          const queryBuilder = entityManager
            .createQueryBuilder()
            .select("n")
            .from(Notifications, "n")
            .leftJoinAndSelect("n.appointment", "a")
            .leftJoinAndSelect("n.client", "c")
            .where("n.clientId = :clientId", {
              clientId: notification.client.clientId,
            })
            .andWhere("n.isRead = :isRead", { isRead });
          return { total: await queryBuilder.getCount() };
        }
      );
    } catch (e) {
      throw e;
    }
  }

  async getTotalUnreadByClientId(clientId: string) {
    const isRead = false;
    const queryBuilder = this.notificationsRepo.manager
      .createQueryBuilder()
      .select("n")
      .from(Notifications, "n")
      .leftJoinAndSelect("n.appointment", "a")
      .leftJoinAndSelect("n.client", "c")
      .where("n.clientId = :clientId", { clientId })
      .andWhere("n.isRead = :isRead", { isRead });
    return { total: await queryBuilder.getCount() };
  }
}

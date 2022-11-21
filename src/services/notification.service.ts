import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Notifications } from "src/shared/entities/Notifications";
import { Repository } from "typeorm";
import { IPaginationOptions, paginate } from "nestjs-typeorm-paginate";

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
      .leftJoinAndSelect("n.client", "c")
      .where("n.clientId= :clientId", { clientId });
    queryBuilder.orderBy("n.notificationId", "DESC"); // Or whatever you need to do

    return paginate<Notifications>(queryBuilder, options);
  }
  async updateReadStatus(dto) {
    try {
      return await this.notificationsRepo.manager.transaction(
        async (entityManager) => {
          const notification = await entityManager.findOne(Notifications, {
            where: { notificationId: dto.notificationId },
          });
          if (!notification) {
            throw new HttpException(
              "Notification not found",
              HttpStatus.NOT_FOUND
            );
          }
          notification.isRead = true;
          return await entityManager.save(notification);
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

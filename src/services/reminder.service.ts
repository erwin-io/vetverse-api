import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as moment from "moment";
import { CreateReminderDto } from "src/core/dto/reminder/reminder.create.dto";
import { Appointment } from "src/shared/entities/Appointment";
import { EntityStatus } from "src/shared/entities/EntityStatus";
import { Reminder } from "src/shared/entities/Reminder";
import { In, Repository } from "typeorm";

@Injectable()
export class ReminderService {
  constructor(
    @InjectRepository(Reminder)
    private readonly reminderRepo: Repository<Reminder>
  ) {}

  async findAll() {
    try {
      return await this.reminderRepo.findBy({
        entityStatus: { entityStatusId: "1" },
      });
    } catch (e) {
      throw e;
    }
  }

  async geAllReminderByDate(
    date: Date,
    isAppointment: boolean
  ): Promise<Reminder[]> {
    try {
      const today = new Date();
      const dueDateFrom = new Date(today.setDate(today.getDate() + 1));
      return <Reminder[]>await this.reminderRepo.manager
        .createQueryBuilder("Reminder", "r")
        .leftJoinAndSelect("r.entityStatus", "es")
        .leftJoinAndSelect("r.appointment", "a")
        .leftJoinAndSelect("a.clientAppointment", "ca")
        .leftJoinAndSelect("ca.client", "cl")
        .leftJoinAndSelect("cl.user", "u")
        .where("es.entityStatusId = :entityStatusId", { entityStatusId: "1" })
        .andWhere("r.isAppointment = :isAppointment", { isAppointment })
        .andWhere("r.dueDate <= :dueDateFrom", {
          dueDateFrom,
        })
        .getMany();
    } catch (e) {
      throw e;
    }
  }

  async findOne(options?: any) {
    try {
      const reminder = await this.reminderRepo.findOneBy(options);
      return reminder;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async findById(reminderId: string) {
    try {
      const reminder = await this.findOne({
        reminderId,
        entityStatus: { entityStatusId: "1" },
      });
      if (!reminder) {
        throw new HttpException("Reminder not found", HttpStatus.NOT_FOUND);
      }
      return reminder;
    } catch (e) {
      throw e;
    }
  }

  async add(createReminderDto: CreateReminderDto) {
    try {
      return await this.reminderRepo.manager.transaction(
        async (entityManager) => {
          const reminder = new Reminder();
          reminder.title = createReminderDto.title;
          reminder.description = createReminderDto.description;
          reminder.dueDate = createReminderDto.dueDate;
          if (
            createReminderDto.appointmentId &&
            createReminderDto.appointmentId !== ""
          ) {
            reminder.appointment = await entityManager.findOne(Appointment, {
              where: { appointmentId: createReminderDto.appointmentId },
            });
          }
          reminder.isAppointment = !reminder.appointment ? false : true;
          return await this.reminderRepo.save(reminder);
        }
      );
    } catch (e) {
      throw e;
    }
  }

  async markAsDeliveredByGroup(reminderIds: string[]) {
    try {
      const res = await this.reminderRepo.manager
        .createQueryBuilder()
        .update(Reminder)
        .set({ delivered: true })
        .where({ reminderId: In(reminderIds) })
        .execute();
      return res.affected > 0;
    } catch (e) {
      throw e;
    }
  }

  async delete(reminderId: string) {
    try {
      return await this.reminderRepo.manager.transaction(
        async (entityManager) => {
          const reminder = await entityManager.findOne(Reminder, {
            where: { reminderId, entityStatus: { entityStatusId: "1" } },
          });
          if (!reminder) {
            throw new HttpException("Reminder not found", HttpStatus.NOT_FOUND);
          }
          reminder.title = `deleted_${reminderId}_${new Date()}`;
          reminder.entityStatus = await entityManager.findOne(EntityStatus, {
            where: { entityStatusId: "2" },
          });
          return await this.reminderRepo.save(reminder);
        }
      );
    } catch (e) {
      throw e;
    }
  }
}

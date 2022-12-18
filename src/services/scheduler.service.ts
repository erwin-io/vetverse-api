import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import {
  MessagingDevicesResponse,
  NotificationMessagePayload,
} from "firebase-admin/lib/messaging/messaging-api";
import * as moment from "moment";
import {
  NotificationTitleConstant,
  NotificationDescriptionConstant,
} from "src/common/constant/notifications.constant";
import { FirebaseProvider } from "src/core/provider/firebase/firebase-provider";
import { Clients } from "src/shared/entities/Clients";
import { Notifications } from "src/shared/entities/Notifications";
import { NotificationService } from "./notification.service";
import { ReminderService } from "./reminder.service";

@Injectable()
export class SchedulerService {
  constructor(
    private firebaseProvoder: FirebaseProvider,
    private reminderService: ReminderService,
    private notificationService: NotificationService
  ) {}

  async runNotificaiton() {
    // const today = new Date();
    const getAppointmentsToday = await this.reminderService.geAllReminderByDate(
      new Date(),
      true
    );

    getAppointmentsToday.forEach(async (x) => {
      const res = await this.firebaseSendToDevice(
        x.appointment.clientAppointment.client.user.firebaseToken,
        x.title,
        x.description
      );
      console.log(res);
    });

    await this.notificationService
      .addAppointmentNotification(
        getAppointmentsToday.map((x) => {
          return {
            appointment: x.appointment,
            client: x.appointment.clientAppointment.client,
            date: x.dueDate,
            title: x.title,
            description: x.description,
          };
        })
      )
      .then(async (res) => {
        const reminders = [];
        await getAppointmentsToday.forEach(async (x) => {
          reminders.push(
            await this.reminderService.markAsDelivered(x.reminderId)
          );
        });
        return reminders;
      });
  }

  async runAnnouncements() {
    // const today = new Date();
    const getAppointmentsToday = await this.reminderService.geAllReminderByDate(
      new Date(),
      false
    );

    await getAppointmentsToday.forEach(async (x) => {
      const results = [];
      const res = await this.firebaseSendAnnouncements(x.title, x.description);
      console.log(res);
      const result = await this.notificationService
        .addRemindersToAll({
          date: x.dueDate,
          title: x.title,
          description: x.description,
        })
        .then(async (res) => {
          return await this.reminderService.markAsDelivered(x.reminderId);
        });
      results.push(result);
    });
  }

  async firebaseSendAnnouncements(title, description) {
    return await this.firebaseProvoder.app.messaging().sendToTopic(
      "announcements",
      {
        notification: {
          title: title,
          body: description,
          sound: "notif_alert",
        },
      },
      {
        priority: "high",
        timeToLive: 60 * 24,
        android: { sound: "notif_alert" },
      }
    );
  }

  async firebaseSendToDevice(token, title, description) {
    return await this.firebaseProvoder.app
      .messaging()
      .sendToDevice(
        token,
        {
          notification: {
            title: title,
            body: description,
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
      })
      .catch((error) => {
        throw new HttpException(
          `Error sending notif! ${error.message}`,
          HttpStatus.BAD_REQUEST
        );
      });
  }
}

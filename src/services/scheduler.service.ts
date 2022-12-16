import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import {
  MessagingDevicesResponse,
  NotificationMessagePayload,
} from "firebase-admin/lib/messaging/messaging-api";
import * as moment from "moment";
import { FirebaseProvider } from "src/core/provider/firebase/firebase-provider";
import { ReminderService } from "./reminder.service";

@Injectable()
export class SchedulerService {
  constructor(
    private firebaseProvoder: FirebaseProvider,
    private reminderService: ReminderService
  ) {}

  async runAnnouncements() {
    // const today = new Date();
    const getAppointmentsToday = await this.reminderService.geAllReminderByDate(
      new Date(),
      false
    );

    getAppointmentsToday.forEach(async (x) => {
      const res = await this.firebaseSendAnnouncements(x.title, x.description);
      console.log(res);
    });

    return this.reminderService.markAsDeliveredByGroup(
      getAppointmentsToday.map((x) => x.reminderId.toString())
    );
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

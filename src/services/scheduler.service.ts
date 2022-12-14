import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import {
  MessagingDevicesResponse,
  NotificationMessagePayload,
} from "firebase-admin/lib/messaging/messaging-api";
import * as moment from "moment";
import { FirebaseProvider } from "src/core/provider/firebase/firebase-provider";
import { AppointmentService } from "./appointment.service";
import { PetTypeService } from "./pet-type.service";

@Injectable()
export class SchedulerService {
  constructor(
    private firebaseProvoder: FirebaseProvider,
    private appointmentService: AppointmentService,
    ) {}

  async run() {
    const notification = {
      title: "Sent from scheduler",
      body: "Sent from scheduler",
      sound: "notif_alert",
    };
    await this.sentFirebaseNotif(notification);
  }

  async sentFirebaseNotif(notification: NotificationMessagePayload) {
    return await this.firebaseProvoder.app
      .messaging()
      .sendToDevice(
        "eSJkMtslTCubySjpN1oMCb:APA91bFGJWZ_T9gV4ouZA05xXKzTnVPE8ATW7dzX52bx5sEYJ55JLFm_dbZU8Zu7Ndo7Ehb1Vu_NHipjqdLZybqa7gJ574R43k7pF77Ilnmfskkf9pCA_kHLjDYCi6-xI797vv7GVSAC",
        {
          notification,
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

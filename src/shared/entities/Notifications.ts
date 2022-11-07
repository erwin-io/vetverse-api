import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Appointment } from "./Appointment";
import { EntityStatus } from "./EntityStatus";

@Index("PK_Notifications", ["notificationId"], { unique: true })
@Entity("Notifications", { schema: "dbo" })
export class Notifications {
  @PrimaryGeneratedColumn({ type: "bigint", name: "NotificationId" })
  notificationId: string;

  @Column("nvarchar", { name: "Title" })
  title: string;

  @Column("nvarchar", { name: "Description" })
  description: string;

  @Column("bit", { name: "IsRead", default: () => "(0)" })
  isRead: boolean;

  @ManyToOne(() => Appointment, (appointment) => appointment.notifications)
  @JoinColumn([
    { name: "AppointmentId", referencedColumnName: "appointmentId" },
  ])
  appointment: Appointment;

  @ManyToOne(() => EntityStatus, (entityStatus) => entityStatus.notifications)
  @JoinColumn([
    { name: "EntityStatusId", referencedColumnName: "entityStatusId" },
  ])
  entityStatus: EntityStatus;
}

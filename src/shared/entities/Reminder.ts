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

@Index("PK_ReminderI", ["reminderId"], { unique: true })
@Entity("Reminder", { schema: "dbo" })
export class Reminder {
  @PrimaryGeneratedColumn({ type: "bigint", name: "ReminderId" })
  reminderId: string;

  @Column("nvarchar", { name: "Title", length: 250 })
  title: string;

  @Column("nvarchar", { name: "Description" })
  description: string;

  @Column("bit", { name: "IsAppointment", default: () => "(0)" })
  isAppointment: boolean;

  @Column("datetime", { name: "DueDate" })
  dueDate: Date;

  @Column("bit", { name: "Delivered", default: () => "(0)" })
  delivered: boolean;

  @ManyToOne(() => Appointment, (appointment) => appointment.reminders)
  @JoinColumn([
    { name: "AppointmentId", referencedColumnName: "appointmentId" },
  ])
  appointment: Appointment;

  @ManyToOne(() => EntityStatus, (entityStatus) => entityStatus.reminders)
  @JoinColumn([
    { name: "EntityStatusId", referencedColumnName: "entityStatusId" },
  ])
  entityStatus: EntityStatus;
}

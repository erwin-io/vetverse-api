import {
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Files } from "./Files";
import { Appointment } from "./Appointment";

@Index("PK_AppointmentAttachments", ["appointmentAttachmentId"], {
  unique: true,
})
@Entity("AppointmentAttachments", { schema: "dbo" })
export class AppointmentAttachments {
  @PrimaryGeneratedColumn({ type: "bigint", name: "AppointmentAttachmentId" })
  appointmentAttachmentId: string;

  @ManyToOne(() => Files, (files) => files.appointmentAttachments)
  @JoinColumn([{ name: "FileId", referencedColumnName: "fileId" }])
  file: Files;

  @ManyToOne(
    () => Appointment,
    (appointment) => appointment.appointmentAttachments
  )
  @JoinColumn([
    { name: "AppointmentId", referencedColumnName: "appointmentId" },
  ])
  appointment: Appointment;
}

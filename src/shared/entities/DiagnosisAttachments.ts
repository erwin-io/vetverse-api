import {
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Files } from "./Files";
import { Appointment } from "./Appointment";

@Index("PK_DiagnosisAttachments_1", ["diagnosisAttachmentsId"], {
  unique: true,
})
@Entity("DiagnosisAttachments", { schema: "dbo" })
export class DiagnosisAttachments {
  @PrimaryGeneratedColumn({ type: "bigint", name: "DiagnosisAttachmentsId" })
  diagnosisAttachmentsId: string;

  @ManyToOne(() => Files, (files) => files.diagnosisAttachments)
  @JoinColumn([{ name: "FileId", referencedColumnName: "fileId" }])
  file: Files;

  @ManyToOne(
    () => Appointment,
    (appointment) => appointment.diagnosisAttachments
  )
  @JoinColumn([
    { name: "AppointmentId", referencedColumnName: "appointmentId" },
  ])
  appointment: Appointment;
}

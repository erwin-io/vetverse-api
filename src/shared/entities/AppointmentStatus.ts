import { Column, Entity, Index, OneToMany } from "typeorm";
import { Appointment } from "./Appointment";

@Index("PK_AppointmentStatus", ["appointmentStatusId"], { unique: true })
@Entity("AppointmentStatus", { schema: "dbo" })
export class AppointmentStatus {
  @Column("bigint", { primary: true, name: "AppointmentStatusId" })
  appointmentStatusId: string;

  @Column("nvarchar", { name: "Name", nullable: true, length: 100 })
  name: string | null;

  @OneToMany(() => Appointment, (appointment) => appointment.appointmentStatus)
  appointments: Appointment[];
}

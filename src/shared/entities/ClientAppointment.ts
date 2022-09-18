import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from "typeorm";
import { Appointment } from "./Appointment";
import { Clients } from "./Clients";

@Index("IX_ClientAppointment", ["appointmentId"], { unique: true })
@Index("PK_ClientAppointment", ["appointmentId"], { unique: true })
@Entity("ClientAppointment", { schema: "dbo" })
export class ClientAppointment {
  @Column("bigint", { primary: true, name: "AppointmentId" })
  appointmentId: string;

  @OneToOne(() => Appointment, (appointment) => appointment.clientAppointment)
  @JoinColumn([
    { name: "AppointmentId", referencedColumnName: "appointmentId" },
  ])
  appointment: Appointment;

  @ManyToOne(() => Clients, (clients) => clients.clientAppointments)
  @JoinColumn([{ name: "ClientId", referencedColumnName: "clientId" }])
  client: Clients;
}

import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from "typeorm";
import { Appointment } from "./Appointment";
import { Pet } from "./Pet";

@Index("PK_PetAppointment", ["appointmentId"], { unique: true })
@Entity("PetAppointment", { schema: "dbo" })
export class PetAppointment {
  @Column("bigint", { primary: true, name: "AppointmentId" })
  appointmentId: string;

  @OneToOne(() => Appointment, (appointment) => appointment.petAppointment)
  @JoinColumn([
    { name: "AppointmentId", referencedColumnName: "appointmentId" },
  ])
  appointment: Appointment;

  @ManyToOne(() => Pet, (pet) => pet.petAppointments)
  @JoinColumn([{ name: "PetId", referencedColumnName: "petId" }])
  pet: Pet;
}

import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Staff } from "./Staff";
import { ServiceType } from "./ServiceType";
import { ConsultaionType } from "./ConsultaionType";
import { AppointmentStatus } from "./AppointmentStatus";
import { ClientAppointment } from "./ClientAppointment";
import { Messages } from "./Messages";
import { Notifications } from "./Notifications";
import { Payment } from "./Payment";
import { PetAppointment } from "./PetAppointment";

@Index("PK_Appointment", ["appointmentId"], { unique: true })
@Entity("Appointment", { schema: "dbo" })
export class Appointment {
  @PrimaryGeneratedColumn({ type: "bigint", name: "AppointmentId" })
  appointmentId: string;

  @Column("date", { name: "AppointmentDate" })
  appointmentDate: Date;

  @Column("text", { name: "Comments", nullable: true })
  comments: string | null;

  @Column("nvarchar", { name: "TimeStart", length: 50 })
  timeStart: string;

  @Column("nvarchar", { name: "TimeEnd", length: 50 })
  timeEnd: string;

  @Column("bit", { name: "IsPaid", default: () => "(0)" })
  isPaid: boolean;

  @Column("bit", { name: "IsWalkIn", default: () => "(0)" })
  isWalkIn: boolean;

  @Column("text", { name: "WalkInAppointmentNotes", nullable: true })
  walkInAppointmentNotes: string | null;

  @Column("nvarchar", { name: "ConferencePeerId", nullable: true })
  conferencePeerId: string | null;

  @ManyToOne(() => Staff, (staff) => staff.appointments)
  @JoinColumn([{ name: "Staffid", referencedColumnName: "staffid" }])
  staff: Staff;

  @ManyToOne(() => ServiceType, (serviceType) => serviceType.appointments)
  @JoinColumn([
    { name: "ServiceTypeId", referencedColumnName: "serviceTypeId" },
  ])
  serviceType: ServiceType;

  @ManyToOne(
    () => ConsultaionType,
    (consultaionType) => consultaionType.appointments
  )
  @JoinColumn([
    { name: "ConsultaionTypeId", referencedColumnName: "consultaionTypeId" },
  ])
  consultaionType: ConsultaionType;

  @ManyToOne(
    () => AppointmentStatus,
    (appointmentStatus) => appointmentStatus.appointments
  )
  @JoinColumn([
    {
      name: "AppointmentStatusId",
      referencedColumnName: "appointmentStatusId",
    },
  ])
  appointmentStatus: AppointmentStatus;

  @OneToOne(
    () => ClientAppointment,
    (clientAppointment) => clientAppointment.appointment
  )
  clientAppointment: ClientAppointment;

  @OneToMany(() => Messages, (messages) => messages.appointment)
  messages: Messages[];

  @OneToMany(() => Notifications, (notifications) => notifications.appointment)
  notifications: Notifications[];

  @OneToMany(() => Payment, (payment) => payment.appointment)
  payments: Payment[];

  @OneToOne(
    () => PetAppointment,
    (petAppointment) => petAppointment.appointment
  )
  petAppointment: PetAppointment;
}

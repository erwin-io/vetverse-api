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
import { AppointmentStatus } from "./AppointmentStatus";
import { ConsultaionType } from "./ConsultaionType";
import { ServiceType } from "./ServiceType";
import { Staff } from "./Staff";
import { AppointmentAttachments } from "./AppointmentAttachments";
import { ClientAppointment } from "./ClientAppointment";
import { DiagnosisAttachments } from "./DiagnosisAttachments";
import { Messages } from "./Messages";
import { Notifications } from "./Notifications";
import { Payment } from "./Payment";
import { PetAppointment } from "./PetAppointment";
import { Reminder } from "./Reminder";

@Index("IX_Appointment", ["appointmentId"], { unique: true })
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

  @Column("decimal", {
    name: "ServiceRate",
    precision: 18,
    scale: 2,
    default: () => "(0)",
  })
  serviceRate: number;

  @Column("bit", { name: "IsPaid", default: () => "(0)" })
  isPaid: boolean;

  @Column("bit", { name: "IsWalkIn", default: () => "(0)" })
  isWalkIn: boolean;

  @Column("text", { name: "WalkInAppointmentNotes", nullable: true })
  walkInAppointmentNotes: string | null;

  @Column("nvarchar", { name: "ConferencePeerId", nullable: true })
  conferencePeerId: string | null;

  @Column("nvarchar", { name: "DiagnosisAndTreatment", nullable: true })
  diagnosisAndTreatment: string | null;

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

  @ManyToOne(
    () => ConsultaionType,
    (consultaionType) => consultaionType.appointments
  )
  @JoinColumn([
    { name: "ConsultaionTypeId", referencedColumnName: "consultaionTypeId" },
  ])
  consultaionType: ConsultaionType;

  @ManyToOne(() => ServiceType, (serviceType) => serviceType.appointments)
  @JoinColumn([
    { name: "ServiceTypeId", referencedColumnName: "serviceTypeId" },
  ])
  serviceType: ServiceType;

  @ManyToOne(() => Staff, (staff) => staff.appointments)
  @JoinColumn([{ name: "Staffid", referencedColumnName: "staffid" }])
  staff: Staff;

  @OneToMany(
    () => AppointmentAttachments,
    (appointmentAttachments) => appointmentAttachments.appointment
  )
  appointmentAttachments: AppointmentAttachments[];

  @OneToOne(
    () => ClientAppointment,
    (clientAppointment) => clientAppointment.appointment
  )
  clientAppointment: ClientAppointment;

  @OneToMany(
    () => DiagnosisAttachments,
    (diagnosisAttachments) => diagnosisAttachments.appointment
  )
  diagnosisAttachments: DiagnosisAttachments[];

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

  @OneToMany(() => Reminder, (reminder) => reminder.appointment)
  reminders: Reminder[];
}

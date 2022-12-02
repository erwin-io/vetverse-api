import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Appointment } from "./Appointment";
import { PaymentType } from "./PaymentType";

@Index("PK_Payment", ["paymentId"], { unique: true })
@Entity("Payment", { schema: "dbo" })
export class Payment {
  @PrimaryGeneratedColumn({ type: "bigint", name: "PaymentId" })
  paymentId: string;

  @Column("date", { name: "PaymentDate" })
  paymentDate: Date;

  @Column("nvarchar", { name: "ReferenceNo" })
  referenceNo: string;

  @Column("bit", { name: "IsVoid", default: () => "(0)" })
  isVoid: boolean;

  @ManyToOne(() => Appointment, (appointment) => appointment.payments)
  @JoinColumn([
    { name: "AppointmentId", referencedColumnName: "appointmentId" },
  ])
  appointment: Appointment;

  @ManyToOne(() => PaymentType, (paymentType) => paymentType.payments)
  @JoinColumn([
    { name: "PaymentTypeId", referencedColumnName: "paymentTypeId" },
  ])
  paymentType: PaymentType;
}

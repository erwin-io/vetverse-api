import { Column, Entity, Index, OneToMany } from "typeorm";
import { Payment } from "./Payment";

@Index("PK_PaymentType", ["paymentTypeId"], { unique: true })
@Index("U_PaymentType", ["name"], { unique: true })
@Entity("PaymentType", { schema: "dbo" })
export class PaymentType {
  @Column("bigint", { primary: true, name: "PaymentTypeId" })
  paymentTypeId: string;

  @Column("nvarchar", { name: "Name", unique: true, length: 100 })
  name: string;

  @OneToMany(() => Payment, (payment) => payment.paymentType)
  payments: Payment[];
}

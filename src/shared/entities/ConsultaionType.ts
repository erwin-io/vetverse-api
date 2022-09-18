import { Column, Entity, Index, OneToMany } from "typeorm";
import { Appointment } from "./Appointment";

@Index("PK_ConsultaionType", ["consultaionTypeId"], { unique: true })
@Entity("ConsultaionType", { schema: "dbo" })
export class ConsultaionType {
  @Column("bigint", { primary: true, name: "ConsultaionTypeId" })
  consultaionTypeId: string;

  @Column("nvarchar", { name: "Name", length: 100 })
  name: string;

  @OneToMany(() => Appointment, (appointment) => appointment.consultaionType)
  appointments: Appointment[];
}

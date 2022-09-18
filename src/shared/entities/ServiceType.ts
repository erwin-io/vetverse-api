import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Appointment } from "./Appointment";

@Index("PK_ServiceType", ["serviceTypeId"], { unique: true })
@Index("U_ServiceType", ["name"], { unique: true })
@Entity("ServiceType", { schema: "dbo" })
export class ServiceType {
  @PrimaryGeneratedColumn({ type: "bigint", name: "ServiceTypeId" })
  serviceTypeId: string;

  @Column("nvarchar", { name: "Name", unique: true, length: 250 })
  name: string;

  @Column("nvarchar", { name: "Description", nullable: true })
  description: string | null;

  @Column("decimal", {
    name: "Price",
    precision: 18,
    scale: 2,
    default: () => "(0)",
  })
  price: number;

  @Column("bigint", { name: "DurationInHours", default: () => "(0)" })
  durationInHours: string;

  @Column("bit", { name: "IsMedicalServiceType", default: () => "(0)" })
  isMedicalServiceType: boolean;

  @Column("bigint", { name: "EntityStatusId", default: () => "(1)" })
  entityStatusId: string;

  @OneToMany(() => Appointment, (appointment) => appointment.serviceType)
  appointments: Appointment[];
}

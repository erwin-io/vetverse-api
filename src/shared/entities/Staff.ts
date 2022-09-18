import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Appointment } from "./Appointment";
import { Users } from "./Users";
import { Gender } from "./Gender";

@Index("PK_Staff", ["staffid"], { unique: true })
@Entity("Staff", { schema: "dbo" })
export class Staff {
  @PrimaryGeneratedColumn({ type: "bigint", name: "Staffid" })
  staffid: string;

  @Column("nvarchar", { name: "FirstName", length: 250 })
  firstName: string;

  @Column("nvarchar", { name: "MiddleName", nullable: true, length: 250 })
  middleName: string | null;

  @Column("nvarchar", { name: "LastName", length: 250 })
  lastName: string;

  @Column("nvarchar", { name: "Email", length: 250 })
  email: string;

  @Column("nvarchar", { name: "MobileNumber", length: 250 })
  mobileNumber: string;

  @Column("nvarchar", { name: "Address" })
  address: string;

  @OneToMany(() => Appointment, (appointment) => appointment.staff)
  appointments: Appointment[];

  @ManyToOne(() => Users, (users) => users.staff)
  @JoinColumn([{ name: "UserId", referencedColumnName: "userId" }])
  user: Users;

  @ManyToOne(() => Gender, (gender) => gender.staff)
  @JoinColumn([{ name: "GenderId", referencedColumnName: "genderId" }])
  gender: Gender;
}

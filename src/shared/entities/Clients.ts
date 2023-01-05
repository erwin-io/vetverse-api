import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ClientAppointment } from "./ClientAppointment";
import { Gender } from "./Gender";
import { Users } from "./Users";
import { Notifications } from "./Notifications";
import { Pet } from "./Pet";

@Index("PK_Clients", ["clientId"], { unique: true })
@Entity("Clients", { schema: "dbo" })
export class Clients {
  @PrimaryGeneratedColumn({ type: "bigint", name: "ClientId" })
  clientId: string;

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

  @Column("date", { name: "BirthDate" })
  birthDate: Date;

  @Column("bigint", { name: "Age" })
  age: string;

  @Column("datetime", { name: "LastCancelledDate", nullable: true })
  lastCancelledDate: Date | null;

  @Column("bigint", { name: "NumberOfCancelledAttempt", default: () => "(0)" })
  numberOfCancelledAttempt: string;

  @OneToMany(
    () => ClientAppointment,
    (clientAppointment) => clientAppointment.client
  )
  clientAppointments: ClientAppointment[];

  @ManyToOne(() => Gender, (gender) => gender.clients)
  @JoinColumn([{ name: "GenderId", referencedColumnName: "genderId" }])
  gender: Gender;

  @ManyToOne(() => Users, (users) => users.clients)
  @JoinColumn([{ name: "UserId", referencedColumnName: "userId" }])
  user: Users;

  @OneToMany(() => Notifications, (notifications) => notifications.client)
  notifications: Notifications[];

  @OneToMany(() => Pet, (pet) => pet.client)
  pets: Pet[];
}

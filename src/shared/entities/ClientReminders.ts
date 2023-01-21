import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Clients } from "./Clients";
import { EntityStatus } from "./EntityStatus";
import { ClientReminderType } from "./ClientReminderType";

@Index("PK_ClientReminders", ["clientReminderId"], { unique: true })
@Entity("ClientReminders", { schema: "dbo" })
export class ClientReminders {
  @PrimaryGeneratedColumn({ type: "bigint", name: "ClientReminderId" })
  clientReminderId: string;

  @Column("date", { name: "StartDate" })
  startDate: Date;

  @Column("datetime", { name: "RemindDateTime" })
  remindDateTime: Date;

  @Column("date", { name: "EndDate", nullable: true })
  endDate: Date | null;

  @Column("nvarchar", { name: "RepeatTypeCode", length: 1 })
  repeatTypeCode: string;

  @Column("nvarchar", { name: "DurationTypeCode", length: 1 })
  durationTypeCode: string;

  @Column("bigint", { name: "DurationTimes", default: () => "(1)" })
  durationTimes: string;

  @Column("nvarchar", { name: "Title" })
  title: string;

  @Column("nvarchar", { name: "Description", nullable: true })
  description: string | null;

  @ManyToOne(() => Clients, (clients) => clients.clientReminders)
  @JoinColumn([{ name: "ClientId", referencedColumnName: "clientId" }])
  client: Clients;

  @ManyToOne(() => EntityStatus, (entityStatus) => entityStatus.clientReminders)
  @JoinColumn([
    { name: "EntityStatusId", referencedColumnName: "entityStatusId" },
  ])
  entityStatus: EntityStatus;

  @ManyToOne(
    () => ClientReminderType,
    (clientReminderType) => clientReminderType.clientReminders
  )
  @JoinColumn([
    {
      name: "ClientReminderTypeId",
      referencedColumnName: "clientReminderTypeId",
    },
  ])
  clientReminderType: ClientReminderType;
}

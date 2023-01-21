import { Column, Entity, Index, OneToMany } from "typeorm";
import { ClientReminders } from "./ClientReminders";

@Index("PK_ClientReminderType", ["clientReminderTypeId"], { unique: true })
@Entity("ClientReminderType", { schema: "dbo" })
export class ClientReminderType {
  @Column("bigint", { primary: true, name: "ClientReminderTypeId" })
  clientReminderTypeId: string;

  @Column("nvarchar", { name: "Name", length: 50 })
  name: string;

  @OneToMany(
    () => ClientReminders,
    (clientReminders) => clientReminders.clientReminderType
  )
  clientReminders: ClientReminders[];
}

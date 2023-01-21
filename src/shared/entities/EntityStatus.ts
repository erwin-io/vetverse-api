import { Column, Entity, Index, OneToMany } from "typeorm";
import { ClientReminders } from "./ClientReminders";
import { Notifications } from "./Notifications";
import { Reminder } from "./Reminder";
import { Users } from "./Users";

@Index("PK_EntityStatus", ["entityStatusId"], { unique: true })
@Entity("EntityStatus", { schema: "dbo" })
export class EntityStatus {
  @Column("bigint", { primary: true, name: "EntityStatusId" })
  entityStatusId: string;

  @Column("nvarchar", { name: "Name", length: 100 })
  name: string;

  @OneToMany(
    () => ClientReminders,
    (clientReminders) => clientReminders.entityStatus
  )
  clientReminders: ClientReminders[];

  @OneToMany(() => Notifications, (notifications) => notifications.entityStatus)
  notifications: Notifications[];

  @OneToMany(() => Reminder, (reminder) => reminder.entityStatus)
  reminders: Reminder[];

  @OneToMany(() => Users, (users) => users.entityStatus)
  users: Users[];
}

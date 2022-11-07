import { Column, Entity, Index, OneToMany } from "typeorm";
import { Notifications } from "./Notifications";
import { Users } from "./Users";

@Index("PK_EntityStatus", ["entityStatusId"], { unique: true })
@Entity("EntityStatus", { schema: "dbo" })
export class EntityStatus {
  @Column("bigint", { primary: true, name: "EntityStatusId" })
  entityStatusId: string;

  @Column("nvarchar", { name: "Name", length: 100 })
  name: string;

  @OneToMany(() => Notifications, (notifications) => notifications.entityStatus)
  notifications: Notifications[];

  @OneToMany(() => Users, (users) => users.entityStatus)
  users: Users[];
}

import { Column, Entity, Index } from "typeorm";

@Index("PK_NotificationType", ["notificationTypeId"], { unique: true })
@Entity("NotificationType", { schema: "dbo" })
export class NotificationType {
  @Column("bigint", { primary: true, name: "NotificationTypeId" })
  notificationTypeId: string;

  @Column("nvarchar", { name: "Name", length: 50 })
  name: string;
}

import { Column, Entity, Index, OneToMany } from "typeorm";
import { Users } from "./Users";

@Index("PK_UserType", ["userTypeId"], { unique: true })
@Entity("UserType", { schema: "dbo" })
export class UserType {
  @Column("bigint", { primary: true, name: "UserTypeId" })
  userTypeId: string;

  @Column("nvarchar", { name: "Name", length: 100 })
  name: string;

  @OneToMany(() => Users, (users) => users.userType)
  users: Users[];
}

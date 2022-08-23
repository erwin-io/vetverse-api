import { Column, Entity, Index, OneToMany } from "typeorm";
import { Users } from "./Users";

@Index("PK_Role", ["roleId"], { unique: true })
@Index("U_Roles", ["name"], { unique: true })
@Entity("Roles", { schema: "dbo" })
export class Roles {
  @Column("bigint", { primary: true, name: "RoleId" })
  roleId: string;

  @Column("nvarchar", { name: "Name", unique: true, length: 100 })
  name: string;

  @Column("text", { name: "Access", nullable: true })
  access: string | null;

  @OneToMany(() => Users, (users) => users.role)
  users: Users[];
}

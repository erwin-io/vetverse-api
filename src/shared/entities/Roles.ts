import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("PK_Role", ["roleId"], { unique: true })
@Index("U_Roles", ["name"], { unique: true })
@Entity("Roles", { schema: "dbo" })
export class Roles {
  @PrimaryGeneratedColumn({ type: "bigint", name: "RoleId" })
  roleId: string;

  @Column("nvarchar", { name: "Name", unique: true, length: 100 })
  name: string;

  @Column("text", { name: "Access", nullable: true })
  access: string | null;

  @Column("bigint", { name: "EntityStatusId", default: () => "(1)" })
  entityStatusId: string;
}

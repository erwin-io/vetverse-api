import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Clients } from "./Clients";
import { Staff } from "./Staff";
import { UserType } from "./UserType";
import { EntityStatus } from "./EntityStatus";

@Index("PK_Users", ["userId"], { unique: true })
@Entity("Users", { schema: "dbo" })
export class Users {
  @PrimaryGeneratedColumn({ type: "bigint", name: "UserId" })
  userId: string;

  @Column("nvarchar", { name: "Username", length: 250 })
  username: string;

  @Column("nvarchar", { name: "Password", length: 250 })
  password: string;

  @OneToMany(() => Clients, (clients) => clients.user)
  clients: Clients[];

  @OneToMany(() => Staff, (staff) => staff.user)
  staff: Staff[];

  @ManyToOne(() => UserType, (userType) => userType.users)
  @JoinColumn([{ name: "UserTypeId", referencedColumnName: "userTypeId" }])
  userType: UserType;

  @ManyToOne(() => EntityStatus, (entityStatus) => entityStatus.users)
  @JoinColumn([
    { name: "EntityStatusId", referencedColumnName: "entityStatusId" },
  ])
  entityStatus: EntityStatus;
}

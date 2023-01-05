import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from "typeorm";
import { Users } from "./Users";
import { Files } from "./Files";

@Index("PK_UserProfilePic_1", ["userId"], { unique: true })
@Entity("UserProfilePic", { schema: "dbo" })
export class UserProfilePic {
  @Column("bigint", { primary: true, name: "UserId" })
  userId: string;

  @OneToOne(() => Users, (users) => users.userProfilePic)
  @JoinColumn([{ name: "UserId", referencedColumnName: "userId" }])
  user: Users;

  @ManyToOne(() => Files, (files) => files.userProfilePics)
  @JoinColumn([{ name: "FileId", referencedColumnName: "fileId" }])
  file: Files;
}

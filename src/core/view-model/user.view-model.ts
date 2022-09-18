import { EntityStatusViewModel } from "./entity-status.view-model";
import { RoleViewModel } from "./role.view-model";
import { UserTypeViewModel } from "./user-type.view-model";

export class UserViewModel {
  userId: string;
  username: string;
  isAdminApproved: boolean;
  enable: boolean;
  entityStatus: EntityStatusViewModel;
  role: RoleViewModel;
  userType: UserTypeViewModel;
  constructor(model: UserViewModel | undefined){
    if (!model || model === null) {
      return null;
    }
    this.userId = model.userId;
    this.username = model.username;
    this.isAdminApproved = model.isAdminApproved;
    this.enable = model.enable;
    this.entityStatus = model.entityStatus;
    this.role = model.role;
    this.userType = model.userType;
  }
}

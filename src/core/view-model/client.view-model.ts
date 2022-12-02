import { Clients } from "src/shared/entities/Clients";
import { GenderViewModel } from "./gender.view-model";
import { UserViewModel } from "./user.view-model";

export class ClientViewModel {
  clientId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  address: string;
  fullName: string;
  gender: GenderViewModel;
  user: UserViewModel;
  birthDate: Date;
  age: string;
  lastCancelledDate: Date;
  numberOfCancelledAttempt: string;
  constructor(model: Clients | undefined) {
    if (!model || model === null) {
      return null;
    }
    this.clientId = model.clientId;
    this.firstName = model.firstName;
    this.middleName = model.middleName;
    this.lastName = model.lastName;
    this.email = model.email;
    this.mobileNumber = model.mobileNumber;
    this.address = model.address;
    this.fullName =
      this.firstName +
      (this.middleName ? " " + this.middleName + " " : " ") +
      this.lastName;
    this.gender = model.gender;
    this.user = new UserViewModel(model.user);
    this.birthDate = model.birthDate;
    this.age = model.age;
    this.age = model.age;
    this.lastCancelledDate = model.lastCancelledDate;
    this.numberOfCancelledAttempt = model.numberOfCancelledAttempt;
  }
}

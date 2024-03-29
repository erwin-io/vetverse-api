import { Pet } from "src/shared/entities/Pet";
import { PetAppointment } from "src/shared/entities/PetAppointment";
import { PetProfilePic } from "src/shared/entities/PetProfilePic";
import { AppointmentViewModel } from "./appointment.view-model";
import { ClientViewModel } from "./client.view-model";
import { FilesViewModel } from "./file.view.mode";
import { GenderViewModel } from "./gender.view-model";
import { PetCategoryViewModel } from "./pet-category.view-model";

export class PetViewModel {
  petId: string;
  name: string;
  birthDate: Date;
  weight: number;
  entityStatusId: string;
  client: ClientViewModel;
  petCategory: PetCategoryViewModel;
  gender: GenderViewModel;
  petAppointments: PetAppointmentModel[] = [];
  petProfilePic: PetProfilePicViewModel;
  constructor(model: Pet | undefined) {
    if (!model || model === null) {
      return null;
    }
    this.petId = model.petId;
    this.name = model.name;
    this.birthDate = model.birthDate;
    this.weight = model.weight;
    this.entityStatusId = model.entityStatusId;
    this.client = new ClientViewModel(model.client);
    this.petCategory = new PetCategoryViewModel(model.petCategory);
    this.gender = new GenderViewModel(model.gender);
    if (model.petAppointments && model.petAppointments.length > 0) {
      model.petAppointments.forEach((element) => {
        this.petAppointments.push(new PetAppointmentModel(element));
      });
    }
    this.petProfilePic = new PetProfilePicViewModel(model.petProfilePic);
  }
}

export class PetAppointmentModel {
  pet: PetViewModel;
  appointment: AppointmentViewModel;
  constructor(model: PetAppointment | undefined) {
    if (!model || model === null) {
      return null;
    }
    this.appointment = new AppointmentViewModel(model.appointment);
  }
}

export class PetProfilePicViewModel {
  petId: string;
  file: FilesViewModel;
  constructor(model: PetProfilePic | undefined) {
    if (!model || model === null) {
      return null;
    }
    this.file = new FilesViewModel(model.file);
  }
}

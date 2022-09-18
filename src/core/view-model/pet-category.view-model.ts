import { PetCategory } from "src/shared/entities/PetCategory";
import { PetTypeViewModel } from "./pet-type.view-model";

export class PetCategoryViewModel {
  petCategoryId: string;
  name: string;
  entityStatusId: string;
  petType: PetTypeViewModel;
  constructor(model: PetCategory | undefined){
    if (!model || model === null) {
      return null;
    }
    this.petCategoryId = model.petCategoryId;
    this.name = model.name;
    this.entityStatusId = model.entityStatusId;
    this.petType = new PetTypeViewModel(model.petType);
  }
}

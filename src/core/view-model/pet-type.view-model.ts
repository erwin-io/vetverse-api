import { PetType } from "src/shared/entities/PetType";

export class PetTypeViewModel {
  petTypeId: string;
  name: string;
  entityStatusId: string;
  constructor(model: PetType | undefined){
    if (!model || model === null) {
      return null;
    }
    this.petTypeId = model.petTypeId;
    this.name = model.name;
    this.entityStatusId = model.entityStatusId;
  }
}

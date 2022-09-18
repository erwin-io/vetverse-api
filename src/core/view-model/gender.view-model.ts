import { Gender } from "src/shared/entities/Gender";

export class GenderViewModel {
  genderId: string;
  name: string;
  constructor(model: Gender | undefined){
    if (!model || model === null) {
      return null;
    }
    this.genderId = model.genderId;
    this.name = model.name;
  }
}

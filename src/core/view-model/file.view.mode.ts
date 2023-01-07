import { Files } from "src/shared/entities/Files";

export class FilesViewModel {
  fileId: string;
  fileName: string;
  url: string;
  constructor(model: Files | undefined) {
    if (!model || model === null) {
      return null;
    }
    this.fileId = model.fileId;
    this.fileName = model.fileName;
    this.url = model.url;
  }
}

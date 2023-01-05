import { Injectable } from "@nestjs/common";
import { FirebaseProvider } from "src/core/provider/firebase/firebase-provider";
import { getStorage, ref, uploadString } from "@firebase/storage";

@Injectable()
export class FirebaseStorageService {
  constructor(private firebaseProvoder: FirebaseProvider) {}

  uploadProfilePicture(fileName, data) {
    const storage = getStorage();
    const storageRef = ref(storage, "profile/" + fileName);
    uploadString(storageRef, data, "data_url").then((snapshot) => {
      console.log("Uploaded a data_url string!");
    });
  }
}

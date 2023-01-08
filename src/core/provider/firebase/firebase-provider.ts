import { Injectable } from "@nestjs/common";
import * as admin from "firebase-admin";
import firebaseConfig from "./firebase.config";
import { ConfigService } from "@nestjs/config";
import { getAuth } from "@firebase/auth";

@Injectable()
export class FirebaseProvider {
  public app: admin.app.App;
  constructor(private readonly config: ConfigService) {
    this.app = admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig),
      storageBucket: this.config.get<string>("FIREBASE_BUCKET"),
    });
  }
}

import { Injectable } from "@nestjs/common";
import * as admin from "firebase-admin";
import firebaseConfig from "./firebase.config";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class FirebaseProvider {
  public app: admin.app.App;

  constructor(private readonly config: ConfigService) {
    this.app = admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig),
    });
  }
}

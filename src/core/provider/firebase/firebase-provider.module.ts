import { Module } from "@nestjs/common";
import { FirebaseProvider } from "./firebase-provider";

@Module({
  providers: [FirebaseProvider],
  exports: [FirebaseProvider],
})
export class FirebaseProviderModule {}

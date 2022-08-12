import { Transform } from "class-transformer";
import { existsSync } from "fs";
import { resolve } from "path";

export function getEnvPath(dest: string): string {
  const env: string | undefined = process.env.NODE_ENV;
  const fallback: string = resolve(`${dest}/.env`);
  const filename: string = env ? `${env}.env` : "development.env";
  let filePath: string = resolve(`${dest}/${filename}`);

  if (!existsSync(filePath)) {
    filePath = fallback;
  }

  return filePath;
}

export function ToBoolean(): (target: any, key: string) => void {
  return Transform((value: any) => value.obj[value.key]);
}

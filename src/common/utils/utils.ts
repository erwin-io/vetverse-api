import { getConnectionOptions, getConnection } from "typeorm";
import * as bcrypt from "bcrypt";
import { Logger } from "@nestjs/common";

export const APP_ROLE_ADMIN = 1;
export const APP_ROLE_MANAGER = 2;
export const APP_ROLE_VET = 3;
export const APP_ROLE_FRONTDESK = 4;
export const APP_ROLE_GUEST = 5;

export const toPromise = <T>(data: T): Promise<T> => {
  return new Promise<T>((resolve) => {
    resolve(data);
  });
};

export const getDbConnectionOptions = async (connectionName = "default") => {
  const options = await getConnectionOptions(
    process.env.NODE_ENV || "development"
  );
  return {
    ...options,
    name: connectionName,
  };
};

export const getDbConnection = async (connectionName = "default") => {
  return await getConnection(connectionName);
};

export const runDbMigrations = async (connectionName = "default") => {
  const conn = await getDbConnection(connectionName);
  await conn.runMigrations();
};

export const hash = async (value) => {
  return await bcrypt.hash(value, 10);
};

export const compare = async (newValue, hashedValue) => {
  return await bcrypt.compare(hashedValue, newValue);
};

export const getAge = async (birthDate: Date) => {
  const timeDiff = Math.abs(Date.now() - birthDate.getTime());
  return Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
};

export const isStaffRegistrationApproved = (roleId: number): boolean => {
  if (roleId === APP_ROLE_ADMIN) return true;
  else if (roleId === APP_ROLE_MANAGER) return true;
  else if (roleId === APP_ROLE_VET) return true;
  else if (roleId === APP_ROLE_FRONTDESK) return true;
  else return false;
};

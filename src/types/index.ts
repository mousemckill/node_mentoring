export interface IUser {
  login: string;
  age: number;
  password: string;
}

export type Permission = "READ" | "WRITE" | "DELETE" | "SHARE" | "UPLOAD_FILES";

export interface IGroup {
  name: string;
  permissions: Permission[];
}

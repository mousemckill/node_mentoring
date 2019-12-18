import { find } from "lodash";
import { UserType } from "../UserType";

export function findUserById(
  list: UserType[],
  id: string
): UserType | undefined {
  return find(list, { id });
}

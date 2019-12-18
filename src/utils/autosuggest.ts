import orderBy from "lodash/orderBy";
import { UserType } from "../UserType";

export function autosuggest(
  list: UserType[],
  loginSubstring: string,
  limit: number = 1
): UserType[] {
  let result: UserType[] = [];

  const filtered: UserType[] = list.filter(
    ({ login }) => login.match(loginSubstring) !== null
  );

  result = orderBy(filtered, "login").slice(0, limit);

  return result;
}

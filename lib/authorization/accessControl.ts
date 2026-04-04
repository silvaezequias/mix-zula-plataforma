import { Credentials } from "./credentials";
import { Roles } from "./role";

export function registerRequesterCredentials(role: Roles) {
  return function requesterCanDo(credential: Credentials) {
    return role.credentials.includes(credential);
  };
}

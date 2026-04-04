import credendials, { Credentials } from "./credentials";

class Role {
  constructor(
    public id: string,
    public credentials: Credentials[],
  ) {}
}

const { user, session } = credendials;

export const AnonymousRole = new Role("anonymous", [session.CreateSession]);
export const UserRole = new Role("user", [
  user.ReadUser,
  user.UpdateUser,
  session.ReadSession,
  session.DeleteSession,
]);
export const UserManagerRole = new Role("user_manager", [
  ...UserRole.credentials,
  user.CreateUser,
  user.ReadUserList,
  user.ReadUserOther,
  user.UpdateUserOther,

  session.DeleteSessionOther,
  session.ReadSessionOther,
]);

export const AdminRole = new Role("admin", [...UserManagerRole.credentials]);

export type Roles =
  | typeof AnonymousRole
  | typeof UserRole
  | typeof UserManagerRole
  | typeof AdminRole;

export function getRoleById(roleId: string): Role | undefined {
  switch (roleId) {
    case "anonymous":
      return AnonymousRole;
    case "user":
      return UserRole;
    case "user_manager":
      return UserManagerRole;
    case "admin":
      return AdminRole;
    default:
      return undefined;
  }
}

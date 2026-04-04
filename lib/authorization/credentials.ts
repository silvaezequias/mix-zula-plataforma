enum AuthorizationCodeCredential {
  ReadAuthorizationCode = "read:authorization_code",
  CreateAuthorizationCode = "create:authorization_code",
  DeleteAuthorizationCode = "delete:authorization_code",
}

enum SessionCredential {
  ReadSession = "read:session",
  CreateSession = "create:session",
  DeleteSession = "delete:session",
  ReadSessionOther = "read:session:other",
  DeleteSessionOther = "delete:session:other",
}

enum UserCredential {
  CreateUser = "create:user",
  ReadUser = "read:user",
  ReadUserList = "read:user:list",
  ReadUserOther = "read:user:other",
  UpdateUser = "update:user",
  UpdateUserOther = "update:user:other",
}

const credentials = {
  authorizationCode: AuthorizationCodeCredential,
  session: SessionCredential,
  user: UserCredential,
};

export default credentials;
export type Credentials =
  | AuthorizationCodeCredential
  | SessionCredential
  | UserCredential;

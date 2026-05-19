export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

/** Internal record — demo passwords stored locally only (not production-safe). */
export interface StoredUser extends User {
  password: string;
}

export interface Session {
  userId: string;
  email: string;
  loggedInAt: string;
}

export type AuthModalMode = "login" | "register";

export interface AuthFormErrors {
  name?: string;
  email?: string;
  password?: string;
  general?: string;
}

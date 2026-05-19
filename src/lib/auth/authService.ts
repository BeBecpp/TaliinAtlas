import {
  clearSession,
  findUserByEmail,
  findUserById,
  loadSession,
  saveSession,
  upsertUser,
} from "./authStorage";
import type { AuthFormErrors, Session, StoredUser, User } from "./types";

const DEMO_EMAIL = "demo@taliin-atlas.local";
const DEMO_PASSWORD = "demo1234";
const DEMO_NAME = "Demo Learner";

export function toPublicUser(stored: StoredUser): User {
  return {
    id: stored.id,
    name: stored.name,
    email: stored.email,
    createdAt: stored.createdAt,
  };
}

export function validateEmail(email: string): string | undefined {
  if (!email.trim()) return "Email is required.";
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!pattern.test(email.trim())) return "Enter a valid email address.";
  return undefined;
}

export function validatePassword(password: string): string | undefined {
  if (!password) return "Password is required.";
  if (password.length < 6) return "Password must be at least 6 characters.";
  return undefined;
}

export function validateName(name: string): string | undefined {
  if (!name.trim()) return "Name is required.";
  return undefined;
}

export function getCurrentSession(): Session | null {
  return loadSession();
}

export function getCurrentUser(): User | null {
  const session = loadSession();
  if (!session) return null;
  const stored = findUserById(session.userId);
  return stored ? toPublicUser(stored) : null;
}

function createSession(user: StoredUser): Session {
  const session: Session = {
    userId: user.id,
    email: user.email,
    loggedInAt: new Date().toISOString(),
  };
  saveSession(session);
  return session;
}

export function register(
  name: string,
  email: string,
  password: string
): { user: User; session: Session } | { errors: AuthFormErrors } {
  const errors: AuthFormErrors = {};
  const nameError = validateName(name);
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);
  if (nameError) errors.name = nameError;
  if (emailError) errors.email = emailError;
  if (passwordError) errors.password = passwordError;
  if (Object.keys(errors).length > 0) return { errors };

  if (findUserByEmail(email)) {
    return { errors: { email: "An account with this email already exists." } };
  }

  const stored: StoredUser = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
    createdAt: new Date().toISOString(),
  };
  upsertUser(stored);
  const session = createSession(stored);
  return { user: toPublicUser(stored), session };
}

export function login(
  email: string,
  password: string
): { user: User; session: Session } | { errors: AuthFormErrors } {
  const errors: AuthFormErrors = {};
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);
  if (emailError) errors.email = emailError;
  if (passwordError) errors.password = passwordError;
  if (Object.keys(errors).length > 0) return { errors };

  const stored = findUserByEmail(email);
  if (!stored || stored.password !== password) {
    return { errors: { general: "Invalid email or password." } };
  }

  const session = createSession(stored);
  return { user: toPublicUser(stored), session };
}

export function logout(): void {
  clearSession();
}

export function continueAsDemo(): { user: User; session: Session } {
  let stored = findUserByEmail(DEMO_EMAIL);
  if (!stored) {
    stored = {
      id: crypto.randomUUID(),
      name: DEMO_NAME,
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      createdAt: new Date().toISOString(),
    };
    upsertUser(stored);
  }
  const session = createSession(stored);
  return { user: toPublicUser(stored), session };
}

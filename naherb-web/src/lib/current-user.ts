import type { CurrentUser } from "@/services/generated/model/currentUser";
import type { Role } from "@/services/generated/model/role";

export type SessionUser = {
  id?: string;
  email?: string;
  name?: string;
  role?: Role;
  avatarUrl?: string | null;
};

type FlatUserResponse = SessionUser;
type WrappedCurrentUser = {
  data?: CurrentUser | FlatUserResponse | { user?: CurrentUser | FlatUserResponse };
};

export function extractSessionUser(response: unknown): SessionUser | undefined {
  if (!response || typeof response !== "object") {
    return undefined;
  }

  const flat = response as FlatUserResponse;
  if (flat.role || flat.email || flat.name) {
    return flat;
  }

  const wrapped = response as WrappedCurrentUser;
  const data = wrapped.data;
  if (!data || typeof data !== "object") {
    return undefined;
  }

  const dataAsUser = data as FlatUserResponse;
  if (dataAsUser.role || dataAsUser.email || dataAsUser.name) {
    return dataAsUser;
  }

  const authData = data as { user?: CurrentUser | FlatUserResponse };
  if (authData.user) {
    return extractSessionUser(authData.user);
  }

  const currentUser = data as CurrentUser;
  return {
    id: currentUser.account?.id,
    email: currentUser.account?.email,
    name: currentUser.account?.name,
    role: currentUser.account?.role,
    avatarUrl: currentUser.profile?.avatarUrl,
  };
}

export function isAdminSession(response: unknown): boolean {
  return extractSessionUser(response)?.role === "ADMIN";
}

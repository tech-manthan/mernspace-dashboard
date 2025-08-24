import type { User } from "./user.type";

export interface AuthStoreState {
  user: User | null;
  setUser: (user: User) => void;
  removeUser: () => void;
  hasUser: () => boolean;
}

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type PermissionsStore = {
  permissions: string[];
  setPermissions: (permissions: string[]) => void;
  clearPermissions: () => void;
};

export const usePermissionsStore = create<PermissionsStore>()(
  persist(
    (set) => ({
      permissions: [],
      setPermissions: (permissions): void => set({ permissions }),
      clearPermissions: (): void => set({ permissions: [] }),
    }),
    {
      name: "permissions-storage", // Имя для хранения в localStorage
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

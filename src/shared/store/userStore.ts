import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface StoreState {
  name: string;
  setName: (value: string) => void;
  b: string | undefined;
  setB: (value: string | undefined) => void;
  email: string;
  setEmail: (value: string) => void;
  isEdit: boolean;
  setIsEdit: (value: boolean) => void;
  canDelete: boolean;
  setCanDelete: (value: boolean) => void;
  canCreate: boolean;
  setCanCreate: (value: boolean) => void;
  clearStore: () => void;
}

export const userStore = create(
  persist<StoreState>(
    (set) => ({
      name: "",
      setName: (value: string): void => set({ name: value }),
      b: "",
      setB: (value: string | undefined): void => set({ b: value }),
      email: "",
      setEmail: (value: string): void => set({ email: value }),
      isEdit: true,
      setIsEdit: (value: boolean): void => set({ isEdit: value }),
      canDelete: true,
      setCanDelete: (value: boolean): void => set({ canDelete: value }),
      canCreate: true,
      setCanCreate: (value: boolean): void => set({ canCreate: value }),
      clearStore: (): void => {
        set({ isEdit: false });
        localStorage.removeItem("user-info");
      },
    }),
    {
      name: "user-info",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

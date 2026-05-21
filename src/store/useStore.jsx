import { create } from "zustand";

const useStore = create((set) => ({
  darkMode: false,

  toggleDarkMode: () =>
    set((state) => ({
      darkMode: !state.darkMode,
    })),
}));

export default useStore;

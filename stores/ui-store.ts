"use client";

import { create } from "zustand";

type UiState = {
  activeCollection: "banks" | "fixed-income" | "macro";
  activeNavigation: string;
  sidebarCollapsed: boolean;
  setActiveCollection: (collection: UiState["activeCollection"]) => void;
  setActiveNavigation: (item: string) => void;
  toggleSidebar: () => void;
};

export const useUiStore = create<UiState>((set) => ({
  activeCollection: "banks",
  activeNavigation: "dashboard",
  sidebarCollapsed: false,
  setActiveCollection: (collection) => set({ activeCollection: collection }),
  setActiveNavigation: (item) => set({ activeNavigation: item }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}));

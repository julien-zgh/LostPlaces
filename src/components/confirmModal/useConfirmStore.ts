// stores/useConfirmStore.ts
import { ReactNode } from "react";
import { create } from "zustand";

interface ConfirmState {
  isOpen: boolean;
  title?: string | ReactNode;
  message?: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  resolve?: () => void;
  reject?: () => void;
  show: (
    options: Omit<ConfirmState, "isOpen" | "show" | "hide"> & {
      resolve: () => void;
      reject: () => void;
    },
  ) => void;
  hide: () => void;
}

export const useConfirmStore = create<ConfirmState>((set) => ({
  isOpen: false,
  show: (options) =>
    set(() => ({
      isOpen: true,
      ...options,
    })),
  hide: () =>
    set(() => ({
      isOpen: false,
      title: "",
      message: "",
      confirmText: "",
      cancelText: "",
      resolve: undefined,
      reject: undefined,
    })),
}));

// utils/confirm.ts

import { ReactNode } from "react";
import { useConfirmStore } from "./useConfirmStore";

export function confirm(options: {
  title?: string | ReactNode;
  message?: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
}): Promise<void> {
  return new Promise((resolve, reject) => {
    useConfirmStore.getState().show({
      ...options,
      resolve,
      reject,
    });
  });
}

"use client";
// components/modals/ConfirmModal.tsx
import { useEffect } from "react";
import { useConfirmStore } from "./useConfirmStore";
import GeneralModal from "../Modal/GeneralModal";

export const ConfirmModal = () => {
  const isOpen = useConfirmStore((state) => state.isOpen);
  const message = useConfirmStore((state) => state.message);
  const title = useConfirmStore((state) => state.title);
  const confirmText = useConfirmStore((state) => state.confirmText);
  const cancelText = useConfirmStore((state) => state.cancelText);
  const resolve = useConfirmStore((state) => state.resolve);
  const reject = useConfirmStore((state) => state.reject);
  const hide = useConfirmStore((state) => state.hide);

  useEffect(() => {
    return () => {
      hide();
    };
  }, [hide]);

  const handleCancel = () => {
    reject?.();
    hide();
  };

  const handleConfirm = () => {
    resolve?.();
    hide();
  };

  return (
    <GeneralModal isOpen={isOpen} onClose={handleCancel}>
      <div className="p-4">
        <div>{title || "Are you sure?"}</div>
        <div className="text-sm text-gray-600">{message}</div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="rounded-md border bg-white px-4 py-2 text-sm shadow-sm hover:bg-gray-50"
          >
            {cancelText || "Cancel"}
          </button>
          <button
            onClick={handleConfirm}
            className="rounded-md bg-red-600 px-4 py-2 text-sm text-white shadow-sm hover:bg-red-700"
          >
            {confirmText || "Confirm"}
          </button>
        </div>
      </div>
    </GeneralModal>
  );
};

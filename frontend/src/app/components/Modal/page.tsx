"use client";

import { ReactNode, useEffect } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  modalSize?: string;
  zIndex?: number;
  children: ReactNode;
};

const Modal = ({ open, onClose, title, modalSize = "max-w-md", zIndex = 50, children }: ModalProps) => {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onClose}
      style={{ zIndex }}
    >
      <div
        className={`relative w-full ${modalSize} rounded-xl bg-zinc-900 shadow-xl p-6`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div>
            <h2 className="text-lg font-semibold text-white mb-4 ">{title}</h2>
            <div className="absolute top-4 right-4">
              <button
                onClick={onClose}
                className="text-white hover:text-gray-300 cursor-pointer"
              >
                <i className="fa fa-times"></i>
              </button>
            </div>
          </div>
        )}

        <div className="text-zinc-300 ">{children}</div>
      </div>
    </div>
  );
};

export default Modal;

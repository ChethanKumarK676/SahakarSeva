/* Modal
 * A bottom-sheet modal for things like Book, Post-a-Job, SOS, Rate. Renders
 * inside the phone frame, with a dark backdrop that fills the phone area
 * (not the whole browser window). Drag-to-dismiss is nice-to-have, not
 * required for the demo.
 */
"use client";

import { useEffect, type ReactNode } from "react";

export function Modal({
  open,
  onClose,
  title,
  children,
  footer
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="absolute inset-0 z-40 flex items-end justify-center">
      <div
        className="absolute inset-0 bg-ink-900/40"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative w-full bg-white rounded-t-3xl shadow-xl max-h-[80%] overflow-hidden flex flex-col">
        <div className="px-5 pt-3 pb-2 flex items-center justify-between border-b border-ink-100">
          <div className="w-8 h-1 bg-ink-200 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-2" />
          {title ? (
            <h3 className="text-[14px] font-semibold text-ink-900">{title}</h3>
          ) : (
            <span />
          )}
          <button
            onClick={onClose}
            className="text-ink-500 text-[18px] leading-none"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="px-5 py-4 overflow-y-auto">{children}</div>
        {footer ? <div className="px-5 py-3 border-t border-ink-100 bg-ink-50">{footer}</div> : null}
      </div>
    </div>
  );
}

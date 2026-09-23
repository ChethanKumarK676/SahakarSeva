/* SOSButton
 * Shield icon button used on active-job cards (both customer and worker
 * sides). Tapping it shows the SOS sheet which dials 100 and alerts the
 * safety desk.
 */
"use client";

import { useState } from "react";

export function SOSButton({ onTrigger }: { onTrigger: () => void }) {
  return (
    <button
      onClick={onTrigger}
      aria-label="Safety & SOS"
      className="w-10 h-10 rounded-full bg-orange-500 text-white text-lg flex items-center justify-center shadow-md active:scale-95 transition"
    >
      🛡
    </button>
  );
}

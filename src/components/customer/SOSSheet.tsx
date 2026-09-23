"use client";

/* SOSSheet
 * One-tap to 100 + safety-desk alert. In the demo the alert is a toast —
 * a real implementation would notify the safety-desk webhook and show
 * the customer the audit log.
 */
import { Modal } from "@/components/Modal";

export function SOSSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="Safety & SOS">
      <div className="space-y-3">
        <div className="rounded-2xl bg-danger-500/10 border border-danger-500/30 p-4 text-[12px] text-ink-700 leading-snug">
          <div className="text-[13px] font-semibold text-danger-500">
            One tap to 100 + cooperative safety desk
          </div>
          <p className="mt-1">
            Tap the button below to dial the police (100) and notify the 24×7
            cooperative safety desk. Your active booking's full audit log
            (worker ID, time, location, check-ins) is shared with both.
          </p>
        </div>

        <a
          href="tel:100"
          className="block w-full text-center bg-danger-500 text-white text-[14px] font-semibold rounded-full py-3"
        >
          🛡 Call 100 + alert safety desk
        </a>

        <div className="text-[11px] text-ink-500 leading-snug px-1">
          The cooperative helpline (1800-419-2400) is also available for
          non-emergency help.
        </div>
      </div>
    </Modal>
  );
}

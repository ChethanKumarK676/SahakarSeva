"use client";

/* RateSheet
 * 5-star + comment, posts to /api/rate.
 */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/Modal";

export function RateSheet({
  open,
  onClose,
  bookingId
}: {
  open: boolean;
  onClose: () => void;
  bookingId: string | null;
}) {
  const router = useRouter();
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    if (!bookingId) return;
    setSubmitting(true);
    await fetch("/api/rate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ bookingId, stars, comment })
    });
    setSubmitting(false);
    onClose();
    router.refresh();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Rate this booking"
      footer={
        <button
          onClick={submit}
          disabled={submitting}
          className="w-full bg-orange-500 text-white text-[14px] font-semibold rounded-full py-3 disabled:opacity-60"
        >
          {submitting ? "Sending…" : "Submit rating"}
        </button>
      }
    >
      <div className="space-y-3">
        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => setStars(n)}
              className={`text-3xl ${n <= stars ? "text-orange-500" : "text-ink-200"}`}
            >
              ★
            </button>
          ))}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          placeholder="How did it go?"
          className="w-full text-[12px] rounded-2xl border border-ink-100 bg-white px-3 py-2.5"
        />
      </div>
    </Modal>
  );
}

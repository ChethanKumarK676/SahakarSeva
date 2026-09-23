"use client";

/* AppBar
 * Shows the cooperative wordmark, the current persona name, and the
 * role-switch pill. The role switch is the most distinctive UI element
 * of this app: it's how a single browser tab shows both sides of the
 * marketplace, and the demo hinges on it.
 */
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export type AppBarProps = {
  role: "customer" | "worker";
  name: string;
  subtitle?: string;
};

export function AppBar({ role, name, subtitle }: AppBarProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const switchTo = role === "customer" ? "worker" : "customer";

  function onSwitch() {
    startTransition(async () => {
      await fetch("/api/role", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ role: switchTo })
      });
      router.refresh();
    });
  }

  return (
    <header className="px-5 pt-3 pb-2 bg-green-900 text-white flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center font-bold text-sm">
          SS
        </div>
        <div>
          <div className="text-[15px] font-semibold leading-tight">SahakarSeva</div>
          {subtitle ? (
            <div className="text-[10px] text-green-100 leading-tight">{subtitle}</div>
          ) : null}
        </div>
      </div>
      <button
        onClick={onSwitch}
        disabled={pending}
        className="text-[11px] font-semibold bg-white/10 hover:bg-white/20 active:bg-white/30 transition rounded-full px-3 py-1.5 flex items-center gap-1.5 disabled:opacity-60"
        aria-label="Switch role"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
        {role === "customer" ? "I'm a Worker" : "I'm a Customer"}
      </button>
    </header>
  );
}

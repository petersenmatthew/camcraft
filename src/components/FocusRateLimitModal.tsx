"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  open: boolean;
  retryAfterSeconds: number | null;
  reason: string | null;
  onClose: () => void;
};

function formatRetryTime(retryAfterSeconds: number | null): string {
  if (!retryAfterSeconds || retryAfterSeconds <= 0) return "a moment";
  if (retryAfterSeconds < 60) {
    return `${retryAfterSeconds} second${retryAfterSeconds === 1 ? "" : "s"}`;
  }

  const minutes = Math.ceil(retryAfterSeconds / 60);
  return `${minutes} minute${minutes === 1 ? "" : "s"}`;
}

export default function FocusRateLimitModal({
  open,
  retryAfterSeconds,
  reason,
  onClose,
}: Props) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const retryLabel = formatRetryTime(retryAfterSeconds);
  const detail =
    reason === "window"
      ? "Too many focus attempts were made from this connection in a short period."
      : "Focus was triggered again before the cooldown finished.";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[220] flex items-center justify-center px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            aria-label="Close focus limit popup"
            className="absolute inset-0 bg-[#050507]/90 backdrop-blur-xl"
            onClick={onClose}
          />

          <div
            className="pointer-events-none absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat",
              backgroundSize: "128px 128px",
            }}
          />

          <motion.div
            className="relative z-10 w-full max-w-md overflow-hidden rounded-[28px] border border-[#B0FBCD]/15 bg-[#050507]/92 shadow-2xl shadow-black/50"
            initial={{ y: 18, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 10, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#B0FBCD]/30 to-transparent" />

            <div className="px-6 py-7 sm:px-7">
              <div
                className="mb-4 inline-flex rounded-full border border-[#B0FBCD]/20 bg-[#B0FBCD]/10 px-3 py-1 text-[10px] tracking-[0.28em] uppercase text-[#B0FBCD]/75"
                style={{ fontFamily: "var(--font-geist-mono)" }}
              >
                Focus Protection
              </div>

              <h2 className="text-2xl font-light tracking-tight text-white/90">
                Focus temporarily limited
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-white/55">
                CamCraft slows down repeat focus requests to protect the AI endpoint from abuse and keep the experience available.
              </p>

              <div className="mt-5 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
                <div
                  className="text-[11px] tracking-[0.28em] uppercase text-[#B0FBCD]/55"
                  style={{ fontFamily: "var(--font-geist-mono)" }}
                >
                  Why You Saw This
                </div>
                <p className="mt-2 text-sm leading-relaxed text-white/68">
                  {detail}
                </p>

                <div className="mt-4 flex items-center justify-between rounded-xl border border-[#B0FBCD]/12 bg-[#B0FBCD]/[0.05] px-3 py-2">
                  <span
                    className="text-[10px] tracking-[0.24em] uppercase text-[#B0FBCD]/60"
                    style={{ fontFamily: "var(--font-geist-mono)" }}
                  >
                    Retry Window
                  </span>
                  <span className="text-sm text-[#B0FBCD]/88">
                    {retryLabel}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="mt-6 inline-flex w-full items-center justify-center rounded-xl border border-[#B0FBCD]/22 bg-[#B0FBCD]/10 px-4 py-3 text-sm tracking-[0.18em] uppercase text-[#B0FBCD]/85 transition-all duration-300 hover:border-[#B0FBCD]/35 hover:bg-[#B0FBCD]/15 hover:text-[#B0FBCD]"
                style={{ fontFamily: "var(--font-geist-mono)" }}
              >
                Keep Exploring
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

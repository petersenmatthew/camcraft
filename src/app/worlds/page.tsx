"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NextImage from "next/image";
import { motion } from "framer-motion";
import { NavButton } from "@/components/NavButton";
import { WorldCard } from "@/components/WorldPickerModal";
import { SAMPLE_WORLDS } from "@/lib/sampleWorlds";

export default function WorldsPage() {
  const router = useRouter();

  const handleSelectWorld = useCallback(
    (panoPath: string) => {
      router.push(`/generate?pano=${encodeURIComponent(panoPath)}`);
    },
    [router]
  );

  return (
    <div className="min-h-screen bg-[#050507] text-white">
      {/* Grain overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#050507]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4 sm:px-10">
          <div className="flex items-center gap-4">
            <Link href="/" aria-label="Home" className="relative shrink-0">
              <div
                className="absolute inset-0 blur-lg opacity-25 rounded-full"
                style={{ background: "rgba(176,251,205,0.4)", transform: "scale(1.6)" }}
              />
              <NextImage
                src="/logo.png"
                alt="CamCraft"
                width={28}
                height={28}
                className="relative h-7 w-7 object-contain drop-shadow-[0_0_10px_rgba(176,251,205,0.15)]"
              />
            </Link>
            <div className="h-4 w-px bg-white/[0.08]" />
            <NavButton href="/create" icon="back" label="Back" variant="header" />
          </div>

          <h1
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-sm tracking-[0.25em] uppercase text-white/70"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            World Library
          </h1>

          <span
            className="rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-[10px] tracking-[0.25em] uppercase text-white/35"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            Sample Worlds Only
          </span>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-6 sm:px-10">
        {/* Sub-label */}
        <div className="mt-8 mb-6 flex items-end justify-between">
          <div>
            <h2
              className="text-xl text-white/85 leading-tight mb-1"
              style={{ fontFamily: "var(--font-geist-sans)" }}
            >
              Choose a World
            </h2>
            <p
              className="text-xs text-white/30"
              style={{ fontFamily: "var(--font-geist-mono)" }}
            >
              {SAMPLE_WORLDS.length} sample world{SAMPLE_WORLDS.length !== 1 ? "s" : ""} —
              click any to enter
            </p>
          </div>
        </div>

        {/* World grid */}
        <div className="pb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SAMPLE_WORLDS.map((world, i) => (
              <motion.div
                key={world.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: 0.08 + i * 0.04,
                  ease: "easeOut",
                }}
              >
                <WorldCard
                  world={world}
                  onClick={() => handleSelectWorld(world.panoPath)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

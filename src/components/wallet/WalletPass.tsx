"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, type ReactNode } from "react";
import { LumenMark } from "@/components/brand/LumenMark";
import type { PassFace } from "./pass-face";

export type { PassFace } from "./pass-face";

/**
 * A pixel-faithful rendering of the generic pass as Wallet lays it out:
 * logo and logo text with a header field on the right, a large primary
 * field, secondary and auxiliary rows, and the barcode at the bottom. The
 * ⓘ button flips to the details side with Wallet's toggles and back fields.
 */
export function WalletPass({
  face,
  qrSvg,
  width = 340,
  flippable = true,
  initiallyFlipped = false,
  className = "",
  shadow = true,
  logo,
}: {
  /** Replaces the Lumen mark for other issuers' passes. */
  logo?: ReactNode;
  face: PassFace;
  qrSvg?: string;
  width?: number;
  flippable?: boolean;
  initiallyFlipped?: boolean;
  className?: string;
  shadow?: boolean;
}) {
  const [flipped, setFlipped] = useState(initiallyFlipped);
  const h = width * 1.36;
  const s = width / 340; // scale factor so the pass stays proportional
  const fs = (px: number) => `${px * s}px`;

  return (
    <div className={`relative ${className}`} style={{ width, height: h, perspective: 1600 }}>
      <AnimatePresence initial={false} mode="wait">
        {!flipped ? (
          <motion.div
            key="front"
            className="absolute inset-0"
            initial={{ rotateY: -90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: 90, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div
              className={`relative flex h-full w-full flex-col overflow-hidden ${shadow ? "shadow-pass" : ""}`}
              style={{
                borderRadius: 14 * s,
                background: `linear-gradient(160deg, ${face.colors.bg} 0%, ${face.colors.deep} 125%)`,
                color: face.colors.fg,
                padding: 14 * s,
                fontFamily: "var(--font-sans)",
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between" style={{ marginBottom: 18 * s }}>
                <div className="flex items-center" style={{ gap: 8 * s }}>
                  {logo ?? <LumenMark size={26 * s} color={face.colors.fg} />}
                  <span className="font-semibold" style={{ fontSize: fs(15), letterSpacing: "-0.01em" }}>
                    {face.logoText}
                  </span>
                </div>
                <div className="text-right">
                  <div className="uppercase" style={{ fontSize: fs(9.5), letterSpacing: "0.06em", color: face.colors.label, fontWeight: 600 }}>
                    {face.header.label}
                  </div>
                  <div style={{ fontSize: fs(15), fontWeight: 500 }}>{face.header.value}</div>
                </div>
              </div>

              {/* Primary */}
              <div style={{ marginBottom: 18 * s }}>
                <div className="uppercase" style={{ fontSize: fs(9.5), letterSpacing: "0.06em", color: face.colors.label, fontWeight: 600 }}>
                  {face.primary.label}
                </div>
                <div className="tabular" style={{ fontSize: fs(34), fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                  {face.primary.value}
                </div>
              </div>

              {/* Secondary */}
              <div className="flex items-start justify-between" style={{ gap: 12 * s, marginBottom: 14 * s }}>
                {face.secondary.map((f, i) => (
                  <div key={f.label} className={i === 1 ? "text-right" : ""} style={{ minWidth: 0 }}>
                    <div className="uppercase" style={{ fontSize: fs(9.5), letterSpacing: "0.06em", color: face.colors.label, fontWeight: 600 }}>
                      {f.label}
                    </div>
                    <div className="truncate tabular" style={{ fontSize: fs(15), fontWeight: 500, maxWidth: 190 * s }}>
                      {f.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Auxiliary */}
              <div className="flex items-start justify-between" style={{ gap: 12 * s }}>
                {face.auxiliary.map((f, i) => (
                  <div key={f.label} className={i === 1 ? "text-right" : ""}>
                    <div className="uppercase" style={{ fontSize: fs(9.5), letterSpacing: "0.06em", color: face.colors.label, fontWeight: 600 }}>
                      {f.label}
                    </div>
                    <div className="tabular" style={{ fontSize: fs(13), fontWeight: 500 }}>
                      {f.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Barcode */}
              <div className="mt-auto flex flex-col items-center" style={{ paddingTop: 16 * s }}>
                <div className="bg-white" style={{ borderRadius: 8 * s, padding: 8 * s, width: 118 * s, height: 118 * s }}>
                  {qrSvg ? <div className="h-full w-full [&>svg]:h-full [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: qrSvg }} /> : <div className="h-full w-full rounded bg-ink/10" />}
                </div>
                <div style={{ fontSize: fs(10), marginTop: 6 * s, color: face.colors.label, letterSpacing: "0.04em" }}>{face.serial}</div>
              </div>

              {flippable ? (
                <button
                  onClick={() => setFlipped(true)}
                  className="absolute flex items-center justify-center rounded-full border transition-colors hover:bg-white/15"
                  style={{ right: 12 * s, bottom: 12 * s, width: 22 * s, height: 22 * s, borderColor: "rgba(255,255,255,0.7)", fontSize: fs(12), fontWeight: 600, fontStyle: "italic", fontFamily: "Georgia, serif" }}
                  aria-label="Pass details"
                >
                  i
                </button>
              ) : null}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="back"
            className="absolute inset-0"
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className={`flex h-full w-full flex-col overflow-hidden bg-[#f2f2f7] text-ink ${shadow ? "shadow-pass" : ""}`} style={{ borderRadius: 14 * s, fontFamily: "var(--font-sans)" }}>
              <div className="flex items-center justify-between" style={{ padding: `${12 * s}px ${14 * s}px` }}>
                <span style={{ fontSize: fs(15), fontWeight: 600 }}>{face.logoText}</span>
                <button onClick={() => setFlipped(false)} className="text-blue" style={{ fontSize: fs(15), fontWeight: 600 }}>
                  Done
                </button>
              </div>
              <div className="no-scrollbar flex-1 overflow-y-auto" style={{ padding: `0 ${14 * s}px ${14 * s}px` }}>
                <div className="overflow-hidden bg-white" style={{ borderRadius: 12 * s }}>
                  {["Automatic Updates", "Allow Notifications", "Suggest on Lock Screen"].map((t, i) => (
                    <div key={t} className={`flex items-center justify-between ${i ? "border-t border-line-2" : ""}`} style={{ padding: `${10 * s}px ${12 * s}px`, fontSize: fs(13.5) }}>
                      <span>{t}</span>
                      <span className="relative inline-block rounded-full bg-green" style={{ width: 40 * s, height: 24 * s }}>
                        <span className="absolute rounded-full bg-white shadow" style={{ width: 20 * s, height: 20 * s, top: 2 * s, right: 2 * s }} />
                      </span>
                    </div>
                  ))}
                </div>
                <div className="overflow-hidden bg-white" style={{ borderRadius: 12 * s, marginTop: 12 * s }}>
                  {face.back.map((f, i) => (
                    <div key={f.label} className={i ? "border-t border-line-2" : ""} style={{ padding: `${10 * s}px ${12 * s}px` }}>
                      <div className="uppercase text-ink-4" style={{ fontSize: fs(10), letterSpacing: "0.06em", fontWeight: 600 }}>
                        {f.label}
                      </div>
                      {f.href ? (
                        <a href={f.href} className="text-blue underline-offset-2 hover:underline" style={{ fontSize: fs(13.5) }}>
                          {f.value}
                        </a>
                      ) : (
                        <div className="text-ink-2" style={{ fontSize: fs(12.5), lineHeight: 1.4 }}>
                          {f.value}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <button className="mt-3 w-full bg-white text-red" style={{ borderRadius: 12 * s, padding: `${11 * s}px`, fontSize: fs(14), fontWeight: 500 }} type="button">
                  Remove Pass
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

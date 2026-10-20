"use client";

import { useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { PassView } from "@/lib/data/derive";
import { WalletPass, type PassFace } from "@/components/wallet/WalletPass";
import { IPhoneFrame } from "@/components/wallet/IPhoneFrame";
import { AddToAppleWallet, AddToGoogleWallet } from "@/components/wallet/AddToWallet";
import { advanceOrderAction, markPassAddedAction } from "@/app/actions";
import { Icon } from "@/components/ui/Icon";

/**
 * The iPhone with the pass inside Wallet, plus the add and update journey.
 * "Add" asks for confirmation the way iOS does; the demo controls push the
 * order forward and the pass re-renders with a bumped version, which is what
 * a server-driven update looks like on a phone.
 */
export function WalletScreen({ view, face, qrSvg }: { view: PassView; face: PassFace; qrSvg: string }) {
  const [sheet, setSheet] = useState<"none" | "apple" | "google">(view.pass.platform ? "none" : "none");
  const [toast, setToast] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const added = !!view.pass.platform;

  const nextStep =
    view.order.status === "payment_pending"
      ? { label: "Simulate: funds cleared (North Capital webhook)", hint: "Payment clears into escrow; pass stays pending" }
      : view.order.status === "payment_cleared"
        ? { label: "Simulate: subscription accepted", hint: "Accepted for the next closing; still not ownership" }
        : view.order.status === "accepted"
          ? { label: "Simulate: transfer agent confirms issuance (Kore webhook)", hint: "Pass flips to confirmed shares and indicative value" }
          : null;

  const flash = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 2600);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <IPhoneFrame width={330} screenClassName="bg-[#0b0b0d]">
          <div className="flex h-full flex-col px-[14px]">
            <div className="mb-3 flex items-center justify-between text-white">
              <span className="text-[26px] font-bold tracking-[-0.02em]">Wallet</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-[18px] leading-none">+</span>
            </div>
            <div className="relative flex-1">
              <WalletPass face={face} qrSvg={qrSvg} width={302} flippable />
            </div>
          </div>

          {/* iOS add-to-wallet sheet */}
          <AnimatePresence>
            {sheet !== "none" ? (
              <motion.div className="absolute inset-0 z-30 flex items-end bg-black/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <motion.div
                  className="w-full rounded-t-[32px] bg-[#1c1c1e] p-5 text-white"
                  initial={{ y: 400 }}
                  animate={{ y: 0 }}
                  exit={{ y: 400 }}
                  transition={{ type: "spring", stiffness: 380, damping: 36 }}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <button className="text-[15px] text-blue" onClick={() => setSheet("none")}>Cancel</button>
                    <span className="text-[15px] font-semibold">Add Pass</span>
                    <button
                      className="text-[15px] font-semibold text-blue"
                      disabled={pending}
                      onClick={() =>
                        start(async () => {
                          await markPassAddedAction(view.pass.id, sheet === "apple" ? "apple" : "google");
                          setSheet("none");
                          flash(sheet === "apple" ? "Added to Apple Wallet" : "Added to Google Wallet");
                        })
                      }
                    >
                      {pending ? "Adding…" : "Add"}
                    </button>
                  </div>
                  <div className="flex justify-center">
                    <WalletPass face={face} qrSvg={qrSvg} width={250} flippable={false} />
                  </div>
                  <p className="mt-4 text-center text-[12px] text-white/50">
                    {face.logoText} will show your name and holding on this pass. The pass grants no account access.
                  </p>
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <AnimatePresence>
            {toast ? (
              <motion.div className="absolute left-1/2 top-16 z-40 -translate-x-1/2 rounded-full bg-white px-4 py-2 text-[13px] font-medium text-ink shadow-lift" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                {toast}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </IPhoneFrame>
      </div>

      {/* Add buttons */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {added ? (
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[13px] font-medium text-white">
            <Icon name="check" size={15} className="text-green" />
            In {view.pass.platform === "apple" ? "Apple Wallet" : "Google Wallet"} since {new Date(view.pass.addedAt!).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })}
          </div>
        ) : (
          <>
            <AddToAppleWallet onClick={() => setSheet("apple")} />
            <AddToGoogleWallet onClick={() => setSheet("google")} />
          </>
        )}
      </div>

      {/* Demo controls */}
      <div className="mt-8 w-full max-w-[420px] rounded-[24px] border border-gold/30 bg-gold/[0.06] p-4">
        <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-gold">
          <Icon name="sparkle" size={14} /> Demo controls · server-driven updates
        </div>
        {nextStep ? (
          <button
            disabled={pending}
            onClick={() =>
              start(async () => {
                await advanceOrderAction(view.order.id, view.pass.id);
                flash(`Pass updated to v${view.pass.version + 1}`);
              })
            }
            className="mt-3 flex w-full items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 text-left text-ink transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
          >
            <span>
              <span className="block text-[14px] font-semibold">{nextStep.label}</span>
              <span className="block text-[12px] text-ink-3">{nextStep.hint}</span>
            </span>
            <Icon name="arrow-right" size={18} className="shrink-0 text-blue" />
          </button>
        ) : (
          <p className="mt-3 text-[13px] text-white/60">
            {view.holdingStatus === "issued" ? "This investment is issued. The pass shows confirmed shares, the registered owner from the transfer agent, and an indicative value with its date." : "No further transitions for this order in the demo."}
          </p>
        )}
        <p className="mt-3 text-[11px] leading-relaxed text-white/40">
          In production each step is triggered by a verified provider webhook, reconciled against internal records, then queued as a pass update and APNs push. Nothing is confirmed from a browser success page.
        </p>
      </div>
    </div>
  );
}

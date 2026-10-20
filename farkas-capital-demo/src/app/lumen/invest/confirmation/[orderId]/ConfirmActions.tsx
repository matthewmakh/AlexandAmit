"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { markPassAddedAction } from "@/app/actions";
import { AddToAppleWallet, AddToGoogleWallet } from "@/components/wallet/AddToWallet";
import { TextLink } from "@/components/ui/Button";

/** The add action asks for confirmation, like iOS, then opens the pass in Wallet. */
export function ConfirmActions({ passId, issuerName, dashboardUrl }: { passId: string; issuerName: string; dashboardUrl: string }) {
  const router = useRouter();
  const [ask, setAsk] = useState<"apple" | "google" | null>(null);
  const [pending, start] = useTransition();

  const confirm = () => {
    if (!ask) return;
    const platform = ask;
    start(async () => {
      await markPassAddedAction(passId, platform);
      router.push(`/wallet/${passId}`);
    });
  };

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center gap-3">
        <AddToAppleWallet onClick={() => setAsk("apple")} />
        <AddToGoogleWallet onClick={() => setAsk("google")} />
      </div>
      <div className="mt-4">
        <TextLink href={dashboardUrl}>View investor dashboard</TextLink>
      </div>
      <AnimatePresence>
        {ask ? (
          <motion.div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-5 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !pending && setAsk(null)}>
            <motion.div
              className="w-full max-w-[300px] overflow-hidden rounded-[22px] bg-[#f2f2f7]/95 text-center shadow-lift"
              initial={{ scale: 1.08, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal
            >
              <div className="px-5 pb-4 pt-5">
                <div className="text-[17px] font-semibold text-ink">Add to {ask === "apple" ? "Apple Wallet" : "Google Wallet"}?</div>
                <p className="mt-1.5 text-[13px] leading-snug text-ink-2">{issuerName} will show your registered name and holding on this pass. It grants no account access.</p>
              </div>
              <div className="grid grid-cols-2 divide-x divide-line border-t border-line text-[17px]">
                <button className="py-3 text-blue" onClick={() => setAsk(null)} disabled={pending}>Cancel</button>
                <button className="py-3 font-semibold text-blue" onClick={confirm} disabled={pending}>{pending ? "Adding…" : "Add"}</button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

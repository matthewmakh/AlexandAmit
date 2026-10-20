"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { IPhoneFrame } from "@/components/wallet/IPhoneFrame";
import { WalletPass } from "@/components/wallet/WalletPass";
import type { PassFace } from "@/components/wallet/pass-face";

/** The hero: an iPhone showing Wallet with passes from three companies, Lumen on top. */
export function HeroPhone({ faces, qrSvg }: { faces: { face: PassFace; logo?: ReactNode }[]; qrSvg: string }) {
  const w = 300;
  const offset = 58;
  return (
    <motion.div initial={{ opacity: 0, y: 40, rotate: -2 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1], delay: 0.15 }}>
      <IPhoneFrame width={330} screenClassName="bg-[#0b0b0d]">
        <div className="flex h-full flex-col px-[14px]">
          <div className="mb-3 flex items-center justify-between text-white">
            <span className="text-[26px] font-bold tracking-[-0.02em]">Wallet</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-[18px] leading-none">+</span>
          </div>
          <div className="relative flex-1">
            {faces.map((f, i) => (
              <motion.div
                key={i}
                className="absolute left-0 right-0"
                style={{ top: i * offset, zIndex: i + 1 }}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.12, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <WalletPass face={f.face} logo={f.logo} qrSvg={i === faces.length - 1 ? qrSvg : undefined} width={w} flippable={false} />
              </motion.div>
            ))}
          </div>
        </div>
      </IPhoneFrame>
    </motion.div>
  );
}

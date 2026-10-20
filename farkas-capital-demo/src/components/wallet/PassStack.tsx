"use client";

import { motion } from "framer-motion";
import { WalletPass } from "./WalletPass";
import type { PassFace } from "./pass-face";

/** Three issuers' passes stacked the way Wallet groups them. */
export function PassStack({ faces, width = 320 }: { faces: { face: PassFace; logo?: React.ReactNode }[]; width?: number }) {
  const h = width * 1.36;
  const offset = 64 * (width / 320);
  return (
    <div className="relative" style={{ width, height: h + offset * (faces.length - 1) }}>
      {faces.map((f, i) => (
        <motion.div
          key={i}
          className="absolute left-0"
          style={{ top: i * offset, zIndex: i + 1 }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.7, delay: i * 0.12, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <WalletPass face={f.face} logo={f.logo} width={width} flippable={false} />
        </motion.div>
      ))}
    </div>
  );
}

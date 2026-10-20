"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { investorLoginAction } from "@/app/actions";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { LumenTile } from "@/components/brand/LumenMark";

const DEMO_CODE = "482913";

/** Secure login for the issuer-website investor dashboard. Email code, no password. */
export function InvestorLogin({ issuerName, hint }: { issuerName: string; hint?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("jordan.ellis@example.com");
  const [stage, setStage] = useState<"email" | "code">("email");
  const [code, setCode] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [pending, start] = useTransition();

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="card p-8">
        <LumenTile size={44} />
        <h1 className="text-display-sm mt-5">Investor sign-in</h1>
        <p className="mt-2 text-[14px] text-ink-3">{hint ?? `Sign in to see your ${issuerName} investments, documents and updates.`}</p>
        {stage === "email" ? (
          <form
            className="mt-6"
            onSubmit={(e) => {
              e.preventDefault();
              setErr(null);
              setStage("code");
            }}
          >
            <label className="block">
              <span className="text-[13px] font-medium text-ink-3">Email address</span>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="mt-1.5 h-12 w-full rounded-2xl border border-line-2 bg-paper px-4 text-[15px] outline-none focus:border-lumen focus:shadow-[0_0_0_4px_rgba(43,92,255,0.15)]" />
            </label>
            <Button variant="brand" className="mt-4 w-full" size="lg">
              Send sign-in code
            </Button>
            <p className="mt-4 text-[12px] text-ink-4">Demo investor: jordan.ellis@example.com. Anyone who completed the checkout this session can also sign in with their email.</p>
          </form>
        ) : (
          <form
            className="mt-6"
            onSubmit={(e) => {
              e.preventDefault();
              if (code !== DEMO_CODE) {
                setErr("That code didn't match. Try 482913.");
                return;
              }
              start(async () => {
                const res = await investorLoginAction(email);
                if (!res.ok) setErr(res.message ?? "Sign-in failed");
                else router.refresh();
              });
            }}
          >
            <div className="flex items-start gap-2.5 rounded-2xl border border-gold/40 bg-gold-soft px-4 py-3 text-[13px] text-[#6b5208]">
              <Icon name="sparkle" size={15} className="mt-0.5 shrink-0 text-gold" />
              <span>No email is sent in this demo. Your code is <span className="font-mono font-semibold tracking-[0.2em]">{DEMO_CODE}</span>.</span>
            </div>
            <label className="mt-4 block">
              <span className="text-[13px] font-medium text-ink-3">Six-digit code sent to {email}</span>
              <input value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" autoFocus className="mt-1.5 h-12 w-full rounded-2xl border border-line-2 bg-paper px-4 text-center text-[22px] font-semibold tracking-[0.3em] outline-none focus:border-lumen" />
            </label>
            {err ? <p className="mt-2 text-[13px] text-red">{err}</p> : null}
            <Button variant="brand" className="mt-4 w-full" size="lg" disabled={pending || code.length !== 6}>
              {pending ? "Signing in…" : "Sign in"}
            </Button>
            <button type="button" className="mt-3 w-full text-[13px] text-blue hover:underline" onClick={() => setCode(DEMO_CODE)}>
              Fill the demo code
            </button>
          </form>
        )}
      </div>
      <p className="mt-4 text-center text-[12px] text-ink-4">Secure session · MFA by email code · Securities offered through Farkas Capital</p>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createCheckoutAction } from "@/app/actions";
import { LumenLogo } from "@/components/brand/LumenMark";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { money, number, date } from "@/lib/data/format";
import type { OwnerType, PaymentMethod } from "@/lib/data/types";

interface OfferingLite {
  name: string;
  pricePerShare: number;
  minInvestment: number;
  maxInvestment: number;
  documents: { id: string; name: string; pages: number }[];
  className: string;
  nextClosingAt: string;
}
interface IssuerLite {
  name: string;
  legalName: string;
  supportEmail: string;
  stablecoinEnabled: boolean;
}

const STEPS = [
  { key: "amount", title: "Amount", short: "Amount" },
  { key: "verify", title: "Verify email", short: "Email" },
  { key: "details", title: "Legal owner", short: "Details" },
  { key: "checks", title: "Identity & accreditation", short: "Checks" },
  { key: "sign", title: "Sign documents", short: "Sign" },
  { key: "pay", title: "Payment", short: "Pay" },
] as const;

const DEMO_CODE = "482913";
const PRESETS = [10_000, 25_000, 50_000, 100_000];
const STATES = ["TX", "CA", "NY", "FL", "WA", "IL", "MA", "CO", "GA", "NC", "AZ", "VA", "NJ", "OR", "PA"];

const fade = {
  initial: { opacity: 0, y: 14, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -10, filter: "blur(4px)" },
  transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as const },
};

/**
 * The investor checkout. Six steps, one screen each, branded as the issuer.
 * Every external step (email code, KYC/AML/accreditation, e-signature,
 * payment rails) is simulated here with the same states the real providers
 * return, so the flow, copy and failure handling can be judged.
 */
export function Checkout({ offering, issuer }: { offering: OfferingLite; issuer: IssuerLite }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [pending, start] = useTransition();

  // Form state
  const [amount, setAmount] = useState(25_000);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [ownerType, setOwnerType] = useState<OwnerType>("individual");
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [entityName, setEntityName] = useState("");
  const [region, setRegion] = useState("TX");
  const [accredMethod, setAccredMethod] = useState("Third-party verification letter (CPA)");
  const [signatureName, setSignatureName] = useState("");
  const [adopted, setAdopted] = useState(false);
  const [method, setMethod] = useState<PaymentMethod>("ach");
  const [walletConsent, setWalletConsent] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const shares = Math.floor(amount / offering.pricePerShare);
  const registeredName = ownerType === "individual" ? `${first} ${last}`.trim() : entityName.trim();
  const amountOk = amount >= offering.minInvestment && amount <= offering.maxInvestment && amount % offering.pricePerShare === 0;
  const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);

  const next = () => {
    setError(null);
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const back = () => {
    setError(null);
    setStep((s) => Math.max(0, s - 1));
  };

  const submit = () => {
    start(async () => {
      const res = await createCheckoutAction({
        firstName: first || registeredName.split(" ")[0] || "Investor",
        lastName: last || registeredName.split(" ").slice(1).join(" ") || "",
        email,
        ownerType,
        registeredName,
        region,
        amount,
        method,
        walletConsent,
      });
      router.push(`/lumen/invest/confirmation/${res.orderId}`);
    });
  };

  return (
    <main className="min-h-screen bg-canvas">
      {/* Top bar */}
      <header className="sticky top-0 z-40 glass">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
          <Link href="/lumen/invest" aria-label="Back to offering">
            <LumenLogo size={24} />
          </Link>
          <div className="hidden items-center gap-1 text-[12px] text-ink-3 md:flex">
            <Icon name="lock" size={13} /> Secure checkout
          </div>
          <Link href="/lumen/invest" className="text-[13px] font-medium text-blue hover:underline">
            Save and exit
          </Link>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-10 px-5 pb-28 pt-8 lg:grid-cols-[260px_1fr_300px] lg:pt-12">
        {/* Steps rail */}
        <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <ol className="flex gap-2 overflow-x-auto no-scrollbar lg:flex-col lg:gap-1">
            {STEPS.map((s, i) => {
              const state = i < step ? "done" : i === step ? "current" : "todo";
              return (
                <li key={s.key} className="shrink-0">
                  <button
                    onClick={() => i < step && setStep(i)}
                    disabled={i > step}
                    className={`flex items-center gap-3 rounded-full py-2 pl-2 pr-4 text-left text-[13px] transition-colors lg:w-full lg:rounded-2xl ${
                      state === "current" ? "bg-paper shadow-card" : state === "done" ? "hover:bg-paper/60" : "opacity-50"
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold ${
                        state === "done" ? "bg-green text-white" : state === "current" ? "bg-lumen text-white" : "bg-ink/[0.08] text-ink-3"
                      }`}
                    >
                      {state === "done" ? <Icon name="check" size={14} /> : i + 1}
                    </span>
                    <span className="hidden lg:block">
                      <span className="block font-medium text-ink">{s.title}</span>
                    </span>
                    <span className="font-medium text-ink lg:hidden">{s.short}</span>
                  </button>
                </li>
              );
            })}
          </ol>
          <p className="mt-6 hidden text-[12px] leading-relaxed text-ink-4 lg:block">
            Securities offered through Farkas Capital, a registered broker-dealer. Identity, sanctions and accreditation checks are performed by the rails provider. Your documents are stored encrypted.
          </p>
        </aside>

        {/* Step content */}
        <section className="min-w-0">
          <AnimatePresence mode="wait">
            <motion.div key={step} {...fade}>
              {step === 0 ? (
                <StepShell title="How much would you like to invest?" lede={`${offering.className} at ${money(offering.pricePerShare, true)} per share. Minimum ${money(offering.minInvestment)}, maximum ${money(offering.maxInvestment)}.`}>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {PRESETS.map((p) => (
                      <button key={p} onClick={() => setAmount(p)} className={`rounded-2xl border px-4 py-4 text-[15px] font-semibold tabular transition-all ${amount === p ? "border-lumen bg-lumen-soft text-lumen" : "border-line-2 bg-paper hover:border-line"}`}>
                        {money(p)}
                      </button>
                    ))}
                  </div>
                  <label className="mt-5 block">
                    <span className="text-[13px] font-medium text-ink-3">Or enter an amount</span>
                    <div className="mt-1.5 flex items-center rounded-2xl border border-line-2 bg-paper px-4 focus-within:border-lumen focus-within:shadow-[0_0_0_4px_rgba(43,92,255,0.15)]">
                      <span className="text-[22px] text-ink-4">$</span>
                      <input
                        inputMode="numeric"
                        value={amount.toLocaleString("en-US")}
                        onChange={(e) => setAmount(Number(e.target.value.replace(/[^0-9]/g, "")) || 0)}
                        className="h-14 w-full bg-transparent text-[24px] font-semibold tabular outline-none"
                        aria-label="Investment amount"
                      />
                    </div>
                  </label>
                  <div className="mt-4 rounded-2xl bg-paper p-4 text-[14px]">
                    <div className="flex justify-between"><span className="text-ink-3">Shares</span><span className="font-semibold tabular">{number(shares)}</span></div>
                    <div className="mt-1 flex justify-between"><span className="text-ink-3">Price per share</span><span className="tabular">{money(offering.pricePerShare, true)}</span></div>
                    <div className="mt-1 flex justify-between"><span className="text-ink-3">Fees to you</span><span className="tabular">$0.00</span></div>
                    <div className="mt-2 flex justify-between border-t border-line-2 pt-2 font-semibold"><span>Total</span><span className="tabular">{money(shares * offering.pricePerShare, true)}</span></div>
                  </div>
                  {!amountOk ? <p className="mt-3 text-[13px] text-red">Enter a whole number of shares between {money(offering.minInvestment)} and {money(offering.maxInvestment)}.</p> : null}
                  <label className="mt-6 block">
                    <span className="text-[13px] font-medium text-ink-3">Email address</span>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="mt-1.5 h-12 w-full rounded-2xl border border-line-2 bg-paper px-4 text-[15px] outline-none focus:border-lumen focus:shadow-[0_0_0_4px_rgba(43,92,255,0.15)]" />
                    <span className="mt-1.5 block text-[12px] text-ink-4">We&rsquo;ll send a six-digit code to create your access. No password.</span>
                  </label>
                  <Actions onNext={next} nextLabel="Send code" disabled={!amountOk || !emailOk} />
                </StepShell>
              ) : null}

              {step === 1 ? (
                <StepShell title="Enter the code we sent" lede={`Check ${email} for a six-digit code. It expires in 10 minutes.`}>
                  <DemoNote>In this demo no email is sent. Your code is <span className="font-mono font-semibold tracking-[0.2em]">{DEMO_CODE}</span>.</DemoNote>
                  <CodeInput value={code} onChange={setCode} />
                  {error ? <p className="mt-3 text-[13px] text-red">{error}</p> : null}
                  <button className="mt-4 text-[13px] font-medium text-blue hover:underline" onClick={() => setCode(DEMO_CODE)} type="button">
                    Fill the demo code
                  </button>
                  <Actions onBack={back} onNext={() => (code === DEMO_CODE ? next() : setError("That code didn't match. Try 482913."))} nextLabel="Verify" disabled={code.length !== 6} />
                </StepShell>
              ) : null}

              {step === 2 ? (
                <StepShell title="Who is the legal owner?" lede="The name entered here becomes the registered owner on the share register and on your Wallet pass. It must match your identity documents exactly.">
                  <div className="grid grid-cols-3 gap-2 rounded-full bg-ink/[0.06] p-1 text-[13px] font-medium">
                    {(["individual", "entity", "trust"] as OwnerType[]).map((t) => (
                      <button key={t} onClick={() => setOwnerType(t)} className={`rounded-full py-2 capitalize transition-all ${ownerType === t ? "bg-paper shadow-card text-ink" : "text-ink-3 hover:text-ink"}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <Field label="First name" value={first} onChange={setFirst} placeholder="Jordan" />
                    <Field label="Last name" value={last} onChange={setLast} placeholder="Ellis" />
                    {ownerType !== "individual" ? (
                      <Field label={ownerType === "entity" ? "Entity legal name" : "Trust legal name"} value={entityName} onChange={setEntityName} placeholder={ownerType === "entity" ? "Blue Harbor Holdings LLC" : "The Ellis Family Trust"} className="sm:col-span-2" />
                    ) : null}
                    <label className="block">
                      <span className="text-[13px] font-medium text-ink-3">State of residence</span>
                      <select value={region} onChange={(e) => setRegion(e.target.value)} className="mt-1.5 h-12 w-full rounded-2xl border border-line-2 bg-paper px-4 text-[15px] outline-none focus:border-lumen">
                        {STATES.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className="text-[13px] font-medium text-ink-3">Accreditation evidence</span>
                      <select value={accredMethod} onChange={(e) => setAccredMethod(e.target.value)} className="mt-1.5 h-12 w-full rounded-2xl border border-line-2 bg-paper px-4 text-[15px] outline-none focus:border-lumen">
                        {["Third-party verification letter (CPA)", "Income documentation (2 years)", "Net worth statement with broker letter", "Licensed professional (Series 7)"].map((m) => (
                          <option key={m}>{m}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <div className="mt-5 rounded-2xl border border-dashed border-line bg-paper p-5 text-center text-[13px] text-ink-3">
                    <Icon name="doc" size={20} className="mx-auto mb-2 text-ink-4" />
                    Upload your government ID and accreditation evidence here. In this demo the upload is skipped.
                  </div>
                  <Actions onBack={back} onNext={next} nextLabel="Run checks" disabled={!registeredName || (ownerType === "individual" && (!first || !last))} />
                </StepShell>
              ) : null}

              {step === 3 ? <ChecksStep onDone={next} onBack={back} registeredName={registeredName} accredMethod={accredMethod} /> : null}

              {step === 4 ? (
                <StepShell title="Sign your subscription documents" lede="Review each document, then adopt your signature. Signing is embedded; you never leave this page.">
                  <div className="space-y-3">
                    {offering.documents.map((d, i) => (
                      <div key={d.id} className="rounded-2xl border border-line-2 bg-paper p-5">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-lumen-soft text-lumen"><Icon name="doc" size={16} /></span>
                            <div>
                              <div className="text-[15px] font-medium">{d.name}</div>
                              <div className="text-[12px] text-ink-4">{d.pages} pages · {issuer.legalName}</div>
                            </div>
                          </div>
                          <span className="text-[12px] text-ink-4">{i + 1} of {offering.documents.length}</span>
                        </div>
                        <div className="mt-4 h-28 overflow-hidden rounded-xl bg-canvas p-4 text-[11px] leading-relaxed text-ink-4">
                          <p className="font-semibold text-ink-3">SUBSCRIPTION AGREEMENT</p>
                          <p>This Subscription Agreement is entered into by the undersigned (the &ldquo;Investor&rdquo;) and {issuer.legalName} (the &ldquo;Company&rdquo;) in connection with the Company&rsquo;s offering of shares of {offering.className} pursuant to Rule 506(c) of Regulation D. The Investor hereby irrevocably subscribes for {number(shares)} shares at {money(offering.pricePerShare, true)} per share for an aggregate purchase price of {money(shares * offering.pricePerShare, true)}…</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 rounded-2xl bg-paper p-5">
                    <div className="text-[13px] font-medium text-ink-3">Type your full legal name to adopt your signature</div>
                    <input value={signatureName} onChange={(e) => { setSignatureName(e.target.value); setAdopted(false); }} placeholder={registeredName} className="mt-2 h-12 w-full rounded-2xl border border-line-2 bg-canvas px-4 text-[15px] outline-none focus:border-lumen" />
                    <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl border border-line-2 px-5 py-4">
                      <div className="min-w-0">
                        <div className="text-[11px] uppercase tracking-[0.08em] text-ink-4">Signature</div>
                        <div className="truncate text-[28px] leading-tight text-ink" style={{ fontFamily: "'Snell Roundhand', 'Savoye LET', 'Brush Script MT', cursive", fontStyle: "italic" }}>{signatureName || " "}</div>
                      </div>
                      <Button variant={adopted ? "secondary" : "brand"} size="sm" disabled={signatureName.trim().length < 3} onClick={() => setAdopted(true)}>
                        {adopted ? <><Icon name="check" size={14} /> Adopted</> : "Adopt and sign"}
                      </Button>
                    </div>
                    <p className="mt-3 text-[12px] text-ink-4">By adopting, you agree to sign electronically under the E-SIGN Act. A completion certificate and signed PDFs are stored with your record and available in your investor dashboard.</p>
                  </div>
                  <Actions onBack={back} onNext={next} nextLabel="Continue to payment" disabled={!adopted} />
                </StepShell>
              ) : null}

              {step === 5 ? (
                <StepShell title="Fund your investment" lede={`Send ${money(shares * offering.pricePerShare, true)} to escrow. Funds are held by the approved escrow agent until the next closing on ${date(offering.nextClosingAt, "long")}.`}>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <MethodCard active={method === "ach"} onClick={() => setMethod("ach")} icon="bank" title="Bank transfer (ACH)" meta="3–5 business days · $1.50" />
                    <MethodCard active={method === "wire"} onClick={() => setMethod("wire")} icon="arrow-up-right" title="Wire" meta="Same or next day · $25" />
                    {issuer.stablecoinEnabled ? <MethodCard active={method === "stablecoin"} onClick={() => setMethod("stablecoin")} icon="coin" title="Pay with stablecoins" meta="USDC · minutes · 1% conversion" /> : null}
                  </div>

                  <div className="mt-5 rounded-2xl bg-paper p-5">
                    {method === "ach" ? (
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Routing number" value="021000021" onChange={() => {}} readOnly />
                        <Field label="Account number" value="•••• •••• 4471" onChange={() => {}} readOnly />
                        <p className="text-[12px] text-ink-4 sm:col-span-2">Connected through the rails provider. The demo uses a sandbox account; no money moves. You authorise a one-time debit of {money(shares * offering.pricePerShare, true)}.</p>
                      </div>
                    ) : null}
                    {method === "wire" ? (
                      <dl className="grid gap-3 text-[14px] sm:grid-cols-2">
                        <Row k="Beneficiary" v="Farkas Capital Escrow for Lumen Robotics, Inc." />
                        <Row k="Bank" v="Sandbox National Bank" />
                        <Row k="Routing" v="021000021" />
                        <Row k="Account" v="9900 1234 5678" />
                        <Row k="Reference" v={`LUMEN ${registeredName.toUpperCase()}`} />
                        <Row k="Amount" v={money(shares * offering.pricePerShare, true)} />
                      </dl>
                    ) : null}
                    {method === "stablecoin" ? (
                      <div className="grid gap-5 sm:grid-cols-[1fr_auto]">
                        <div>
                          <div className="grid gap-3 text-[14px] sm:grid-cols-2">
                            <Row k="Coin" v="USDC" />
                            <Row k="Network" v="Base" />
                            <Row k="Exact amount" v={`${(shares * offering.pricePerShare * 1.01).toLocaleString("en-US", { minimumFractionDigits: 2 })} USDC`} />
                            <Row k="Settles as" v={`${money(shares * offering.pricePerShare, true)} USD to escrow`} />
                          </div>
                          <div className="mt-4 rounded-xl bg-canvas px-4 py-3 font-mono text-[12px] text-ink-2 break-all">0x7F3a9C21d4E85b60F1cB2a7e9D0C4b3A1f6E8d2C</div>
                          <p className="mt-3 text-[12px] text-ink-4">Wallet screening and transaction monitoring run before confirmation. The platform never holds your crypto or keys; the provider converts to USD for settlement. Investment remains priced in USD.</p>
                          <Button variant="secondary" size="sm" className="mt-4">Connect wallet</Button>
                        </div>
                        <div className="flex h-36 w-36 items-center justify-center rounded-2xl border border-dashed border-line text-center text-[11px] text-ink-4">QR for the payment request</div>
                      </div>
                    ) : null}
                  </div>

                  <label className="mt-5 flex items-start gap-3 rounded-2xl bg-paper p-4 text-[13px]">
                    <input type="checkbox" checked={walletConsent} onChange={(e) => setWalletConsent(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[var(--color-lumen)]" />
                    <span className="text-ink-2">Show my registered name and holding on a {issuer.name} pass in Apple Wallet or Google Wallet. The pass never contains identity documents, tax IDs, bank data or credentials, and grants no account access.</span>
                  </label>

                  <Actions onBack={back} onNext={submit} nextLabel={pending ? "Submitting…" : method === "ach" ? "Authorise and pay" : method === "wire" ? "I've sent the wire" : "Confirm payment"} disabled={pending} />
                </StepShell>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </section>

        {/* Summary */}
        <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6">
            <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-4">Your order</div>
            <div className="mt-2 text-display-sm tabular">{money(shares * offering.pricePerShare, true)}</div>
            <div className="text-[13px] text-ink-3">{number(shares)} shares · {offering.className}</div>
            <dl className="mt-5 space-y-2 border-t border-line-2 pt-4 text-[13px]">
              <Row k="Issuer" v={issuer.name} />
              <Row k="Offering" v={offering.name} />
              <Row k="Registered owner" v={registeredName || "—"} />
              <Row k="Email" v={email || "—"} />
              <Row k="Payment" v={step >= 5 ? (method === "ach" ? "ACH" : method === "wire" ? "Wire" : "USDC") : "—"} />
            </dl>
            <p className="mt-5 text-[11px] leading-relaxed text-ink-4">Payment is not yet ownership. Shares are issued after funds clear, the subscription is accepted, the offering closes and the transfer agent confirms issuance.</p>
          </div>
        </aside>
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ */

function StepShell({ title, lede, children }: { title: string; lede?: string; children: React.ReactNode }) {
  return (
    <div>
      <h1 className="text-display-sm text-balance">{title}</h1>
      {lede ? <p className="mt-2 text-[15px] leading-relaxed text-ink-3">{lede}</p> : null}
      <div className="mt-7">{children}</div>
    </div>
  );
}

function Actions({ onBack, onNext, nextLabel, disabled }: { onBack?: () => void; onNext: () => void; nextLabel: string; disabled?: boolean }) {
  return (
    <div className="mt-8 flex items-center justify-between gap-3">
      {onBack ? (
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
      ) : (
        <span />
      )}
      <Button variant="brand" size="lg" onClick={onNext} disabled={disabled}>
        {nextLabel} <Icon name="arrow-right" size={16} />
      </Button>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, className = "", readOnly }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; className?: string; readOnly?: boolean }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-[13px] font-medium text-ink-3">{label}</span>
      <input value={value} readOnly={readOnly} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`mt-1.5 h-12 w-full rounded-2xl border border-line-2 px-4 text-[15px] outline-none focus:border-lumen focus:shadow-[0_0_0_4px_rgba(43,92,255,0.15)] ${readOnly ? "bg-canvas text-ink-2" : "bg-paper"}`} />
    </label>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-ink-3">{k}</dt>
      <dd className="truncate text-right font-medium">{v}</dd>
    </div>
  );
}

function DemoNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-start gap-2.5 rounded-2xl border border-gold/40 bg-gold-soft px-4 py-3 text-[13px] text-[#6b5208]">
      <Icon name="sparkle" size={15} className="mt-0.5 shrink-0 text-gold" />
      <span>{children}</span>
    </div>
  );
}

function CodeInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);
  return (
    <div className="relative" onClick={() => ref.current?.focus()}>
      <input ref={ref} value={value} onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" className="absolute inset-0 h-full w-full opacity-0" aria-label="Verification code" />
      <div className="grid grid-cols-6 gap-2 sm:gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={`flex h-16 items-center justify-center rounded-2xl border bg-paper text-[26px] font-semibold tabular ${value.length === i ? "border-lumen shadow-[0_0_0_4px_rgba(43,92,255,0.15)]" : "border-line-2"}`}>
            {value[i] ?? ""}
          </div>
        ))}
      </div>
    </div>
  );
}

function MethodCard({ active, onClick, icon, title, meta }: { active: boolean; onClick: () => void; icon: "bank" | "arrow-up-right" | "coin"; title: string; meta: string }) {
  return (
    <button onClick={onClick} className={`rounded-2xl border p-4 text-left transition-all ${active ? "border-lumen bg-lumen-soft" : "border-line-2 bg-paper hover:border-line"}`}>
      <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${active ? "bg-lumen text-white" : "bg-canvas text-ink-3"}`}>
        <Icon name={icon} size={17} />
      </span>
      <div className="mt-3 text-[14px] font-semibold">{title}</div>
      <div className="text-[12px] text-ink-4">{meta}</div>
    </button>
  );
}

/** Simulated KYC → AML → accreditation sequence with the real provider states. */
function ChecksStep({ onDone, onBack, registeredName, accredMethod }: { onDone: () => void; onBack: () => void; registeredName: string; accredMethod: string }) {
  const checks = useMemo(
    () => [
      { key: "kyc", title: "Identity (KYC)", detail: "Document authenticity, liveness, name and date-of-birth match", ms: 1800 },
      { key: "aml", title: "Sanctions & AML", detail: "OFAC, PEP and adverse-media screening of the legal owner", ms: 1500 },
      { key: "accred", title: "Accreditation", detail: accredMethod, ms: 2100 },
    ],
    [accredMethod],
  );
  const [done, setDone] = useState(0);
  useEffect(() => {
    if (done >= checks.length) return;
    const t = setTimeout(() => setDone((d) => d + 1), checks[done].ms);
    return () => clearTimeout(t);
  }, [done, checks]);
  const complete = done >= checks.length;

  return (
    <StepShell title="Running your checks" lede={`Verifying ${registeredName}. This usually takes under a minute. If a check needs a human review you'll be told exactly what to send.`}>
      <div className="space-y-3">
        {checks.map((c, i) => {
          const state = i < done ? "clear" : i === done ? "running" : "queued";
          return (
            <div key={c.key} className="flex items-center gap-4 rounded-2xl bg-paper p-5">
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${state === "clear" ? "bg-green text-white" : state === "running" ? "bg-lumen-soft text-lumen" : "bg-canvas text-ink-4"}`}>
                {state === "clear" ? <Icon name="check" size={18} /> : state === "running" ? <span className="h-5 w-5 animate-spin-slow rounded-full border-2 border-lumen/30 border-t-lumen" /> : <Icon name="clock" size={16} />}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[15px] font-medium">{c.title}</div>
                <div className="truncate text-[12px] text-ink-4">{c.detail}</div>
              </div>
              <span className={`text-[12px] font-medium ${state === "clear" ? "text-green" : state === "running" ? "text-lumen" : "text-ink-4"}`}>{state === "clear" ? "Clear" : state === "running" ? "Checking…" : "Queued"}</span>
            </div>
          );
        })}
      </div>
      <AnimatePresence>
        {complete ? (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-5 rounded-2xl bg-green-soft p-5 text-[14px] text-[#1f7a3a]">
            <div className="flex items-center gap-2 font-semibold"><Icon name="shield" size={16} /> All checks clear</div>
            <p className="mt-1 text-[13px] opacity-90">Verification reference NC-KYC-SANDBOX. A failed check would stop here and the issuer&rsquo;s action centre would show what is missing.</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <p className="mt-4 text-[12px] text-ink-4">Checks are performed by the rails provider (North Capital in the proposed architecture). The platform stores results and references, never raw identity files, in logs.</p>
      <Actions onBack={onBack} onNext={onDone} nextLabel="Continue to signing" disabled={!complete} />
    </StepShell>
  );
}

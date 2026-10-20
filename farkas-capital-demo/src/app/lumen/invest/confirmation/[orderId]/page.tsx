import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { getOrder } from "@/lib/data/store";
import { passView } from "@/lib/data/derive";
import { passFace } from "@/components/wallet/pass-face";
import { qrSvg } from "@/lib/wallet/qr";
import { LumenNav, LumenFooter } from "@/components/lumen/LumenChrome";
import { money, number, date } from "@/lib/data/format";
import { Icon } from "@/components/ui/Icon";
import { ConfirmActions } from "./ConfirmActions";

export const metadata: Metadata = { title: "You're in" };
export const dynamic = "force-dynamic";

/** Step 5: branded confirmation with "Add to Apple Wallet" / "Add to Google Wallet". */
export default async function ConfirmationPage({ params }: PageProps<"/lumen/invest/confirmation/[orderId]">) {
  const { orderId } = await params;
  const order = getOrder(orderId);
  if (!order?.passId) notFound();
  const view = passView(order.passId)!;
  const h = await headers();
  const origin = `${h.get("x-forwarded-proto") ?? "http"}://${h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000"}`;
  const face = passFace(view, origin);
  const qr = await qrSvg(view.pass.serial);
  const methodLabel = view.payment?.method === "ach" ? "ACH debit" : view.payment?.method === "wire" ? "wire" : "USDC payment";

  return (
    <main className="bg-paper">
      <LumenNav />
      <section className="bg-aurora">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-32 lg:grid-cols-[1fr_1fr] lg:pt-40">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-green-soft px-3 py-1.5 text-[13px] font-medium text-[#1f7a3a]">
              <Icon name="check" size={14} /> Subscription received
            </div>
            <h1 className="text-display-lg mt-5 text-balance">You&rsquo;re in, {view.investor.firstName}.</h1>
            <p className="text-lede mt-4 max-w-xl text-ink-3">
              Your {methodLabel} of {money(order.amount)} for {number(order.shares)} shares of {view.securityClass.shortName} has been submitted. Add your {view.issuer.name} pass to Wallet now; it will update itself as your investment moves to issuance.
            </p>
            <ConfirmActions passId={view.pass.id} issuerName={view.issuer.name} dashboardUrl={view.dashboardUrl} />
            <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4 text-[14px] sm:grid-cols-3">
              <Stat k="Order" v={order.id} />
              <Stat k="Registered owner" v={view.investor.owner.registeredName} />
              <Stat k="Payment reference" v={view.payment?.providerRef ?? "—"} />
              <Stat k="Submitted" v={date(order.createdAt, "long")} />
              <Stat k="Next closing" v={date(view.offering.nextClosingAt, "long")} />
              <Stat k="Status" v="Pending issuance" />
            </dl>
          </div>
          <div className="flex justify-center">
            <ConfirmPass face={face} qr={qr} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="text-display-sm">What happens next</h2>
        <ol className="mt-8 grid gap-4 md:grid-cols-4">
          {[
            ["Funds clear", "ACH takes 3–5 business days; wires and USDC settle faster. Your pass shows the order amount until then."],
            ["Subscription accepted", "After funds clear, the broker-dealer accepts your subscription for the next closing."],
            ["Closing and issuance", "At the closing the transfer agent issues your shares and records the registered owner."],
            ["Pass and dashboard update", "Your pass flips to confirmed shares with an indicative value; your dashboard shows the issuance record."],
          ].map(([t, d], i) => (
            <li key={t} className="card-tint p-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-lumen text-[13px] font-semibold text-white">{i + 1}</div>
              <div className="mt-4 text-[16px] font-semibold">{t}</div>
              <p className="mt-1.5 text-[13px] leading-relaxed text-ink-3">{d}</p>
            </li>
          ))}
        </ol>
        <p className="mt-8 text-[12px] text-ink-4">Payment is not yet ownership. Pending orders never appear as issued shares. A confirmation email with your signed documents and completion certificate has been sent to {view.investor.email}.</p>
      </section>
      <LumenFooter />
    </main>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-[12px] text-ink-4">{k}</dt>
      <dd className="truncate font-medium tabular">{v}</dd>
    </div>
  );
}

import { WalletPass } from "@/components/wallet/WalletPass";
import type { PassFace } from "@/components/wallet/pass-face";
function ConfirmPass({ face, qr }: { face: PassFace; qr: string }) {
  return (
    <div className="relative">
      <div className="absolute -inset-10 rounded-full bg-lumen/20 blur-3xl" aria-hidden />
      <div className="relative animate-float">
        <WalletPass face={face} qrSvg={qr} width={320} flippable />
      </div>
    </div>
  );
}

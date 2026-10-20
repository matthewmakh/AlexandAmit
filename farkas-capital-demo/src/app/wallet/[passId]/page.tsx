import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { passView } from "@/lib/data/derive";
import { ordersForInvestor, getStore } from "@/lib/data/store";
import { qrSvg } from "@/lib/wallet/qr";
import { passFace } from "@/components/wallet/pass-face";
import { WalletScreen } from "./WalletScreen";
import { FloatingNav } from "@/components/marketing/FloatingNav";
import { LumenLogo } from "@/components/brand/LumenMark";
import { Button } from "@/components/ui/Button";
import { money, number, date, dateTime } from "@/lib/data/format";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/wallet/[passId]">): Promise<Metadata> {
  const { passId } = await params;
  const view = passView(passId);
  return { title: view ? `${view.issuer.name} pass · ${view.pass.serial}` : "Pass" };
}

export default async function WalletPassPage({ params }: PageProps<"/wallet/[passId]">) {
  const { passId } = await params;
  const view = passView(passId);
  if (!view) notFound();
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const origin = `${proto}://${host}`;
  const face = passFace(view, origin);
  const qr = await qrSvg(view.pass.serial);

  // Other passes this investor holds, so the "one investment, one pass" rule is visible.
  const siblings = ordersForInvestor(view.investor.id)
    .filter((o) => o.passId && o.passId !== view.pass.id)
    .map((o) => ({ order: o, view: passView(o.passId!)! }));
  const store = getStore();
  const registered = store.passes.filter((p) => p.platform).length;

  return (
    <main className="min-h-screen bg-aurora-dark text-white">
      <FloatingNav
        dark
        brand={<LumenLogo dark size={26} />}
        links={[
          { href: "/lumen/invest", label: "Offering" },
          { href: "/lumen/investors", label: "Investors" },
          { href: "/issuer", label: "Issuer" },
        ]}
        cta={<Button href={view.dashboardUrl} size="sm" variant="white">View investor dashboard</Button>}
      />

      <div className="mx-auto grid max-w-6xl gap-12 px-5 pb-28 pt-32 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:pt-36">
        {/* Left: the pass in an iPhone */}
        <div className="flex flex-col items-center lg:sticky lg:top-28 lg:self-start">
          <WalletScreen view={view} face={face} qrSvg={qr} />
        </div>

        {/* Right: what it is and demo controls */}
        <div>
          <div className="text-eyebrow text-white/50">One investment. One pass.</div>
          <h1 className="text-display-md mt-3 text-balance">
            {view.investor.owner.registeredName}&rsquo;s {view.issuer.name} pass
          </h1>
          <p className="text-lede mt-4 text-white/65">
            Serial {view.pass.serial} belongs to order {view.order.id}. Reinstalling or updating this investment reuses the same pass; a second purchase creates a separate pass. Wallet is a display layer: the investor dashboard holds the authoritative status.
          </p>

          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 text-[14px] sm:grid-cols-3">
            <Stat label="Pass version" value={`v${view.pass.version}`} hint={`updated ${date(view.pass.lastUpdatedAt)}`} />
            <Stat label="Added to" value={view.pass.platform === "apple" ? "Apple Wallet" : view.pass.platform === "google" ? "Google Wallet" : "Not yet added"} hint={view.pass.registeredDevices ? `${view.pass.registeredDevices} device${view.pass.registeredDevices > 1 ? "s" : ""} registered` : "awaiting the add action"} />
            <Stat label="Holding status" value={view.statusLabel} hint={view.holding?.transferAgentRef ? `TA ref ${view.holding.transferAgentRef}` : "no transfer-agent record yet"} />
            <Stat label="Order" value={money(view.order.amount)} hint={`${number(view.order.shares)} shares at ${money(view.offering.pricePerShare, true)}`} />
            <Stat label="Payment" value={view.payment ? view.payment.status[0].toUpperCase() + view.payment.status.slice(1) : "None"} hint={view.payment ? view.payment.providerRef : ""} />
            <Stat label="Indicative value" value={view.indicativeValue !== null ? money(view.indicativeValue) : "Not shown"} hint={view.indicativeValue !== null ? `${number(view.holding!.shares)} × ${money(view.valuation.referencePrice!, true)}` : "appears after issuance"} />
          </dl>

          <div className="mt-10 rounded-[28px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-[15px] font-semibold">What is in the bundle</div>
                <div className="mt-1 text-[13px] text-white/55">The server builds a real .pkpass: pass.json, manifest.json with SHA-1 hashes, icon and logo assets, and a detached PKCS#7 signature once an Apple Pass Type ID certificate is configured.</div>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Button href={`/api/passes/${view.pass.id}`} variant="white" size="sm" external>
                <Icon name="download" size={15} /> Download .pkpass
              </Button>
              <Button href={`/api/passes/${view.pass.id}?format=json`} variant="secondary" size="sm" external className="!bg-white/10 !text-white hover:!bg-white/15">
                <Icon name="doc" size={15} /> View pass.json
              </Button>
              <Badge tone="gold">Unsigned until certificates are added</Badge>
            </div>
            <ul className="mt-5 grid gap-2 text-[13px] text-white/60 sm:grid-cols-2">
              <li className="flex gap-2"><Icon name="check" size={15} className="mt-0.5 shrink-0 text-green" /> Web service: device registration, updated-serials and latest-pass endpoints</li>
              <li className="flex gap-2"><Icon name="check" size={15} className="mt-0.5 shrink-0 text-green" /> If-Modified-Since honoured so devices only fetch real changes</li>
              <li className="flex gap-2"><Icon name="check" size={15} className="mt-0.5 shrink-0 text-green" /> Change messages on status, shares and value fields for lock-screen notices</li>
              <li className="flex gap-2"><Icon name="check" size={15} className="mt-0.5 shrink-0 text-green" /> Sharing prohibited; no identity documents, tax IDs or credentials on the pass</li>
            </ul>
          </div>

          {siblings.length ? (
            <div className="mt-10">
              <div className="text-eyebrow text-white/50">Other passes for this investor</div>
              <ul className="mt-3 divide-y divide-white/10 rounded-[22px] border border-white/10">
                {siblings.map(({ order, view: v }) => (
                  <li key={order.id}>
                    <Link href={`/wallet/${order.passId}`} className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-white/[0.05]">
                      <div>
                        <div className="text-[15px] font-medium">{v.statusLabel === "Issued" ? `${number(v.holding!.shares)} shares` : money(order.amount)} · {v.statusLabel}</div>
                        <div className="text-[12px] text-white/50">{v.pass.serial} · purchased {date(order.createdAt)}</div>
                      </div>
                      <Icon name="chevron-right" size={16} className="text-white/40" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <p className="mt-10 text-[12px] leading-relaxed text-white/40">
            {registered} passes are registered across this issuer&rsquo;s investors. Clock for this demo: {dateTime(store.now)}.
          </p>
        </div>
      </div>
    </main>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div>
      <dt className="text-[12px] text-white/50">{label}</dt>
      <dd className="mt-0.5 text-[16px] font-semibold tabular">{value}</dd>
      {hint ? <dd className="text-[12px] text-white/40">{hint}</dd> : null}
    </div>
  );
}

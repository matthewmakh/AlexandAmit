import { getStore } from "@/lib/data/store";
import { passView } from "@/lib/data/derive";
import { passFace } from "@/components/wallet/pass-face";
import { qrSvg } from "@/lib/wallet/qr";
import { WalletPass } from "@/components/wallet/WalletPass";
import { money, number, date } from "@/lib/data/format";
import { PageHeader } from "@/components/dashboard/Shell";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Photo } from "@/components/ui/Photo";
import { Table, Th, Td } from "@/components/dashboard/Table";

export const dynamic = "force-dynamic";

export default async function OfferingControlsPage() {
  const s = getStore();
  const o = s.offerings[0];
  const cls = s.securityClasses[0];
  const view = passView("pass_jordan_1")!;
  const face = passFace(view);
  const qr = await qrSvg(view.pass.serial);

  return (
    <>
      <PageHeader
        title="Offering controls"
        subtitle="Price, class, limits, dates, documents and eligibility. Terms are versioned; material changes need Farkas Capital approval before they publish."
        actions={
          <>
            <Button size="sm" variant="secondary" href="/lumen/invest" external><Icon name="eye" size={14} /> View live page</Button>
            <Button size="sm"><Icon name="pen" size={14} /> Propose change</Button>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader title="Terms" subtitle={`Published version v${o.termsVersions.find((t) => t.status === "published")?.version}`} action={<Badge tone="green" dot>Live</Badge>} />
            <dl className="grid gap-x-8 gap-y-4 text-[14px] sm:grid-cols-2 lg:grid-cols-3">
              <T k="Offering" v={o.name} />
              <T k="Exemption" v={o.exemption} />
              <T k="Security" v={cls.name} />
              <T k="Price per share" v={money(o.pricePerShare, true)} />
              <T k="Minimum" v={money(o.minInvestment)} />
              <T k="Maximum" v={money(o.maxInvestment)} />
              <T k="Target" v={money(o.targetAmount)} />
              <T k="Opens" v={date(o.opensAt)} />
              <T k="Closes" v={date(o.closesAt)} />
              <T k="First closing" v={date(o.firstClosingAt)} />
              <T k="Next closing" v={date(o.nextClosingAt)} />
              <T k="Fully diluted shares" v={number(cls.fullyDilutedShares)} />
            </dl>
          </Card>

          <Card>
            <CardHeader title="Terms versions" subtitle="Every change is recorded and approved before it reaches investors" />
            <ul className="divide-y divide-line-2">
              {[...o.termsVersions].reverse().map((t) => (
                <li key={t.version} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div>
                    <div className="text-[14px] font-medium">v{t.version} · {t.summary}</div>
                    <div className="text-[12px] text-ink-4">{date(t.createdAt)}{t.approvedBy ? ` · approved by ${t.approvedBy}` : ""}</div>
                  </div>
                  <Badge tone={t.status === "published" ? "green" : t.status === "pending_approval" ? "orange" : "neutral"} dot>
                    {t.status === "pending_approval" ? "Pending approval" : t.status[0].toUpperCase() + t.status.slice(1)}
                  </Badge>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHeader title="Documents" subtitle="Shown on the offering page; signed documents go to Docusign at checkout" action={<Button size="sm" variant="secondary"><Icon name="plus" size={14} /> Upload</Button>} />
            <Table>
              <thead><tr><Th>Document</Th><Th>Kind</Th><Th align="right">Pages</Th><Th>Version</Th><Th>Signature</Th></tr></thead>
              <tbody>
                {o.documents.map((d) => (
                  <tr key={d.id}>
                    <Td className="font-medium">{d.name}</Td>
                    <Td className="text-ink-3">{d.kind.replace("_", " ")}</Td>
                    <Td align="right" mono>{d.pages}</Td>
                    <Td mono>{d.version}</Td>
                    <Td>{d.requiresSignature ? <Badge tone="blue">Required</Badge> : <span className="text-ink-4">Read only</span>}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>

          <Card>
            <CardHeader title="Eligible investors" subtitle="Configurable rules; Reg A and Reg CF arrive as separate approved workflows" />
            <ul className="space-y-2 text-[14px]">
              {o.eligibility.map((e) => (
                <li key={e} className="flex items-start gap-2"><Icon name="check" size={15} className="mt-0.5 text-green" /> {e}</li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Wallet branding preview" subtitle="Approved pass template" action={<Badge tone="green">Approved</Badge>} />
            <div className="flex justify-center rounded-[20px] bg-night p-6">
              <WalletPass face={face} qrSvg={qr} width={260} flippable={false} shadow={false} />
            </div>
            <p className="mt-3 text-[12px] text-ink-4">Apple controls fields and layout. Essential holdings on the front; everything else in pass details.</p>
          </Card>
          <Card>
            <CardHeader title="Website branding preview" subtitle="invest.lumenrobotics.com" />
            <Photo src="/images/screens/offering-desktop.png" alt="The offering page as investors see it" aspect="4/3" objectPosition="top" className="ring-hair" rounded="rounded-2xl" />
            <div className="mt-4 grid grid-cols-3 gap-2 text-[12px]">
              <div className="rounded-xl bg-canvas p-3"><div className="mb-1.5 h-6 rounded-md" style={{ background: "#2B5CFF" }} />Primary #2B5CFF</div>
              <div className="rounded-xl bg-canvas p-3"><div className="mb-1.5 h-6 rounded-md" style={{ background: "#0B2A8A" }} />Deep #0B2A8A</div>
              <div className="rounded-xl bg-canvas p-3"><div className="mb-1.5 h-6 rounded-md bg-white ring-hair" />On primary #FFFFFF</div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

function T({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-[12px] text-ink-4">{k}</dt>
      <dd className="font-medium tabular">{v}</dd>
    </div>
  );
}

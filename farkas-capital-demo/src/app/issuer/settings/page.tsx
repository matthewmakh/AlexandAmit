import { getStore } from "@/lib/data/store";
import { ago, dateTime } from "@/lib/data/format";
import { PageHeader } from "@/components/dashboard/Shell";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge, type Tone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Avatar } from "@/components/ui/Avatar";
import { LumenTile } from "@/components/brand/LumenMark";
import { Table, Th, Td } from "@/components/dashboard/Table";

export const dynamic = "force-dynamic";

const INT_TONE: Record<string, Tone> = { ok: "green", degraded: "orange", pending_approval: "orange", error: "red" };
const INT_LABEL: Record<string, string> = { ok: "Healthy", degraded: "Degraded", pending_approval: "Pending approval", error: "Error" };

export default function SettingsPage() {
  const s = getStore();
  const issuer = s.issuers[0];
  const apple = s.passes.filter((p) => p.platform === "apple");
  const google = s.passes.filter((p) => p.platform === "google");

  return (
    <>
      <PageHeader title="Team and settings" subtitle="Roles, branding, domain, email, integration health, wallet status and the audit history." />

      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader title="Team" subtitle="Company admin, finance, marketing and read-only roles" action={<Button size="sm"><Icon name="plus" size={14} /> Invite</Button>} />
            <Table>
              <thead><tr><Th>Member</Th><Th>Role</Th><Th>MFA</Th><Th align="right">Last active</Th></tr></thead>
              <tbody>
                {s.team.map((m) => {
                  const [f, l] = m.name.split(" ");
                  return (
                    <tr key={m.id}>
                      <Td><span className="flex items-center gap-3"><Avatar first={f} last={l ?? ""} size={30} /><span><span className="block font-medium">{m.name}</span><span className="block text-[12px] text-ink-4">{m.email}</span></span></span></Td>
                      <Td><Badge tone={m.role === "Company admin" ? "purple" : m.role === "Finance" ? "blue" : m.role === "Marketing" ? "teal" : "neutral"}>{m.role}</Badge></Td>
                      <Td>{m.mfa ? <Badge tone="green" dot>On</Badge> : <Badge tone="red" dot>Off · required</Badge>}</Td>
                      <Td align="right" className="text-ink-3">{ago(m.lastActiveAt)}</Td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            <p className="mt-3 text-[12px] text-ink-4">Finance can request refunds and releases; approval is a separate permission held by Farkas Capital operations. Company users cannot edit confirmed ownership.</p>
          </Card>

          <Card>
            <CardHeader title="Integrations" subtitle="Provider health as seen by the platform" />
            <ul className="divide-y divide-line-2">
              {s.integrations.map((i) => (
                <li key={i.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-[14px] font-medium">{i.name} <span className="text-[11px] font-normal uppercase tracking-wider text-ink-4">{i.environment}</span></div>
                    <div className="text-[12px] text-ink-3">{i.purpose} · {i.detail}</div>
                  </div>
                  <div className="flex items-center gap-3 text-[12px] text-ink-4">
                    {i.lastEventAt ? <span>last event {ago(i.lastEventAt)}</span> : null}
                    <Badge tone={INT_TONE[i.status]} dot>{INT_LABEL[i.status]}</Badge>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHeader title="Audit history" subtitle="Sensitive changes and approvals" action={<Button size="sm" variant="secondary"><Icon name="download" size={14} /> Export</Button>} />
            <ul className="divide-y divide-line-2">
              {s.audit.map((a) => (
                <li key={a.id} className="flex flex-wrap items-start justify-between gap-2 py-3 text-[13px]">
                  <div><span className="font-medium">{a.actor}</span> <span className="text-ink-4">({a.role})</span> {a.action.toLowerCase()} <span className="font-medium">{a.subject}</span><div className="text-ink-3">{a.detail}</div></div>
                  <span className="shrink-0 text-ink-4">{dateTime(a.at)}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Branding" subtitle="Used on the website, emails and passes" />
            <div className="flex items-center gap-4"><LumenTile size={56} /><div><div className="text-[15px] font-semibold">{issuer.name}</div><div className="text-[12px] text-ink-4">{issuer.legalName}</div></div></div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-[12px]">
              {[["Primary", issuer.brand.primary], ["Deep", issuer.brand.deep], ["On primary", issuer.brand.onPrimary]].map(([k, c]) => (
                <div key={k} className="rounded-xl bg-canvas p-2.5"><div className="mb-1.5 h-7 rounded-md ring-hair" style={{ background: c }} />{k}<div className="tabular text-ink-4">{c}</div></div>
              ))}
            </div>
            <div className="mt-4 rounded-2xl border border-dashed border-line bg-canvas p-5 text-center text-[13px] text-ink-3"><div className="font-medium text-ink-2">Drop logo files here</div>SVG and PNG, light and dark variants. The pass template needs icon.png at 29/58/87px and logo.png at 160×50pt.</div>
          </Card>
          <Card>
            <CardHeader title="Domain and email" />
            <ul className="space-y-2.5 text-[13px]">
              <li className="flex items-center justify-between"><span>invest.{issuer.domain}</span><Badge tone="green" dot>DNS verified · TLS</Badge></li>
              <li className="flex items-center justify-between"><span>{issuer.domain}/investors</span><Badge tone="green" dot>Hosted route</Badge></li>
              <li className="flex items-center justify-between"><span>JavaScript embed on {issuer.domain}</span><Badge tone="green" dot>Installed</Badge></li>
              <li className="flex items-center justify-between"><span>{issuer.supportEmail}</span><Badge tone="green" dot>DKIM · SPF · DMARC</Badge></li>
            </ul>
          </Card>
          <Card>
            <CardHeader title="Wallet status" />
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-2xl bg-canvas p-4"><div className="text-[24px] font-semibold tabular">{apple.length}</div><div className="text-[12px] text-ink-4">Apple passes</div><Badge tone="green" className="mt-2">Certificate valid</Badge></div>
              <div className="rounded-2xl bg-canvas p-4"><div className="text-[24px] font-semibold tabular">{google.length}</div><div className="text-[12px] text-ink-4">Google passes</div><Badge tone="orange" className="mt-2">Use case pending</Badge></div>
            </div>
            <p className="mt-3 text-[12px] text-ink-4">Pass Type ID pass.com.farkascapital.investment · certificate renews 2027-08-14 · owner: Farkas Capital operations.</p>
          </Card>
        </div>
      </div>
    </>
  );
}

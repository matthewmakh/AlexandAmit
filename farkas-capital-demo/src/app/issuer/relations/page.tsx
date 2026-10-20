import { getStore } from "@/lib/data/store";
import { date, number, pct } from "@/lib/data/format";
import { PageHeader } from "@/components/dashboard/Shell";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export default function RelationsPage() {
  const s = getStore();
  const passesToUpdate = s.passes.filter((p) => p.platform);
  const sel = "h-10 w-full rounded-xl bg-canvas px-3 text-[14px] ring-hair appearance-none";

  return (
    <>
      <PageHeader title="Investor relations" subtitle="Publish company updates and documents, send approved branded email to investor groups, and push approved holding or value updates to passes." />

      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader title="New update" subtitle="Submitted to Farkas Capital communications review before it sends" />
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-[13px] text-ink-3">Audience
                  <div className="relative mt-1"><select className={sel} defaultValue="all"><option value="all">All investors (66)</option><option>Issued holders, first closing (41)</option><option>In-progress applicants (22)</option><option>Large tickets (12)</option></select><Icon name="chevron-down" size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-4" /></div>
                </label>
                <label className="block text-[13px] text-ink-3">From
                  <input className="mt-1 h-10 w-full rounded-xl bg-canvas px-3 text-[14px] ring-hair" defaultValue="Lumen Robotics Investor Relations <investors@lumenrobotics.com>" readOnly />
                </label>
              </div>
              <label className="block text-[13px] text-ink-3">Subject
                <input className="mt-1 h-10 w-full rounded-xl bg-canvas px-3 text-[14px] ring-hair focus-ring" placeholder="Second closing scheduled for 31 October" />
              </label>
              <label className="block text-[13px] text-ink-3">Message
                <textarea rows={5} className="mt-1 w-full rounded-xl bg-canvas px-3 py-2.5 text-[14px] ring-hair focus-ring" placeholder="Write in Lumen's voice. The branded template adds the logo, footer and required disclosures." />
              </label>
              <div className="flex items-center justify-center rounded-xl border border-dashed border-line p-5 text-[13px] text-ink-4"><Icon name="doc" size={15} className="mr-2" /> Drop PDFs here, or choose files. Documents are restricted to entitled investors.</div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-[12px] text-ink-4">Sends only after approval. Delivery results appear below.</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary"><Icon name="eye" size={14} /> Preview</Button>
                  <Button size="sm"><Icon name="arrow-right" size={14} /> Submit for approval</Button>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Published updates" subtitle={`${s.updates.length} updates`} />
            <ul className="divide-y divide-line-2">
              {s.updates.map((u) => (
                <li key={u.id} className="py-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-[15px] font-semibold">{u.title}</div>
                      <div className="mt-0.5 text-[13px] text-ink-3">{u.summary}</div>
                      <div className="mt-1.5 text-[12px] text-ink-4">{date(u.publishedAt)} · {u.audience}{u.attachments.length ? ` · ${u.attachments.join(", ")}` : ""}</div>
                    </div>
                    <Badge tone="green" dot>Delivered</Badge>
                  </div>
                  <div className="mt-3 grid grid-cols-4 gap-2 text-center text-[12px]">
                    {[["Sent", u.delivery.sent], ["Delivered", u.delivery.delivered], ["Opened", u.delivery.opened], ["Bounced", u.delivery.bounced]].map(([k, v]) => (
                      <div key={String(k)} className="rounded-xl bg-canvas py-2"><div className="text-[16px] font-semibold tabular">{v}</div><div className="text-ink-4">{k}{k === "Opened" ? ` · ${pct(u.delivery.opened / u.delivery.sent)}` : ""}</div></div>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Pass updates" subtitle="Publish approved holding and value changes" action={<Badge tone="blue">{number(passesToUpdate.length)} passes</Badge>} />
            <ul className="space-y-2 text-[13px]">
              <li className="flex items-center justify-between rounded-xl bg-canvas px-3 py-2.5"><span><span className="font-medium">Valuation</span> · Series A $62.5M · ref price $12.50</span><Badge tone="green">Live on passes</Badge></li>
              <li className="flex items-center justify-between rounded-xl bg-canvas px-3 py-2.5"><span><span className="font-medium">Second closing</span> · issuance for {s.holdings.filter((h) => h.status === "pending_issuance").length} holdings</span><Badge tone="orange">Awaiting transfer agent</Badge></li>
              <li className="flex items-center justify-between rounded-xl bg-canvas px-3 py-2.5"><span><span className="font-medium">Apple</span> · {s.passes.filter((p) => p.platform === "apple").length} registered · APNs healthy</span><Badge tone="green">OK</Badge></li>
              <li className="flex items-center justify-between rounded-xl bg-canvas px-3 py-2.5"><span><span className="font-medium">Google</span> · {s.passes.filter((p) => p.platform === "google").length} registered</span><Badge tone="orange">Pending approval</Badge></li>
            </ul>
            <p className="mt-4 text-[12px] text-ink-4">Updates reach passes only after Farkas Capital approves the underlying record. Devices receive a push and fetch the new pass version.</p>
          </Card>
          <Card>
            <CardHeader title="Documents on the investor dashboard" subtitle="Restricted to entitled investors" action={<Button size="sm" variant="secondary"><Icon name="plus" size={14} /> Add</Button>} />
            <ul className="space-y-2 text-[13px]">
              {["Reviewed Financial Statements FY2025", "Q3 2026 Shareholder Letter", "First Closing Summary", "Series A Board Resolution (valuation basis)"].map((d) => (
                <li key={d} className="flex items-center gap-2"><Icon name="doc" size={15} className="text-ink-4" /> {d}</li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}

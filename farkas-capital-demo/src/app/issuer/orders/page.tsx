import Link from "next/link";
import { getStore } from "@/lib/data/store";
import { ordersBehind } from "@/lib/data/derive";
import { money, number, date } from "@/lib/data/format";
import { PageHeader } from "@/components/dashboard/Shell";
import { Segmented } from "@/components/dashboard/Tile";
import { Card } from "@/components/ui/Card";
import { Table, Th, Td, Empty } from "@/components/dashboard/Table";
import { OrderBadge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";

export const dynamic = "force-dynamic";

const METRICS = ["committed", "received", "cleared", "refunded", "released", "issued", "pending"] as const;
type Metric = (typeof METRICS)[number];
const TITLES: Record<Metric, string> = {
  committed: "Committed orders",
  received: "Payments received",
  cleared: "Cleared funds",
  refunded: "Refunded orders",
  released: "Released at closing",
  issued: "Issued holdings",
  pending: "Pending issuance",
};

export default async function OrdersPage({ searchParams }: PageProps<"/issuer/orders">) {
  const sp = await searchParams;
  const metric = (METRICS as readonly string[]).includes(String(sp.metric)) ? (sp.metric as Metric) : "committed";
  const s = getStore();
  const orders = ordersBehind(metric).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const total = orders.reduce((a, o) => a + o.amount, 0);

  return (
    <>
      <PageHeader
        eyebrow={<Link href="/issuer" className="hover:text-ink">← Overview</Link>}
        title={TITLES[metric]}
        subtitle={`${orders.length} orders · ${money(total)} · ${number(orders.reduce((a, o) => a + o.shares, 0))} shares`}
        actions={
          <Segmented
            value={metric}
            options={METRICS.slice(0, 5).map((m) => ({ key: m, label: m[0].toUpperCase() + m.slice(1), href: `/issuer/orders?metric=${m}` }))}
          />
        }
      />
      <Card>
        {orders.length ? (
          <Table>
            <thead>
              <tr>
                <Th>Investor</Th>
                <Th>Order</Th>
                <Th align="right">Amount</Th>
                <Th align="right">Shares</Th>
                <Th>Status</Th>
                <Th>Payment</Th>
                <Th align="right">Updated</Th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => {
                const inv = s.investors.find((i) => i.id === o.investorId)!;
                const pay = s.payments.find((p) => p.id === o.paymentId);
                return (
                  <tr key={o.id} className="group">
                    <Td>
                      <Link href={`/issuer/investors/${inv.id}`} className="flex items-center gap-3">
                        <Avatar first={inv.firstName} last={inv.lastName} size={30} />
                        <span>
                          <span className="block font-medium group-hover:text-blue">{inv.owner.registeredName}</span>
                          <span className="block text-[12px] text-ink-4">{inv.email}</span>
                        </span>
                      </Link>
                    </Td>
                    <Td mono className="text-ink-3">{o.id}</Td>
                    <Td align="right" mono className="font-medium">{money(o.amount)}</Td>
                    <Td align="right" mono>{number(o.shares)}</Td>
                    <Td><OrderBadge status={o.status} /></Td>
                    <Td className="text-ink-3">{pay ? `${pay.method.toUpperCase()} · ${pay.status}` : "—"}</Td>
                    <Td align="right" className="text-ink-3">{date(o.updatedAt)}</Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        ) : (
          <Empty title="No orders behind this number yet" hint="Records appear here as investors move through the flow." />
        )}
      </Card>
    </>
  );
}

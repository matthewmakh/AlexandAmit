import type { TimelineEvent } from "@/lib/data/types";
import { Icon } from "@/components/ui/Icon";
import { dateTime } from "@/lib/data/format";

const kindIcon: Record<TimelineEvent["kind"], Parameters<typeof Icon>[0]["name"]> = {
  application: "doc",
  check: "shield",
  signature: "pen",
  payment: "bank",
  issuance: "building",
  wallet: "wallet",
  support: "phone",
  note: "note",
  email: "mail",
};

const toneCls: Record<TimelineEvent["tone"], string> = {
  neutral: "bg-ink/[0.06] text-ink-2",
  good: "bg-green-soft text-[#1f7a3a]",
  warn: "bg-orange-soft text-[#b35f00]",
  bad: "bg-red-soft text-[#c4231a]",
};

export function Timeline({ events }: { events: TimelineEvent[] }) {
  if (!events.length) return <div className="text-[13px] text-ink-4">No activity yet.</div>;
  return (
    <ol className="relative space-y-0">
      {events.map((e, i) => (
        <li key={e.id} className="relative flex gap-4 pb-6 last:pb-0">
          {i < events.length - 1 ? <span className="absolute left-[17px] top-9 h-[calc(100%-20px)] w-px bg-line-2" aria-hidden /> : null}
          <span className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${toneCls[e.tone]}`}>
            <Icon name={kindIcon[e.kind]} size={16} />
          </span>
          <div className="min-w-0 pt-1.5">
            <div className="text-[14px] font-medium leading-snug">{e.title}</div>
            {e.detail ? <div className="mt-0.5 text-[13px] text-ink-3">{e.detail}</div> : null}
            <div className="mt-1 text-[12px] text-ink-4">{dateTime(e.at)}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}

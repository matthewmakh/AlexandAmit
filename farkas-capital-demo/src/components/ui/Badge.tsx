import type { ReactNode } from "react";
import type { OrderStatus, CheckStatus, PaymentStatus } from "@/lib/data/types";
import { STATUS_LABEL } from "@/lib/data/seed";

export type Tone = "neutral" | "blue" | "green" | "orange" | "red" | "purple" | "teal" | "gold" | "dark";

const tones: Record<Tone, string> = {
  neutral: "bg-ink/[0.06] text-ink-2",
  blue: "bg-blue-soft text-blue-deep",
  green: "bg-green-soft text-[#1f7a3a]",
  orange: "bg-orange-soft text-[#b35f00]",
  red: "bg-red-soft text-[#c4231a]",
  purple: "bg-purple-soft text-[#7a2fa0]",
  teal: "bg-teal-soft text-[#1a7f91]",
  gold: "bg-gold-soft text-[#8a6a0f]",
  dark: "bg-ink text-white",
};

export function Badge({ tone = "neutral", children, className = "", dot = false }: { tone?: Tone; children: ReactNode; className?: string; dot?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium leading-none ${tones[tone]} ${className}`}>
      {dot ? <span className="h-1.5 w-1.5 rounded-full bg-current" /> : null}
      {children}
    </span>
  );
}

export const ORDER_TONE: Record<OrderStatus, Tone> = {
  started: "neutral",
  verifying: "blue",
  check_failed: "red",
  awaiting_signature: "orange",
  awaiting_payment: "orange",
  payment_pending: "blue",
  payment_cleared: "teal",
  accepted: "purple",
  issued: "green",
  refunded: "neutral",
  cancelled: "neutral",
};

export function OrderBadge({ status, className = "" }: { status: OrderStatus; className?: string }) {
  return (
    <Badge tone={ORDER_TONE[status]} className={className} dot>
      {STATUS_LABEL[status]}
    </Badge>
  );
}

export function CheckBadge({ status, label }: { status: CheckStatus; label: string }) {
  const tone: Tone = status === "clear" ? "green" : status === "failed" ? "red" : status === "review" ? "orange" : status === "pending" ? "blue" : "neutral";
  const text = status === "clear" ? "Clear" : status === "failed" ? "Failed" : status === "review" ? "Review" : status === "pending" ? "Pending" : "Not required";
  return (
    <Badge tone={tone}>
      {label}: {text}
    </Badge>
  );
}

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  const tone: Tone = status === "cleared" ? "green" : status === "pending" ? "blue" : status === "returned" || status === "failed" ? "red" : "neutral";
  return <Badge tone={tone} dot>{status[0].toUpperCase() + status.slice(1)}</Badge>;
}

import { getStore } from "./store";
import { ORDER_RANK, STATUS_LABEL } from "./seed";
import { dayKey, daysAgo } from "./clock";
import { ageDays } from "./format";
import type {
  ActionItem,
  DailyPoint,
  Device,
  Holding,
  Investor,
  Order,
  OrderStatus,
  Payment,
  Signature,
  TimelineEvent,
  WalletPass,
  Valuation,
  Offering,
  Issuer,
  SecurityClass,
} from "./types";

export { STATUS_LABEL, ORDER_RANK };

/* ------------------------------------------------------------------ */
/*  Raise overview                                                      */
/* ------------------------------------------------------------------ */

export interface RaiseSummary {
  target: number;
  committed: number;
  received: number;
  cleared: number;
  refunded: number;
  released: number;
  pendingIssuance: number;
  issued: number;
  placementFees: number;
  platformFees: number;
  railFees: number;
  netProceeds: number;
  investorsFunded: number;
  investorsCommitted: number;
  sharesIssued: number;
  sharesPending: number;
  progress: number;
  counts: Record<OrderStatus, number>;
}

const COMMITTED: OrderStatus[] = ["awaiting_payment", "payment_pending", "payment_cleared", "accepted", "issued"];
const RECEIVED: OrderStatus[] = ["payment_pending", "payment_cleared", "accepted", "issued"];
const CLEARED: OrderStatus[] = ["payment_cleared", "accepted", "issued"];

export function raiseSummary(): RaiseSummary {
  const s = getStore();
  const offering = s.offerings[0];
  const sum = (statuses: OrderStatus[]) =>
    s.orders.filter((o) => statuses.includes(o.status)).reduce((a, o) => a + o.amount, 0);
  const counts = Object.fromEntries(Object.keys(STATUS_LABEL).map((k) => [k, 0])) as Record<OrderStatus, number>;
  for (const o of s.orders) counts[o.status]++;

  const committed = sum(COMMITTED);
  const received = sum(RECEIVED);
  const cleared = sum(CLEARED);
  const refunded = sum(["refunded"]);
  const releasedHoldings = s.holdings.filter((h) => h.releasedAt);
  const released = releasedHoldings.reduce((a, h) => a + h.shares * offering.pricePerShare, 0);
  const issuedOrders = s.orders.filter((o) => o.status === "issued");
  const issued = issuedOrders.reduce((a, o) => a + o.amount, 0);
  const pendingIssuance = sum(["accepted"]);
  const placementFees = Math.round((cleared * offering.placementFeeBps) / 10_000);
  const platformFees = Math.round((cleared * offering.platformFeeBps) / 10_000);
  const railFees = s.payments.filter((p) => p.status === "cleared").reduce((a, p) => a + p.railFee, 0);
  return {
    target: offering.targetAmount,
    committed,
    received,
    cleared,
    refunded,
    released,
    pendingIssuance,
    issued,
    placementFees,
    platformFees,
    railFees: Math.round(railFees),
    netProceeds: cleared - placementFees - platformFees - Math.round(railFees),
    investorsFunded: new Set(issuedOrders.map((o) => o.investorId)).size,
    investorsCommitted: new Set(s.orders.filter((o) => COMMITTED.includes(o.status)).map((o) => o.investorId)).size,
    sharesIssued: s.holdings.filter((h) => h.status === "issued").reduce((a, h) => a + h.shares, 0),
    sharesPending: s.holdings.filter((h) => h.status === "pending_issuance").reduce((a, h) => a + h.shares, 0),
    progress: committed / offering.targetAmount,
    counts,
  };
}

/** Orders behind a headline number, so every tile can open its records. */
export function ordersBehind(metric: "committed" | "received" | "cleared" | "refunded" | "released" | "issued" | "pending"): Order[] {
  const s = getStore();
  const by = (statuses: OrderStatus[]) => s.orders.filter((o) => statuses.includes(o.status));
  switch (metric) {
    case "committed": return by(COMMITTED);
    case "received": return by(RECEIVED);
    case "cleared": return by(CLEARED);
    case "refunded": return by(["refunded"]);
    case "issued": return by(["issued"]);
    case "pending": return by(["accepted"]);
    case "released": {
      const ids = new Set(s.holdings.filter((h) => h.releasedAt).map((h) => h.orderId));
      return s.orders.filter((o) => ids.has(o.id));
    }
  }
}

/* ------------------------------------------------------------------ */
/*  Daily trend                                                         */
/* ------------------------------------------------------------------ */

function seeded(n: number) {
  // small hash for deterministic per-day traffic
  let x = (n * 9301 + 49297) % 233280;
  return () => {
    x = (x * 9301 + 49297) % 233280;
    return x / 233280;
  };
}

export function dailySeries(days = 60): DailyPoint[] {
  const s = getStore();
  const out: DailyPoint[] = [];
  const spikes = new Set([daysAgo(44), daysAgo(19), daysAgo(6)].map(dayKey));
  for (let d = days - 1; d >= 0; d--) {
    const key = dayKey(daysAgo(d));
    const r = seeded(d + 7);
    const base = 60 + Math.round(r() * 70) + (spikes.has(key) ? 180 : 0) + (d < 20 ? 25 : 0);
    const started = Math.round(base * (0.05 + r() * 0.03));
    const committed = s.orders
      .filter((o) => o.signedAt && dayKey(o.signedAt) === key && ["awaiting_payment", "payment_pending", "payment_cleared", "accepted", "issued"].includes(o.status))
      .reduce((a, o) => a + o.amount, 0);
    const received = s.payments
      .filter((p) => dayKey(p.initiatedAt) === key && p.status !== "returned" && p.status !== "failed")
      .reduce((a, p) => a + p.amount, 0);
    const cleared = s.payments
      .filter((p) => p.clearedAt && dayKey(p.clearedAt) === key && (p.status === "cleared"))
      .reduce((a, p) => a + p.amount, 0);
    out.push({ date: key, visits: base, started, committed, received, cleared });
  }
  return out;
}

export function cumulative(series: DailyPoint[], key: "committed" | "received" | "cleared"): { date: string; value: number }[] {
  let acc = 0;
  return series.map((p) => {
    acc += p[key];
    return { date: p.date, value: acc };
  });
}

/* ------------------------------------------------------------------ */
/*  Funnel                                                              */
/* ------------------------------------------------------------------ */

export interface FunnelStep {
  key: string;
  label: string;
  count: number;
}

export function funnel(): FunnelStep[] {
  const s = getStore();
  const orders = s.orders;
  const reached = (st: OrderStatus) => orders.filter((o) => ORDER_RANK[o.status] >= ORDER_RANK[st] || (o.status === "refunded" && ORDER_RANK[st] <= 4)).length;
  return [
    { key: "visit", label: "Visited offering", count: s.traffic.visits },
    { key: "started", label: "Started application", count: s.traffic.anonymousStarts + orders.length },
    { key: "verified", label: "Passed verification", count: reached("awaiting_signature") },
    { key: "signed", label: "Signed documents", count: reached("awaiting_payment") },
    { key: "paid", label: "Submitted payment", count: reached("payment_pending") },
    { key: "issued", label: "Shares issued", count: reached("issued") },
  ];
}

export function funnelBySource(): { source: string; visits: number; started: number; funded: number; committed: number }[] {
  const s = getStore();
  const rows: Record<string, { source: string; visits: number; started: number; funded: number; committed: number }> = {};
  for (const [src, t] of Object.entries(s.traffic.bySource)) rows[src] = { source: src, visits: t.visits, started: t.started, funded: 0, committed: 0 };
  for (const o of s.orders) {
    const inv = s.investors.find((i) => i.id === o.investorId)!;
    const row = rows[inv.source.utmSource] ?? (rows[inv.source.utmSource] = { source: inv.source.utmSource, visits: 0, started: 0, funded: 0, committed: 0 });
    row.started += 1;
    if (o.status === "issued") row.funded += 1;
    if (COMMITTED.includes(o.status)) row.committed += o.amount;
  }
  return Object.values(rows).sort((a, b) => b.committed - a.committed);
}

export function funnelByDevice(): { device: Device; visits: number; started: number; funded: number }[] {
  const s = getStore();
  const rows = {} as Record<Device, { device: Device; visits: number; started: number; funded: number }>;
  for (const [dev, t] of Object.entries(s.traffic.byDevice) as [Device, { visits: number; started: number }][]) {
    rows[dev] = { device: dev, visits: t.visits, started: t.started, funded: 0 };
  }
  for (const o of s.orders) {
    const inv = s.investors.find((i) => i.id === o.investorId)!;
    rows[inv.source.device].started += 1;
    if (o.status === "issued") rows[inv.source.device].funded += 1;
  }
  return Object.values(rows).sort((a, b) => b.visits - a.visits);
}

/* ------------------------------------------------------------------ */
/*  Action center                                                       */
/* ------------------------------------------------------------------ */

export function actionItems(): ActionItem[] {
  const s = getStore();
  const items: ActionItem[] = [];
  const inv = (id: string) => s.investors.find((i) => i.id === id)!;

  for (const o of s.orders) {
    const i = inv(o.investorId);
    if (o.status === "check_failed") {
      items.push({
        id: `act_fc_${o.id}`,
        type: "failed_check",
        title: `${i.owner.registeredName} · ${STATUS_LABEL.check_failed}`,
        detail: o.failureReason ?? "Verification failed",
        investorId: i.id,
        orderId: o.id,
        owner: i.accountManager,
        openedAt: o.updatedAt,
        nextAction: o.failureReason?.startsWith("Sanctions") ? "Compliance review of the screening match" : "Ask the investor to resubmit documents",
        severity: o.failureReason?.startsWith("Sanctions") ? "high" : "medium",
      });
    }
    if (o.status === "awaiting_payment" && ageDays(o.signedAt ?? o.createdAt) >= 3) {
      items.push({
        id: `act_up_${o.id}`,
        type: "unpaid_order",
        title: `${i.owner.registeredName} · signed, unpaid`,
        detail: `Subscription signed ${ageDays(o.signedAt ?? o.createdAt)} days ago; no payment initiated`,
        investorId: i.id,
        orderId: o.id,
        owner: i.accountManager,
        openedAt: o.signedAt ?? o.createdAt,
        nextAction: "Send branded payment reminder with wire and ACH instructions",
        severity: ageDays(o.signedAt ?? o.createdAt) >= 7 ? "high" : "medium",
      });
    }
  }
  for (const p of s.payments.filter((p) => p.status === "returned")) {
    const o = s.orders.find((x) => x.id === p.orderId)!;
    const i = inv(o.investorId);
    items.push({
      id: `act_rt_${p.id}`,
      type: "return",
      title: `${i.owner.registeredName} · ACH return`,
      detail: `${p.returnCode ?? "Returned"} on ${p.providerRef}`,
      investorId: i.id,
      orderId: o.id,
      owner: i.accountManager,
      openedAt: p.returnedAt ?? p.initiatedAt,
      nextAction: "Contact investor; offer wire or retry ACH with a different account",
      severity: "high",
    });
  }
  for (const i of s.investors) {
    if (i.missingDocuments.length) {
      const o = s.orders.find((x) => x.investorId === i.id);
      items.push({
        id: `act_md_${i.id}`,
        type: "missing_document",
        title: `${i.owner.registeredName} · missing ${i.missingDocuments[0].toLowerCase()}`,
        detail: `Cannot sign until ${i.missingDocuments.join(", ").toLowerCase()} is on file`,
        investorId: i.id,
        orderId: o?.id,
        owner: i.accountManager,
        openedAt: o?.createdAt ?? i.createdAt,
        nextAction: "Request the document through the investor dashboard",
        severity: "medium",
      });
    }
    if (i.owner.transferAgentName !== i.owner.registeredName) {
      const o = s.orders.find((x) => x.investorId === i.id);
      items.push({
        id: `act_ta_${i.id}`,
        type: "ta_mismatch",
        title: `${i.owner.registeredName} · transfer-agent name mismatch`,
        detail: `Submitted "${i.owner.registeredName}"; transfer agent holds "${i.owner.transferAgentName}"`,
        investorId: i.id,
        orderId: o?.id,
        owner: "Daniel Okafor",
        openedAt: daysAgo(ageDays(o?.acceptedAt ?? i.createdAt) > 12 ? 12 : 4, 9),
        nextAction: "Confirm the legal name with the investor and correct the register",
        severity: "medium",
      });
    }
  }
  const sev = { high: 0, medium: 1, low: 2 };
  return items.sort((a, b) => sev[a.severity] - sev[b.severity] || a.openedAt.localeCompare(b.openedAt));
}

/* ------------------------------------------------------------------ */
/*  Investor views                                                      */
/* ------------------------------------------------------------------ */

export interface InvestorRow {
  investor: Investor;
  orders: Order[];
  committed: number;
  sharesIssued: number;
  sharesPending: number;
  latestStatus: OrderStatus;
  latestOrder: Order;
  openActions: number;
}

export function investorRows(): InvestorRow[] {
  const s = getStore();
  const actions = actionItems();
  return s.investors
    .map((investor) => {
      const orders = s.orders.filter((o) => o.investorId === investor.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      const latestOrder = orders[0];
      const holdings = s.holdings.filter((h) => h.investorId === investor.id);
      return {
        investor,
        orders,
        committed: orders.filter((o) => COMMITTED.includes(o.status)).reduce((a, o) => a + o.amount, 0),
        sharesIssued: holdings.filter((h) => h.status === "issued").reduce((a, h) => a + h.shares, 0),
        sharesPending: holdings.filter((h) => h.status === "pending_issuance").reduce((a, h) => a + h.shares, 0),
        latestStatus: latestOrder?.status ?? "started",
        latestOrder,
        openActions: actions.filter((a) => a.investorId === investor.id).length,
      };
    })
    .filter((r) => r.latestOrder)
    .sort((a, b) => b.latestOrder.updatedAt.localeCompare(a.latestOrder.updatedAt));
}

export function investorTimeline(investorId: string): TimelineEvent[] {
  const s = getStore();
  const inv = s.investors.find((i) => i.id === investorId);
  if (!inv) return [];
  const ev: TimelineEvent[] = [];
  const push = (e: Omit<TimelineEvent, "id">) => ev.push({ id: `tl_${ev.length + 1}`, ...e });

  push({ at: inv.createdAt, kind: "application", title: "Created access with email verification", detail: `${inv.source.device} · ${inv.source.utmSource}`, tone: "neutral" });

  for (const o of s.orders.filter((o) => o.investorId === investorId)) {
    push({ at: o.createdAt, kind: "application", title: `Started order ${o.id}`, detail: `${o.shares.toLocaleString()} shares · $${o.amount.toLocaleString()}`, tone: "neutral" });
    if (o.verifiedAt && o.status !== "check_failed") {
      push({ at: o.verifiedAt, kind: "check", title: "KYC, AML and accreditation cleared", detail: `${inv.verification.accreditationMethod} · ${inv.verification.providerRef}`, tone: "good" });
    }
    if (o.status === "check_failed") {
      push({ at: o.updatedAt, kind: "check", title: "Verification failed", detail: o.failureReason, tone: "bad" });
    }
    const sig = s.signatures.find((x) => x.id === o.signatureId);
    if (sig) {
      push({ at: sig.sentAt, kind: "signature", title: "Subscription documents sent for signature", detail: sig.envelopeId, tone: "neutral" });
      if (sig.signedAt) push({ at: sig.signedAt, kind: "signature", title: "Signed subscription agreement and investor rights letter", detail: `Completion certificate ${sig.completionCertificate}`, tone: "good" });
      if (sig.status === "declined") push({ at: o.cancelledAt ?? sig.sentAt, kind: "signature", title: "Declined to sign; order cancelled", tone: "warn" });
    }
    const pay = s.payments.find((x) => x.id === o.paymentId);
    if (pay) {
      push({ at: pay.initiatedAt, kind: "payment", title: `Payment submitted by ${pay.method === "ach" ? "ACH" : pay.method === "wire" ? "wire" : `${pay.coin} on ${pay.network}`}`, detail: pay.providerRef, tone: "neutral" });
      if (pay.clearedAt) push({ at: pay.clearedAt, kind: "payment", title: "Funds cleared into escrow", detail: `$${pay.amount.toLocaleString()} · rail fee $${pay.railFee.toFixed(2)}`, tone: "good" });
      if (pay.returnedAt) push({ at: pay.returnedAt, kind: "payment", title: "ACH payment returned", detail: pay.returnCode, tone: "bad" });
      if (pay.refundedAt) push({ at: pay.refundedAt, kind: "payment", title: "Refund issued", detail: "Subscription withdrawn before closing", tone: "warn" });
    }
    if (o.acceptedAt) push({ at: o.acceptedAt, kind: "issuance", title: "Subscription accepted for the next closing", tone: "good" });
    const hold = s.holdings.find((x) => x.id === o.holdingId);
    if (hold?.releasedAt) push({ at: hold.releasedAt, kind: "issuance", title: "Escrow funds released to issuer", tone: "neutral" });
    if (hold?.issuedAt) push({ at: hold.issuedAt, kind: "issuance", title: `Transfer agent confirmed ${hold.shares.toLocaleString()} shares`, detail: hold.transferAgentRef, tone: "good" });
    const pass = s.passes.find((x) => x.id === o.passId);
    if (pass?.addedAt) push({ at: pass.addedAt, kind: "wallet", title: `Added pass to ${pass.platform === "apple" ? "Apple Wallet" : "Google Wallet"}`, detail: pass.serial, tone: "neutral" });
    if (pass && pass.version > 1) push({ at: pass.lastUpdatedAt, kind: "wallet", title: `Pass updated to version ${pass.version}`, detail: o.status === "issued" ? "Shows confirmed shares and indicative value" : "Status updated", tone: "neutral" });
  }
  for (const t of s.tickets.filter((t) => t.investorId === investorId)) {
    push({ at: t.openedAt, kind: "support", title: `Support: ${t.subject}`, detail: t.status === "open" ? "Open" : "Resolved", tone: t.status === "open" ? "warn" : "neutral" });
  }
  for (const n of inv.notes) push({ at: n.at, kind: "note", title: `Note by ${n.author}`, detail: n.text, tone: "neutral" });
  for (const u of s.updates) {
    if (u.publishedAt > inv.createdAt) push({ at: u.publishedAt, kind: "email", title: `Received update: ${u.title}`, tone: "neutral" });
  }
  return ev.sort((a, b) => b.at.localeCompare(a.at));
}

/* ------------------------------------------------------------------ */
/*  Pass view: everything the on-screen pass and pass.json need         */
/* ------------------------------------------------------------------ */

export interface PassView {
  pass: WalletPass;
  order: Order;
  investor: Investor;
  issuer: Issuer;
  offering: Offering;
  securityClass: SecurityClass;
  holding?: Holding;
  payment?: Payment;
  signature?: Signature;
  valuation: Valuation;
  /** Indicative value, or null when no defensible reference price exists. */
  indicativeValue: number | null;
  statusLabel: string;
  holdingStatus: "pending" | "issued" | "refunded" | "cancelled";
  dashboardUrl: string;
}

export function passView(passId: string): PassView | undefined {
  const s = getStore();
  const pass = s.passes.find((p) => p.id === passId);
  if (!pass) return undefined;
  const order = s.orders.find((o) => o.id === pass.orderId)!;
  const investor = s.investors.find((i) => i.id === order.investorId)!;
  const issuer = s.issuers.find((i) => i.id === order.issuerId)!;
  const offering = s.offerings.find((o) => o.id === order.offeringId)!;
  const securityClass = s.securityClasses.find((c) => c.id === offering.securityClassId)!;
  const holding = s.holdings.find((h) => h.id === order.holdingId);
  const payment = s.payments.find((p) => p.id === order.paymentId);
  const signature = s.signatures.find((p) => p.id === order.signatureId);
  const valuation = s.valuations.find((v) => v.current && v.issuerId === issuer.id)!;
  const issued = holding?.status === "issued";
  const indicativeValue = issued && valuation.referencePrice ? holding!.shares * valuation.referencePrice : null;
  const holdingStatus = order.status === "refunded" ? "refunded" : order.status === "cancelled" ? "cancelled" : issued ? "issued" : "pending";
  return {
    pass,
    order,
    investor,
    issuer,
    offering,
    securityClass,
    holding,
    payment,
    signature,
    valuation,
    indicativeValue,
    statusLabel: issued ? "Issued" : holdingStatus === "pending" ? "Pending issuance" : STATUS_LABEL[order.status],
    holdingStatus,
    dashboardUrl: `/${issuer.slug}${issuer.investorPortalPath}/${order.id}`,
  };
}

/* ------------------------------------------------------------------ */
/*  Reconciliation                                                      */
/* ------------------------------------------------------------------ */

export interface ReconRow {
  payment: Payment;
  order: Order;
  investor: Investor;
  variance: number;
  state: "matched" | "exception" | "returned" | "pending" | "refunded";
}

export function reconciliation(): ReconRow[] {
  const s = getStore();
  return s.payments
    .map((payment) => {
      const order = s.orders.find((o) => o.id === payment.orderId)!;
      const investor = s.investors.find((i) => i.id === order.investorId)!;
      const variance = payment.providerAmount - payment.amount;
      const state: ReconRow["state"] =
        payment.status === "returned" ? "returned"
          : payment.status === "refunded" ? "refunded"
          : payment.status === "pending" ? "pending"
          : variance !== 0 ? "exception"
          : "matched";
      return { payment, order, investor, variance, state };
    })
    .sort((a, b) => b.payment.initiatedAt.localeCompare(a.payment.initiatedAt));
}

export function transferAgentSync(): { matched: number; pending: number; mismatched: number; lastRun: string } {
  const s = getStore();
  const mismatched = s.investors.filter((i) => i.owner.transferAgentName !== i.owner.registeredName && s.holdings.some((h) => h.investorId === i.id)).length;
  return {
    matched: s.holdings.filter((h) => h.status === "issued").length - mismatched,
    pending: s.holdings.filter((h) => h.status === "pending_issuance").length,
    mismatched,
    lastRun: daysAgo(0, 2),
  };
}

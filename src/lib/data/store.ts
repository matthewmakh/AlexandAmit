import { buildSeed, OFFERING, LUMEN, CLASS_B } from "./seed";
import { DEMO_NOW, addDays } from "./clock";
import type {
  Investor,
  Order,
  OwnerType,
  PaymentMethod,
  Store,
  WalletPass,
  PassPlatform,
  Holding,
  AuditEvent,
} from "./types";

/**
 * In-memory store, kept on globalThis so every route and every HMR cycle
 * shares one instance in the running server. Seeded once at boot.
 */
declare global {
  var __farkasStore: Store | undefined;
}

export function getStore(): Store {
  if (!globalThis.__farkasStore) {
    globalThis.__farkasStore = buildSeed();
  }
  return globalThis.__farkasStore;
}

export function resetStore(): Store {
  globalThis.__farkasStore = buildSeed();
  return globalThis.__farkasStore;
}

const pad = (n: number, w = 4) => String(n).padStart(w, "0");

function nextId(prefix: string): string {
  const s = getStore();
  const id = `${prefix}_${pad(s.seq)}`;
  s.seq += 1;
  return id;
}

function randomHex(len: number): string {
  let out = "";
  for (let i = 0; i < len; i++) out += "0123456789abcdef"[Math.floor(Math.random() * 16)];
  return out;
}

/* ------------------------------------------------------------------ */
/*  Reads                                                               */
/* ------------------------------------------------------------------ */

export function getInvestor(id: string): Investor | undefined {
  return getStore().investors.find((i) => i.id === id);
}

export function getInvestorByEmail(email: string): Investor | undefined {
  const e = email.trim().toLowerCase();
  return getStore().investors.find((i) => i.email.toLowerCase() === e);
}

export function getOrder(id: string): Order | undefined {
  return getStore().orders.find((o) => o.id === id);
}

export function getPass(id: string): WalletPass | undefined {
  return getStore().passes.find((p) => p.id === id);
}

export function getPassBySerial(serial: string): WalletPass | undefined {
  return getStore().passes.find((p) => p.serial === serial);
}

export function ordersForInvestor(investorId: string): Order[] {
  return getStore()
    .orders.filter((o) => o.investorId === investorId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/* ------------------------------------------------------------------ */
/*  Writes                                                              */
/* ------------------------------------------------------------------ */

export interface CheckoutInput {
  firstName: string;
  lastName: string;
  email: string;
  ownerType: OwnerType;
  registeredName: string;
  region: string;
  amount: number;
  method: PaymentMethod;
  device?: Investor["source"]["device"];
  walletConsent: boolean;
}

/**
 * Creates the records a completed checkout produces: investor (or reuse by
 * email), verification, order, signature, payment (pending), and a pending
 * Wallet pass. Mirrors the "payment is not yet ownership" rule: the order
 * lands in payment_pending and the pass shows "Pending issuance".
 */
export function createCheckoutOrder(input: CheckoutInput): { investor: Investor; order: Order; pass: WalletPass } {
  const s = getStore();
  const now = s.now;
  let investor = getInvestorByEmail(input.email);
  if (!investor) {
    investor = {
      id: nextId("inv"),
      issuerId: LUMEN.id,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email.trim().toLowerCase(),
      phone: "",
      owner: {
        ownerType: input.ownerType,
        registeredName: input.registeredName,
        transferAgentName: input.registeredName,
        country: "United States",
        region: input.region,
        taxResidency: "United States",
      },
      verification: {
        kyc: "clear",
        aml: "clear",
        accreditation: "clear",
        accreditationMethod: "Third-party verification letter (CPA)",
        providerRef: `NC-KYC-${randomHex(8).toUpperCase()}`,
        completedAt: now,
      },
      tags: ["New this session"],
      notes: [],
      accountManager: "Maya Chen",
      source: { utmSource: "organic", utmCampaign: "(none)", device: input.device ?? "iPhone", landing: "/invest" },
      missingDocuments: [],
      walletConsent: input.walletConsent,
      createdAt: now,
      lastActiveAt: now,
    };
    s.investors.push(investor);
  } else {
    investor.lastActiveAt = now;
    investor.walletConsent = input.walletConsent;
  }

  const shares = Math.round(input.amount / OFFERING.pricePerShare);
  const order: Order = {
    id: nextId("ord"),
    issuerId: LUMEN.id,
    offeringId: OFFERING.id,
    investorId: investor.id,
    amount: input.amount,
    shares,
    status: "payment_pending",
    createdAt: now,
    updatedAt: now,
    verifiedAt: now,
    signedAt: now,
  };
  const sig = {
    id: nextId("sig"),
    orderId: order.id,
    envelopeId: `ENV-${randomHex(12).toUpperCase()}`,
    status: "signed" as const,
    sentAt: now,
    signedAt: now,
    documentIds: ["doc_sub", "doc_irl"],
    completionCertificate: `CERT-${randomHex(8).toUpperCase()}`,
  };
  s.signatures.push(sig);
  order.signatureId = sig.id;

  const railFee = input.method === "ach" ? 1.5 : input.method === "wire" ? 25 : Math.round(input.amount * 0.01 * 100) / 100;
  const payment = {
    id: nextId("pay"),
    orderId: order.id,
    issuerId: LUMEN.id,
    method: input.method,
    amount: input.amount,
    providerAmount: input.amount,
    railFee,
    status: "pending" as const,
    providerRef: `NC-${input.method.toUpperCase()}-${randomHex(10).toUpperCase()}`,
    initiatedAt: now,
    ...(input.method === "stablecoin"
      ? { coin: "USDC", network: "Base", txHash: `0x${randomHex(40)}`, usdSettled: Math.round((input.amount - railFee) * 100) / 100 }
      : {}),
  };
  s.payments.push(payment);
  order.paymentId = payment.id;

  const pass: WalletPass = {
    id: nextId("pass"),
    orderId: order.id,
    issuerId: LUMEN.id,
    serial: `LUMEN-${randomHex(4).toUpperCase()}-${randomHex(4).toUpperCase()}`,
    authenticationToken: randomHex(32),
    platform: null,
    status: "not_added",
    version: 1,
    lastUpdatedAt: now,
    registeredDevices: 0,
  };
  s.passes.push(pass);
  order.passId = pass.id;

  s.orders.push(order);
  audit(s, "Investor", "Submitted", `Order ${order.id}`, `${investor.owner.registeredName}: ${shares} shares, ${input.method.toUpperCase()}`);
  return { investor, order, pass };
}

export function markPassAdded(passId: string, platform: PassPlatform): WalletPass | undefined {
  const s = getStore();
  const pass = getPass(passId);
  if (!pass) return undefined;
  if (!pass.platform) {
    pass.platform = platform;
    pass.status = "added";
    pass.addedAt = s.now;
    pass.registeredDevices = 1;
  }
  return pass;
}

/**
 * Demo controls: advance an order along the real-world sequence and queue a
 * pass update, the way a verified provider webhook would.
 */
export function advanceOrder(orderId: string): Order | undefined {
  const s = getStore();
  const order = getOrder(orderId);
  if (!order) return undefined;
  const payment = s.payments.find((p) => p.id === order.paymentId);
  const pass = s.passes.find((p) => p.id === order.passId);
  const bump = () => {
    if (pass) {
      pass.version += 1;
      pass.status = pass.platform ? "updated" : "not_added";
      pass.lastUpdatedAt = s.now;
    }
  };
  switch (order.status) {
    case "payment_pending": {
      order.status = "payment_cleared";
      if (payment) {
        payment.status = "cleared";
        payment.clearedAt = s.now;
      }
      order.updatedAt = s.now;
      bump();
      audit(s, "North Capital webhook", "Cleared", `Payment ${payment?.providerRef ?? ""}`, `Order ${order.id} funds cleared into escrow`);
      break;
    }
    case "payment_cleared": {
      order.status = "accepted";
      order.acceptedAt = s.now;
      order.updatedAt = s.now;
      const hold: Holding = {
        id: nextId("hold"),
        orderId: order.id,
        investorId: order.investorId,
        issuerId: LUMEN.id,
        securityClassId: CLASS_B.id,
        shares: order.shares,
        status: "pending_issuance",
      };
      s.holdings.push(hold);
      order.holdingId = hold.id;
      bump();
      audit(s, "Farkas Capital operations", "Accepted", `Subscription ${order.id}`, "Accepted for the next closing");
      break;
    }
    case "accepted": {
      order.status = "issued";
      order.updatedAt = s.now;
      const hold = s.holdings.find((h) => h.id === order.holdingId);
      if (hold) {
        hold.status = "issued";
        hold.issuedAt = s.now;
        hold.transferAgentRef = `KORE-${pad(900 + s.seq, 6)}`;
        hold.releasedAt = addDays(s.now, 0);
      }
      bump();
      audit(s, "Kore webhook", "Issued", `Holding ${hold?.transferAgentRef ?? ""}`, `${order.shares} Class B Common shares confirmed for order ${order.id}`);
      break;
    }
    default:
      break;
  }
  return order;
}

export function addInvestorNote(investorId: string, text: string, author = "Maya Chen"): Investor | undefined {
  const s = getStore();
  const inv = getInvestor(investorId);
  if (!inv) return undefined;
  inv.notes.unshift({ id: nextId("note"), at: s.now, author, text });
  return inv;
}

export function toggleInvestorTag(investorId: string, tag: string): Investor | undefined {
  const inv = getInvestor(investorId);
  if (!inv) return undefined;
  if (inv.tags.includes(tag)) inv.tags = inv.tags.filter((t) => t !== tag);
  else inv.tags = [...inv.tags, tag];
  return inv;
}

function audit(s: Store, actor: string, action: string, subject: string, detail: string) {
  const ev: AuditEvent = {
    id: nextId("aud"),
    issuerId: LUMEN.id,
    at: s.now,
    actor,
    role: actor.includes("webhook") ? "Provider" : actor === "Investor" ? "Investor" : "Broker-dealer",
    action,
    subject,
    detail,
  };
  s.audit.unshift(ev);
}

export { DEMO_NOW };

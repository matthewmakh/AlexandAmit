import { DEMO_NOW, addDays, daysAgo, hoursAgo, minutesAgo } from "./clock";
import type {
  AuditEvent,
  CompanyUpdate,
  Device,
  Holding,
  Integration,
  Investor,
  Issuer,
  Offering,
  Order,
  OrderStatus,
  Payment,
  PaymentMethod,
  SecurityClass,
  Signature,
  Store,
  SupportTicket,
  TeamMember,
  Valuation,
  WalletPass,
} from "./types";

/* ------------------------------------------------------------------ */
/*  Deterministic PRNG so every demo run shows the same numbers.        */
/* ------------------------------------------------------------------ */

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function rand(): number {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20260904);
const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)];
const between = (min: number, max: number) => min + Math.floor(rand() * (max - min + 1));
function weighted<T>(entries: readonly (readonly [T, number])[]): T {
  const total = entries.reduce((s, [, w]) => s + w, 0);
  let r = rand() * total;
  for (const [v, w] of entries) {
    r -= w;
    if (r <= 0) return v;
  }
  return entries[entries.length - 1][0];
}
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const pad = (n: number, w = 4) => String(n).padStart(w, "0");
const clampToNow = (iso: string) => (iso > DEMO_NOW ? DEMO_NOW : iso);
const hex = (len: number) => {
  let s = "";
  for (let i = 0; i < len; i++) s += "0123456789abcdef"[Math.floor(rand() * 16)];
  return s;
};

/* ------------------------------------------------------------------ */
/*  Issuer, class, offering, valuation                                  */
/* ------------------------------------------------------------------ */

export const LUMEN: Issuer = {
  id: "iss_lumen",
  slug: "lumen",
  name: "Lumen Robotics",
  legalName: "Lumen Robotics, Inc.",
  tagline: "Autonomous fulfilment for the mid-market warehouse.",
  description:
    "Lumen builds fleet-managed picking robots that mid-market distributors can deploy in weeks, not quarters. Forty-one facilities run Lumen today.",
  domain: "lumenrobotics.com",
  investorPortalPath: "/investors",
  supportEmail: "investors@lumenrobotics.com",
  brand: {
    primary: "#2B5CFF",
    deep: "#0B2A8A",
    onPrimary: "#FFFFFF",
    label: "rgba(255,255,255,0.72)",
  },
  stablecoinEnabled: true,
  city: "Austin, Texas",
  foundedYear: 2021,
};

export const CLASS_B: SecurityClass = {
  id: "sc_lumen_b",
  issuerId: LUMEN.id,
  name: "Class B Common Stock",
  shortName: "Class B Common",
  votingRights: "One vote per share; no board designation rights.",
  fullyDilutedShares: 5_000_000,
};

const PRICE = 12.5;

export const OFFERING: Offering = {
  id: "off_lumen_a",
  issuerId: LUMEN.id,
  securityClassId: CLASS_B.id,
  name: "Series A Direct Offering",
  exemption: "Rule 506(c) of Regulation D",
  status: "open",
  pricePerShare: PRICE,
  minInvestment: 10_000,
  maxInvestment: 500_000,
  targetAmount: 8_000_000,
  opensAt: daysAgo(75, 14),
  closesAt: daysAgo(-41, 23),
  firstClosingAt: "2026-09-30T20:00:00.000Z",
  nextClosingAt: "2026-10-31T20:00:00.000Z",
  termsVersions: [
    {
      version: 1,
      summary: "Initial terms: $12.50 per share, $10,000 minimum, $8.0M target.",
      status: "superseded",
      createdAt: daysAgo(80, 9),
      approvedBy: "Farkas Capital compliance",
    },
    {
      version: 2,
      summary: "Added rolling closings; clarified use of proceeds and risk factor 14.",
      status: "published",
      createdAt: daysAgo(46, 15),
      approvedBy: "Farkas Capital compliance",
    },
    {
      version: 3,
      summary: "Proposed: raise per-investor maximum to $750,000 for entity investors.",
      status: "pending_approval",
      createdAt: daysAgo(2, 11),
    },
  ],
  documents: [
    { id: "doc_sub", name: "Subscription Agreement", kind: "subscription", pages: 18, version: "v2", requiresSignature: true },
    { id: "doc_ppm", name: "Private Placement Memorandum", kind: "ppm", pages: 64, version: "v2", requiresSignature: false },
    { id: "doc_irl", name: "Investor Rights Letter", kind: "investor_rights", pages: 6, version: "v2", requiresSignature: true },
    { id: "doc_charter", name: "Amended & Restated Certificate of Incorporation", kind: "charter", pages: 22, version: "2026-09", requiresSignature: false },
    { id: "doc_fin", name: "Reviewed Financial Statements FY2025", kind: "financials", pages: 31, version: "FY2025", requiresSignature: false },
    { id: "doc_risk", name: "Risk Factors", kind: "risk", pages: 12, version: "v2", requiresSignature: false },
  ],
  eligibility: [
    "Accredited investors only, verified under Rule 506(c).",
    "U.S. persons and U.S.-domiciled entities and trusts.",
    "Minimum investment $10,000; maximum $500,000 per investor.",
    "Sanctions and AML screening must clear before signing.",
  ],
  useOfProceeds: [
    { label: "Fleet manufacturing", pct: 0.42 },
    { label: "Deployment & field ops", pct: 0.23 },
    { label: "Software & perception R&D", pct: 0.2 },
    { label: "Working capital", pct: 0.15 },
  ],
  placementFeeBps: 350,
  platformFeeBps: 100,
};

export const VALUATIONS: Valuation[] = [
  {
    id: "val_seed",
    issuerId: LUMEN.id,
    securityClassId: CLASS_B.id,
    date: "2024-11-03T00:00:00.000Z",
    amount: 18_000_000,
    basis: "Post-money equity valuation",
    source: "Seed round, priced",
    approvedBy: "Board resolution 2024-11-03",
    referencePrice: 6.0,
    current: false,
    documentName: "Seed_Round_Board_Resolution.pdf",
  },
  {
    id: "val_409a",
    issuerId: LUMEN.id,
    securityClassId: CLASS_B.id,
    date: "2026-03-01T00:00:00.000Z",
    amount: 41_000_000,
    basis: "409A fair market value (common)",
    source: "Independent 409A appraisal",
    approvedBy: "Board resolution 2026-03-04",
    referencePrice: 7.1,
    current: false,
    documentName: "409A_Valuation_Report_2026-03.pdf",
  },
  {
    id: "val_series_a",
    issuerId: LUMEN.id,
    securityClassId: CLASS_B.id,
    date: "2026-09-15T00:00:00.000Z",
    amount: 62_500_000,
    basis: "Post-money equity valuation",
    source: "Series A priced round",
    approvedBy: "Board resolution 2026-09-15; Farkas Capital review 2026-09-17",
    referencePrice: PRICE,
    current: true,
    documentName: "Series_A_Board_Resolution_2026-09-15.pdf",
  },
];

/* ------------------------------------------------------------------ */
/*  People                                                              */
/* ------------------------------------------------------------------ */

const FIRST = [
  "Amara", "Noah", "Priya", "Mateo", "Hannah", "Kenji", "Sofia", "Elijah", "Leila", "Omar",
  "Grace", "Rafael", "Ingrid", "Tobias", "Mei", "Lucas", "Zara", "Ethan", "Naomi", "Diego",
  "Chloe", "Arjun", "Isabel", "Marcus", "Yuki", "Samuel", "Fatima", "Henry", "Nadia", "Julian",
  "Elena", "Caleb", "Aisha", "Victor", "Rosa", "Theo", "Maya", "Idris", "Clara", "Benjamin",
  "Layla", "Owen", "Sana", "Gabriel", "Freya", "Andre", "Keiko", "Felix", "Imani", "Nikolai",
  "Daniela", "Rohan", "Esther", "Malik", "Vera", "Oscar", "Anika", "Leo", "Simone", "Jonah",
];
const LAST = [
  "Okafor", "Bennett", "Natarajan", "Alvarez", "Lindqvist", "Tanaka", "Moreau", "Carter", "Haddad",
  "Farouk", "Whitfield", "Costa", "Berg", "Keller", "Zhang", "Ferreira", "Mensah", "Brooks",
  "Cohen", "Ramirez", "Dubois", "Iyer", "Navarro", "Hughes", "Sato", "Osei", "Rahman", "Walsh",
  "Petrova", "Reyes", "Lund", "Novak", "Adeyemi", "Schmidt", "Delgado", "Varga", "Bakshi",
  "Nguyen", "Fischer", "Abara", "Holm", "Quintero", "Mbeki", "Ivanova", "Larsen", "Kapoor",
  "Oyelaran", "Rossi", "Chaudhry", "Sorensen", "Castillo", "Okoye", "Bauer", "Marsh", "Weiss",
  "Nakamura", "Oduya", "Lambert", "Ghosh", "Pavlov",
];
const ENTITIES = [
  "Blue Harbor Holdings LLC", "Cedar Ridge Capital Partners LP", "Northgate Family Office LLC",
  "Saltmarsh Ventures LLC", "Kestrel Point Investments LLC", "Ironwood Holdings LLC",
  "Meridian Family Investments LLC", "Pinecrest Partners LLC",
];
const TRUSTS = [
  "The Whitfield Family Trust", "Okafor Living Trust dated 2019", "The Ramirez Revocable Trust",
  "Bennett 2021 Irrevocable Trust", "The Haddad Family Trust",
];
const STATES = ["TX", "CA", "NY", "FL", "WA", "IL", "MA", "CO", "GA", "NC", "AZ", "VA", "NJ", "OR", "PA"];
const MANAGERS = ["Maya Chen", "Daniel Okafor", "Priya Natarajan"];
const SOURCES: readonly (readonly [string, number])[] = [
  ["organic", 24], ["linkedin", 26], ["newsletter", 18], ["google-ads", 14], ["referral-partner", 11], ["event", 7],
];
const CAMPAIGNS: Record<string, string[]> = {
  organic: ["(none)"],
  linkedin: ["series-a-launch", "founder-video"],
  newsletter: ["q3-update", "first-close"],
  "google-ads": ["warehouse-automation", "brand"],
  "referral-partner": ["kore-network", "angel-syndicate"],
  event: ["modex-2026"],
};
const DEVICES: readonly (readonly [Device, number])[] = [
  ["iPhone", 46], ["Mac", 22], ["Windows", 17], ["Android", 11], ["iPad", 4],
];
const AMOUNTS: readonly (readonly [number, number])[] = [
  [10_000, 18], [15_000, 12], [20_000, 14], [25_000, 16], [50_000, 16], [75_000, 7],
  [100_000, 8], [150_000, 4], [250_000, 3], [500_000, 1],
];
const METHODS: readonly (readonly [PaymentMethod, number])[] = [["ach", 68], ["wire", 24], ["stablecoin", 8]];

/* ------------------------------------------------------------------ */
/*  Orders by status (counts chosen to make the dashboard interesting)  */
/* ------------------------------------------------------------------ */

const STATUS_PLAN: [OrderStatus, number][] = [
  ["issued", 38],
  ["accepted", 6],
  ["payment_cleared", 7],
  ["payment_pending", 8],
  ["awaiting_payment", 6],
  ["awaiting_signature", 5],
  ["check_failed", 4],
  ["verifying", 3],
  ["started", 5],
  ["refunded", 3],
  ["cancelled", 2],
];

const RETURN_INDEXES = new Set([1, 5]); // payment_pending orders that came back as ACH returns

export function buildSeed(): Store {
  const investors: Investor[] = [];
  const orders: Order[] = [];
  const signatures: Signature[] = [];
  const payments: Payment[] = [];
  const holdings: Holding[] = [];
  const passes: WalletPass[] = [];
  const tickets: SupportTicket[] = [];

  const usedNames = new Set<string>();
  let seq = 1;

  const statuses = shuffle(STATUS_PLAN.flatMap(([s, n]) => Array.from({ length: n }, () => s)));
  let pendingIndex = 0;
  let entityIdx = 0;
  let trustIdx = 0;
  let mismatchCount = 0;
  let missingDocCount = 0;
  let wireVarianceSeeded = false;

  for (let i = 0; i < statuses.length; i++) {
    const status = statuses[i];
    const n = seq++;
    let first = pick(FIRST);
    let last = pick(LAST);
    while (usedNames.has(`${first} ${last}`)) {
      first = pick(FIRST);
      last = pick(LAST);
    }
    usedNames.add(`${first} ${last}`);

    const ownerType = weighted<"individual" | "entity" | "trust">([["individual", 76], ["entity", 16], ["trust", 8]]);
    let registeredName = `${first} ${last}`;
    if (ownerType === "entity") registeredName = ENTITIES[entityIdx++ % ENTITIES.length];
    if (ownerType === "trust") registeredName = TRUSTS[trustIdx++ % TRUSTS.length];

    // Timing by status
    let createdDays: number;
    switch (status) {
      case "issued": createdDays = between(26, 74); break;
      case "accepted": createdDays = between(8, 24); break;
      case "payment_cleared": createdDays = between(3, 12); break;
      case "payment_pending": createdDays = between(1, 7); break;
      case "awaiting_payment": createdDays = between(2, 14); break;
      case "awaiting_signature": createdDays = between(1, 6); break;
      case "check_failed": createdDays = between(2, 10); break;
      case "verifying": createdDays = between(0, 2); break;
      case "started": createdDays = between(0, 3); break;
      case "refunded": createdDays = between(30, 50); break;
      case "cancelled": createdDays = between(20, 40); break;
    }
    const createdAt = daysAgo(createdDays, between(8, 20), between(0, 59));
    const amount = weighted(AMOUNTS);
    const shares = Math.round(amount / PRICE);
    const source = weighted(SOURCES);
    const device = weighted(DEVICES);

    const reached = (s: OrderStatus) => ORDER_RANK[status] >= ORDER_RANK[s];
    const verifiedAt = reached("awaiting_signature") || status === "refunded" || status === "cancelled"
      ? addDays(createdAt, 0, undefined)
      : undefined;

    const accreditationMethod = pick([
      "Third-party verification letter (CPA)",
      "Income documentation (2 years)",
      "Net worth statement with broker letter",
      "Licensed professional (Series 7)",
    ]);

    const failureReason = status === "check_failed"
      ? pick([
          "ID document expired; selfie match below threshold",
          "Sanctions screening returned a potential match for manual review",
          "Accreditation letter older than 90 days",
          "Address could not be verified against submitted documents",
        ])
      : undefined;

    const kyc = status === "check_failed" && failureReason?.startsWith("ID") ? "failed"
      : status === "check_failed" && failureReason?.startsWith("Address") ? "failed"
      : status === "verifying" || status === "started" ? "pending"
      : "clear";
    const aml = status === "check_failed" && failureReason?.startsWith("Sanctions") ? "review"
      : status === "verifying" || status === "started" ? "pending"
      : "clear";
    const accreditation = status === "check_failed" && failureReason?.startsWith("Accreditation") ? "failed"
      : status === "verifying" || status === "started" ? "pending"
      : "clear";

    // A few transfer-agent name mismatches among issued/accepted investors.
    let transferAgentName = registeredName;
    if ((status === "issued" || status === "accepted") && mismatchCount < 3 && rand() < 0.12) {
      mismatchCount++;
      transferAgentName = ownerType === "individual"
        ? `${first} ${last[0]}. ${last}`.replace(`${last[0]}. ${last}`, `${last.toUpperCase()}`)
        : registeredName.replace(" LLC", ", L.L.C.").replace(" Trust", " Trust (2019)");
    }

    // A few investors are missing a document before they can sign.
    const missingDocuments: string[] = [];
    if (status === "awaiting_signature" && missingDocCount < 3) {
      missingDocCount++;
      missingDocuments.push(ownerType === "entity" ? "Entity formation documents" : "Accreditation verification letter");
    }

    const investorId = `inv_${pad(n)}`;
    const orderId = `ord_${pad(n)}`;
    const email = `${first}.${last}${n % 7 === 0 ? n : ""}@${pick(["gmail.com", "outlook.com", "icloud.com", "proton.me", "yahoo.com"])}`.toLowerCase();

    const tags: string[] = [];
    if (amount >= 100_000) tags.push("Large ticket");
    if (ownerType !== "individual") tags.push(ownerType === "entity" ? "Entity" : "Trust");
    if (source === "referral-partner") tags.push("Partner referral");
    if (rand() < 0.15) tags.push("Follow-on interest");
    if (status === "issued" && rand() < 0.2) tags.push("Customer");

    const investor: Investor = {
      id: investorId,
      issuerId: LUMEN.id,
      firstName: first,
      lastName: last,
      email,
      phone: `+1 (${between(201, 989)}) ${between(200, 999)}-${pad(between(0, 9999))}`,
      owner: {
        ownerType,
        registeredName,
        transferAgentName,
        country: "United States",
        region: pick(STATES),
        taxResidency: "United States",
      },
      verification: {
        kyc,
        aml,
        accreditation,
        accreditationMethod,
        providerRef: `NC-KYC-${hex(8).toUpperCase()}`,
        completedAt: verifiedAt,
        failureReason,
      },
      tags,
      notes: [],
      accountManager: MANAGERS[n % MANAGERS.length],
      source: { utmSource: source, utmCampaign: pick(CAMPAIGNS[source]), device, landing: source === "organic" ? "/invest" : "/invest?utm" },
      missingDocuments,
      walletConsent: status !== "started",
      createdAt,
      lastActiveAt: status === "issued" ? daysAgo(between(0, 20), between(7, 22)) : clampToNow(addDays(createdAt, between(0, 2))),
    };
    investors.push(investor);

    const order: Order = {
      id: orderId,
      issuerId: LUMEN.id,
      offeringId: OFFERING.id,
      investorId,
      amount,
      shares,
      status,
      createdAt,
      updatedAt: createdAt,
      verifiedAt,
      failureReason,
    };

    // Signature
    if (reached("awaiting_signature") || status === "refunded" || status === "cancelled") {
      const signed = reached("awaiting_payment") || status === "refunded";
      const sig: Signature = {
        id: `sig_${pad(n)}`,
        orderId,
        envelopeId: `ENV-${hex(12).toUpperCase()}`,
        status: status === "cancelled" ? "declined" : signed ? "signed" : "pending",
        sentAt: addDays(createdAt, 0),
        signedAt: signed ? addDays(createdAt, between(0, 1), between(9, 21)) : undefined,
        documentIds: ["doc_sub", "doc_irl"],
        completionCertificate: signed ? `CERT-${hex(8).toUpperCase()}` : undefined,
      };
      signatures.push(sig);
      order.signatureId = sig.id;
      order.signedAt = sig.signedAt;
      order.updatedAt = sig.signedAt ?? sig.sentAt;
    }

    // Payment
    if (reached("payment_pending") || status === "refunded") {
      let method = weighted(METHODS);
      if (status === "payment_cleared" && !wireVarianceSeeded) method = "wire";
      const initiatedAt = addDays(order.signedAt ?? createdAt, between(0, 1), between(9, 20));
      const isReturn = status === "payment_pending" && RETURN_INDEXES.has(pendingIndex);
      if (status === "payment_pending") pendingIndex++;
      const cleared = reached("payment_cleared") || status === "refunded";
      const railFee = method === "ach" ? 1.5 : method === "wire" ? 25 : Math.round(amount * 0.01 * 100) / 100;
      const pay: Payment = {
        id: `pay_${pad(n)}`,
        orderId,
        issuerId: LUMEN.id,
        method,
        amount,
        providerAmount: amount,
        railFee,
        status: isReturn ? "returned" : status === "refunded" ? "refunded" : cleared ? "cleared" : "pending",
        providerRef: `NC-${method.toUpperCase()}-${hex(10).toUpperCase()}`,
        initiatedAt,
        clearedAt: cleared ? addDays(initiatedAt, method === "ach" ? between(3, 5) : method === "wire" ? 1 : 0, between(9, 17)) : undefined,
        returnedAt: isReturn ? addDays(initiatedAt, 2, 11) : undefined,
        returnCode: isReturn ? pick(["R01 Insufficient funds", "R03 No account / unable to locate"]) : undefined,
        refundedAt: status === "refunded" ? addDays(initiatedAt, between(8, 14), 15) : undefined,
      };
      if (method === "stablecoin") {
        pay.coin = pick(["USDC", "USDC", "USDT"]);
        pay.network = pick(["Base", "Ethereum", "Solana"]);
        pay.txHash = `0x${hex(40)}`;
        pay.usdSettled = Math.round((amount - railFee) * 100) / 100;
      }
      payments.push(pay);
      order.paymentId = pay.id;
      order.updatedAt = pay.clearedAt ?? pay.returnedAt ?? pay.initiatedAt;
      if (status === "refunded") {
        order.refundedAt = pay.refundedAt;
        order.updatedAt = pay.refundedAt!;
      }
      // One reconciliation exception: the provider reports a wire short by an intermediary fee.
      if (status === "payment_cleared" && !wireVarianceSeeded && method === "wire") {
        pay.providerAmount = amount - 35;
        wireVarianceSeeded = true;
      }
    }

    // Acceptance and holding
    if (reached("accepted")) {
      const pay = payments.find((p) => p.orderId === orderId)!;
      order.acceptedAt = addDays(pay.clearedAt!, between(0, 2), 16);
      order.updatedAt = order.acceptedAt;
      const issued = status === "issued";
      const hold: Holding = {
        id: `hold_${pad(n)}`,
        orderId,
        investorId,
        issuerId: LUMEN.id,
        securityClassId: CLASS_B.id,
        shares,
        status: issued ? "issued" : "pending_issuance",
        issuedAt: issued ? "2026-10-02T14:30:00.000Z" : undefined,
        transferAgentRef: issued ? `KORE-${pad(400 + n, 6)}` : undefined,
        releasedAt: issued ? "2026-10-01T18:00:00.000Z" : undefined,
      };
      holdings.push(hold);
      order.holdingId = hold.id;
      if (issued) order.updatedAt = hold.issuedAt!;
    }

    // Wallet pass (exists once payment was submitted)
    if (reached("payment_pending") || status === "refunded") {
      const platform = device === "Android" || device === "Windows"
        ? weighted<"apple" | "google" | null>([["google", 70], [null, 30]])
        : weighted<"apple" | "google" | null>([["apple", 84], [null, 16]]);
      const version = status === "issued" ? 3 : status === "accepted" ? 2 : 1;
      const pass: WalletPass = {
        id: `pass_${pad(n)}`,
        orderId,
        issuerId: LUMEN.id,
        serial: `LUMEN-${hex(4).toUpperCase()}-${hex(4).toUpperCase()}`,
        authenticationToken: hex(32),
        platform,
        status: platform ? (version > 1 ? "updated" : "added") : "not_added",
        version,
        lastUpdatedAt: order.updatedAt,
        addedAt: platform ? addDays(order.createdAt, between(0, 1), between(9, 22)) : undefined,
        registeredDevices: platform ? between(1, 2) : 0,
      };
      passes.push(pass);
      order.passId = pass.id;
    }

    if (status === "cancelled") {
      order.cancelledAt = addDays(createdAt, between(1, 4), 12);
      order.updatedAt = order.cancelledAt;
    }

    orders.push(order);

    // A couple of support tickets.
    if (n === 12 || n === 41) {
      tickets.push({
        id: `tkt_${pad(n)}`,
        issuerId: LUMEN.id,
        investorId,
        openedAt: daysAgo(between(1, 6), 13),
        subject: n === 12 ? "Pass shows old registered name after trust amendment" : "Requesting re-download of Wallet pass on new phone",
        status: n === 41 ? "resolved" : "open",
      });
    }
  }

  // Notes on a handful of investors
  const noteTargets = investors.filter((i) => i.tags.includes("Large ticket")).slice(0, 5);
  noteTargets.forEach((inv, idx) => {
    inv.notes.push({
      id: `note_${idx + 1}`,
      at: daysAgo(between(2, 15), between(9, 18)),
      author: inv.accountManager,
      text: pick([
        "Spoke on the phone; wants to meet the founders before the next closing.",
        "Introduced by a current customer. Interested in a follow-on if the fleet milestone lands.",
        "Asked for the reviewed FY2025 financials; sent via portal.",
        "Prefers wire; CFO handles the funding from the family office account.",
        "Will add a second tranche after their Q4 liquidity event.",
      ]),
    });
  });

  /* ---------------------------------------------------------------- */
  /*  The demo investor: Jordan Ellis, with one issued and one pending  */
  /*  investment, so the Wallet and investor dashboard have content     */
  /*  before anyone runs the checkout.                                  */
  /* ---------------------------------------------------------------- */

  const jordan: Investor = {
    id: "inv_jordan",
    issuerId: LUMEN.id,
    firstName: "Jordan",
    lastName: "Ellis",
    email: "jordan.ellis@example.com",
    phone: "+1 (512) 555-0147",
    owner: {
      ownerType: "individual",
      registeredName: "Jordan A. Ellis",
      transferAgentName: "Jordan A. Ellis",
      country: "United States",
      region: "TX",
      taxResidency: "United States",
    },
    verification: {
      kyc: "clear",
      aml: "clear",
      accreditation: "clear",
      accreditationMethod: "Third-party verification letter (CPA)",
      providerRef: "NC-KYC-7D2A91C4",
      completedAt: "2026-08-14T16:12:00.000Z",
    },
    tags: ["Customer", "Follow-on interest"],
    notes: [
      {
        id: "note_j1",
        at: "2026-10-09T17:40:00.000Z",
        author: "Maya Chen",
        text: "Second investment came in after the Q3 shareholder letter. Runs ops at a Lumen customer site in Dallas.",
      },
    ],
    accountManager: "Maya Chen",
    source: { utmSource: "newsletter", utmCampaign: "q3-update", device: "iPhone", landing: "/invest?utm" },
    missingDocuments: [],
    walletConsent: true,
    createdAt: "2026-08-14T15:02:00.000Z",
    lastActiveAt: hoursAgo(3),
  };
  investors.push(jordan);

  const j1: Order = {
    id: "ord_jordan_1",
    issuerId: LUMEN.id,
    offeringId: OFFERING.id,
    investorId: jordan.id,
    amount: 20_000,
    shares: 1_600,
    status: "issued",
    createdAt: "2026-08-14T15:02:00.000Z",
    updatedAt: "2026-10-02T14:30:00.000Z",
    verifiedAt: "2026-08-14T16:12:00.000Z",
    signedAt: "2026-08-14T16:31:00.000Z",
    acceptedAt: "2026-08-20T17:00:00.000Z",
    signatureId: "sig_jordan_1",
    paymentId: "pay_jordan_1",
    holdingId: "hold_jordan_1",
    passId: "pass_jordan_1",
  };
  signatures.push({
    id: "sig_jordan_1",
    orderId: j1.id,
    envelopeId: "ENV-4F1C9A2B7E55",
    status: "signed",
    sentAt: "2026-08-14T16:14:00.000Z",
    signedAt: "2026-08-14T16:31:00.000Z",
    documentIds: ["doc_sub", "doc_irl"],
    completionCertificate: "CERT-9B3E21A7",
  });
  payments.push({
    id: "pay_jordan_1",
    orderId: j1.id,
    issuerId: LUMEN.id,
    method: "ach",
    amount: 20_000,
    providerAmount: 20_000,
    railFee: 1.5,
    status: "cleared",
    providerRef: "NC-ACH-7A3F0C21D9",
    initiatedAt: "2026-08-14T16:35:00.000Z",
    clearedAt: "2026-08-19T13:05:00.000Z",
  });
  holdings.push({
    id: "hold_jordan_1",
    orderId: j1.id,
    investorId: jordan.id,
    issuerId: LUMEN.id,
    securityClassId: CLASS_B.id,
    shares: 1_600,
    status: "issued",
    issuedAt: "2026-10-02T14:30:00.000Z",
    transferAgentRef: "KORE-000417",
    releasedAt: "2026-10-01T18:00:00.000Z",
  });
  passes.push({
    id: "pass_jordan_1",
    orderId: j1.id,
    issuerId: LUMEN.id,
    serial: "LUMEN-7A3F-0C21",
    authenticationToken: "c1b1d8e0a8f24d1b9e7c3a5f6d2e4b90",
    platform: "apple",
    status: "updated",
    version: 3,
    lastUpdatedAt: "2026-10-02T14:31:00.000Z",
    addedAt: "2026-08-14T16:40:00.000Z",
    registeredDevices: 2,
  });
  orders.push(j1);

  const j2: Order = {
    id: "ord_jordan_2",
    issuerId: LUMEN.id,
    offeringId: OFFERING.id,
    investorId: jordan.id,
    amount: 15_000,
    shares: 1_200,
    status: "payment_cleared",
    createdAt: "2026-10-09T14:20:00.000Z",
    updatedAt: "2026-10-14T13:10:00.000Z",
    verifiedAt: "2026-10-09T14:26:00.000Z",
    signedAt: "2026-10-09T14:41:00.000Z",
    signatureId: "sig_jordan_2",
    paymentId: "pay_jordan_2",
    passId: "pass_jordan_2",
  };
  signatures.push({
    id: "sig_jordan_2",
    orderId: j2.id,
    envelopeId: "ENV-A91D33C0F2B8",
    status: "signed",
    sentAt: "2026-10-09T14:27:00.000Z",
    signedAt: "2026-10-09T14:41:00.000Z",
    documentIds: ["doc_sub", "doc_irl"],
    completionCertificate: "CERT-1E77D04C",
  });
  payments.push({
    id: "pay_jordan_2",
    orderId: j2.id,
    issuerId: LUMEN.id,
    method: "ach",
    amount: 15_000,
    providerAmount: 15_000,
    railFee: 1.5,
    status: "cleared",
    providerRef: "NC-ACH-2C9E51B0A4",
    initiatedAt: "2026-10-09T14:44:00.000Z",
    clearedAt: "2026-10-14T13:10:00.000Z",
  });
  passes.push({
    id: "pass_jordan_2",
    orderId: j2.id,
    issuerId: LUMEN.id,
    serial: "LUMEN-2C9E-51B0",
    authenticationToken: "9f0e2d4c6b8a1f3e5d7c9b0a2e4c6d8f",
    platform: "apple",
    status: "updated",
    version: 2,
    lastUpdatedAt: "2026-10-14T13:11:00.000Z",
    addedAt: "2026-10-09T14:46:00.000Z",
    registeredDevices: 1,
  });
  orders.push(j2);

  /* ---------------------------------------------------------------- */
  /*  Updates, team, integrations, audit                                */
  /* ---------------------------------------------------------------- */

  const updates: CompanyUpdate[] = [
    {
      id: "upd_3",
      issuerId: LUMEN.id,
      publishedAt: daysAgo(6, 15),
      title: "Series A first closing complete",
      summary: "Shares for the first closing were issued by the transfer agent on 2 October. Passes have been updated.",
      body: [
        "On 30 September we completed the first closing of the Series A direct offering. Funds were released from escrow on 1 October and the transfer agent confirmed issuance on 2 October.",
        "If you invested in the first closing, your Wallet pass now shows your confirmed shares and your investor dashboard shows the issuance record and transfer-agent reference.",
        "The second closing is scheduled for 31 October.",
      ],
      audience: "All investors (first closing)",
      attachments: ["First_Closing_Summary.pdf"],
      delivery: { sent: 41, delivered: 41, opened: 36, bounced: 0 },
    },
    {
      id: "upd_2",
      issuerId: LUMEN.id,
      publishedAt: daysAgo(19, 14),
      title: "Q3 shareholder letter",
      summary: "Forty-one live facilities, 99.1% fleet uptime, and the Dallas deployment ahead of plan.",
      body: [
        "Lumen ended the quarter with 41 live facilities and 612 robots in the field. Fleet uptime held at 99.1% across the quarter.",
        "The Dallas distribution centre went live three weeks ahead of plan and is already running two shifts.",
        "Reviewed FY2025 financials are available in your investor dashboard.",
      ],
      audience: "All investors and in-progress applicants",
      attachments: ["Q3_2026_Shareholder_Letter.pdf"],
      delivery: { sent: 78, delivered: 77, opened: 61, bounced: 1 },
    },
    {
      id: "upd_1",
      issuerId: LUMEN.id,
      publishedAt: daysAgo(44, 16),
      title: "Welcome to the Series A direct offering",
      summary: "How the raise works, what your Wallet pass shows, and when shares are issued.",
      body: [
        "Thank you for your interest in Lumen. This offering is conducted under Rule 506(c) with Farkas Capital acting as broker-dealer.",
        "After your payment is verified you can add a pending pass to your Wallet. It shows your order amount and status, and updates to confirmed shares once the transfer agent confirms issuance at a closing.",
      ],
      audience: "All applicants",
      attachments: [],
      delivery: { sent: 52, delivered: 52, opened: 44, bounced: 0 },
    },
  ];

  const team: TeamMember[] = [
    { id: "tm_1", issuerId: LUMEN.id, name: "Avery Lindqvist", email: "avery@lumenrobotics.com", role: "Company admin", lastActiveAt: minutesAgo(12), mfa: true },
    { id: "tm_2", issuerId: LUMEN.id, name: "Maya Chen", email: "maya@lumenrobotics.com", role: "Finance", lastActiveAt: minutesAgo(48), mfa: true },
    { id: "tm_3", issuerId: LUMEN.id, name: "Daniel Okafor", email: "daniel@lumenrobotics.com", role: "Finance", lastActiveAt: hoursAgo(5), mfa: true },
    { id: "tm_4", issuerId: LUMEN.id, name: "Priya Natarajan", email: "priya@lumenrobotics.com", role: "Marketing", lastActiveAt: hoursAgo(1), mfa: true },
    { id: "tm_5", issuerId: LUMEN.id, name: "Sam Whitfield", email: "sam@lumenrobotics.com", role: "Read-only", lastActiveAt: daysAgo(3, 11), mfa: false },
  ];

  const integrations: Integration[] = [
    { id: "int_nc", name: "North Capital TransactAPI", purpose: "KYC/AML, accreditation, escrow, ACH and wire", status: "ok", detail: "Webhooks verified; last event 4 minutes ago", lastEventAt: minutesAgo(4), environment: "sandbox" },
    { id: "int_kore", name: "Kore transfer agent", purpose: "Issuance, holdings, registered names", status: "ok", detail: "Nightly reconciliation ran 02:00 UTC; 0 unmatched holdings", lastEventAt: hoursAgo(13), environment: "sandbox" },
    { id: "int_ds", name: "Docusign eSignature", purpose: "Embedded signing and completion certificates", status: "ok", detail: "Envelope status webhooks healthy", lastEventAt: minutesAgo(31), environment: "sandbox" },
    { id: "int_apple", name: "Apple Wallet", purpose: "Pass signing, registration and APNs updates", status: "ok", detail: "61 passes registered on 74 devices; last push delivered", lastEventAt: hoursAgo(2), environment: "production" },
    { id: "int_google", name: "Google Wallet", purpose: "Generic Private pass for financial data", status: "pending_approval", detail: "Use-case review submitted; private pass class awaiting approval", environment: "sandbox" },
    { id: "int_stable", name: "Stablecoin settlement provider", purpose: "USDC/USDT acceptance, screening and USD conversion", status: "ok", detail: "Enabled for this issuer; 6 settlements this month", lastEventAt: hoursAgo(9), environment: "sandbox" },
    { id: "int_email", name: "Branded email", purpose: "Transactional and investor-relations email", status: "ok", detail: "DKIM and SPF aligned for lumenrobotics.com", lastEventAt: minutesAgo(9), environment: "production" },
  ];

  const audit: AuditEvent[] = [
    { id: "aud_1", issuerId: LUMEN.id, at: hoursAgo(2), actor: "Maya Chen", role: "Finance", action: "Exported", subject: "Investor list (permitted fields)", detail: "CSV, 92 rows, filtered: status = issued" },
    { id: "aud_2", issuerId: LUMEN.id, at: daysAgo(2, 11), actor: "Avery Lindqvist", role: "Company admin", action: "Submitted for approval", subject: "Offering terms v3", detail: "Raise entity maximum to $750,000" },
    { id: "aud_3", issuerId: LUMEN.id, at: daysAgo(6, 15), actor: "Priya Natarajan", role: "Marketing", action: "Sent", subject: "Update: Series A first closing complete", detail: "41 recipients; approved by Farkas Capital communications review" },
    { id: "aud_4", issuerId: LUMEN.id, at: daysAgo(18, 14), actor: "Farkas Capital operations", role: "Broker-dealer", action: "Confirmed", subject: "Transfer-agent issuance, first closing", detail: "38 holdings issued; 38 passes updated to v3" },
    { id: "aud_5", issuerId: LUMEN.id, at: daysAgo(19, 18), actor: "Farkas Capital operations", role: "Broker-dealer", action: "Released", subject: "Escrow funds, first closing", detail: "Released to Lumen Robotics operating account per offering instructions" },
    { id: "aud_6", issuerId: LUMEN.id, at: daysAgo(33, 9), actor: "Farkas Capital compliance", role: "Broker-dealer", action: "Approved", subject: "Valuation: Series A post-money $62.5M", detail: "Reference price $12.50 for Class B Common; pass value labels enabled" },
    { id: "aud_7", issuerId: LUMEN.id, at: daysAgo(40, 10), actor: "Avery Lindqvist", role: "Company admin", action: "Changed role", subject: "Sam Whitfield", detail: "Marketing → Read-only" },
    { id: "aud_8", issuerId: LUMEN.id, at: daysAgo(46, 15), actor: "Farkas Capital compliance", role: "Broker-dealer", action: "Approved", subject: "Offering terms v2", detail: "Rolling closings; risk factor 14 clarified" },
    { id: "aud_9", issuerId: LUMEN.id, at: daysAgo(52, 12), actor: "Avery Lindqvist", role: "Company admin", action: "Updated", subject: "Wallet branding", detail: "Pass template approved: logo, Signal Blue background" },
    { id: "aud_10", issuerId: LUMEN.id, at: daysAgo(75, 14), actor: "Farkas Capital operations", role: "Broker-dealer", action: "Published", subject: "Offering: Series A Direct Offering", detail: "Live at lumenrobotics.com/invest" },
  ];

  /* ---------------------------------------------------------------- */
  /*  Anonymous traffic for the conversion funnel                       */
  /* ---------------------------------------------------------------- */

  const bySource: Record<string, { visits: number; started: number }> = {};
  const totalVisits = 6_420;
  const anonymousStarts = 325;
  for (const [src, w] of SOURCES) {
    const share = w / SOURCES.reduce((s, [, x]) => s + x, 0);
    bySource[src] = { visits: Math.round(totalVisits * share), started: Math.round(anonymousStarts * share) };
  }
  const byDevice = {} as Record<Device, { visits: number; started: number }>;
  for (const [dev, w] of DEVICES) {
    const share = w / DEVICES.reduce((s, [, x]) => s + x, 0);
    byDevice[dev] = { visits: Math.round(totalVisits * share), started: Math.round(anonymousStarts * share) };
  }

  return {
    now: DEMO_NOW,
    issuers: [LUMEN],
    securityClasses: [CLASS_B],
    offerings: [OFFERING],
    valuations: VALUATIONS,
    investors,
    orders,
    signatures,
    payments,
    holdings,
    passes,
    audit,
    updates,
    team,
    integrations,
    tickets,
    traffic: { visits: totalVisits, anonymousStarts, bySource, byDevice, adSpend: 38_400 },
    seq,
  };
}

/** Ordering of statuses along the happy path; used for "reached" checks. */
export const ORDER_RANK: Record<OrderStatus, number> = {
  started: 0,
  verifying: 1,
  check_failed: 1,
  awaiting_signature: 2,
  awaiting_payment: 3,
  payment_pending: 4,
  payment_cleared: 5,
  accepted: 6,
  issued: 7,
  refunded: -1,
  cancelled: -1,
};

export const STATUS_LABEL: Record<OrderStatus, string> = {
  started: "Started",
  verifying: "Verifying",
  check_failed: "Check failed",
  awaiting_signature: "Awaiting signature",
  awaiting_payment: "Awaiting payment",
  payment_pending: "Payment pending",
  payment_cleared: "Funds cleared",
  accepted: "Accepted",
  issued: "Issued",
  refunded: "Refunded",
  cancelled: "Cancelled",
};

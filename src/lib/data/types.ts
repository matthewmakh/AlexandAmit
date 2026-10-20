/**
 * Core records, mirroring the scope's data design:
 * Issuer, Offering, SecurityClass, Investor, LegalOwner, Verification, Order,
 * Signature, Payment, Allocation/Holding, Valuation, WalletPass, AuditEvent.
 *
 * Every record carries an issuerId so issuer-level access can be enforced on
 * each read. The demo keeps these in memory; the real build keeps them in
 * PostgreSQL with the same shape.
 */

export type ISODate = string;

export type OwnerType = "individual" | "entity" | "trust";

export type CheckStatus = "pending" | "clear" | "review" | "failed" | "not_required";

export type OrderStatus =
  | "started"
  | "verifying"
  | "check_failed"
  | "awaiting_signature"
  | "awaiting_payment"
  | "payment_pending"
  | "payment_cleared"
  | "accepted"
  | "issued"
  | "refunded"
  | "cancelled";

export type PaymentMethod = "ach" | "wire" | "stablecoin";
export type PaymentStatus = "pending" | "cleared" | "returned" | "failed" | "refunded";
export type HoldingStatus = "pending_issuance" | "issued" | "cancelled";
export type PassPlatform = "apple" | "google";
export type PassStatus = "not_added" | "added" | "update_queued" | "updated";
export type Device = "iPhone" | "Android" | "Mac" | "Windows" | "iPad";

export interface Brand {
  /** Primary brand colour, used for the pass background and accents. */
  primary: string;
  /** Deeper shade for gradients. */
  deep: string;
  /** Text colour on top of the primary colour. */
  onPrimary: string;
  /** Label colour on the pass (slightly translucent onPrimary). */
  label: string;
}

export interface Issuer {
  id: string;
  slug: string;
  name: string;
  legalName: string;
  tagline: string;
  description: string;
  domain: string;
  investorPortalPath: string;
  supportEmail: string;
  brand: Brand;
  stablecoinEnabled: boolean;
  city: string;
  foundedYear: number;
}

export interface SecurityClass {
  id: string;
  issuerId: string;
  name: string;
  shortName: string;
  votingRights: string;
  fullyDilutedShares: number;
}

export interface OfferingDocument {
  id: string;
  name: string;
  kind: "subscription" | "ppm" | "charter" | "financials" | "risk" | "investor_rights";
  pages: number;
  version: string;
  requiresSignature: boolean;
}

export interface TermsVersion {
  version: number;
  summary: string;
  status: "published" | "pending_approval" | "superseded";
  createdAt: ISODate;
  approvedBy?: string;
}

export interface Offering {
  id: string;
  issuerId: string;
  securityClassId: string;
  name: string;
  exemption: string;
  status: "draft" | "open" | "closed";
  pricePerShare: number;
  minInvestment: number;
  maxInvestment: number;
  targetAmount: number;
  opensAt: ISODate;
  closesAt: ISODate;
  nextClosingAt: ISODate;
  firstClosingAt: ISODate;
  termsVersions: TermsVersion[];
  documents: OfferingDocument[];
  eligibility: string[];
  useOfProceeds: { label: string; pct: number }[];
  /** Broker-dealer fee in basis points of gross proceeds. */
  placementFeeBps: number;
  /** Platform fee in basis points of gross proceeds. */
  platformFeeBps: number;
}

export interface Valuation {
  id: string;
  issuerId: string;
  securityClassId: string;
  date: ISODate;
  amount: number;
  basis: string;
  source: string;
  approvedBy: string;
  /** Approved reference price per share for the same class, or null when none is defensible. */
  referencePrice: number | null;
  current: boolean;
  documentName: string;
}

export interface Note {
  id: string;
  at: ISODate;
  author: string;
  text: string;
}

export interface LegalOwner {
  ownerType: OwnerType;
  /** Exact legal name submitted by the investor. */
  registeredName: string;
  /** Name as it appears in the transfer-agent record. */
  transferAgentName: string;
  country: string;
  region: string;
  taxResidency: string;
}

export interface Verification {
  kyc: CheckStatus;
  aml: CheckStatus;
  accreditation: CheckStatus;
  accreditationMethod: string;
  providerRef: string;
  completedAt?: ISODate;
  failureReason?: string;
}

export interface Source {
  utmSource: string;
  utmCampaign: string;
  device: Device;
  landing: string;
}

export interface Investor {
  id: string;
  issuerId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  owner: LegalOwner;
  verification: Verification;
  tags: string[];
  notes: Note[];
  accountManager: string;
  source: Source;
  missingDocuments: string[];
  walletConsent: boolean;
  createdAt: ISODate;
  lastActiveAt: ISODate;
}

export interface Signature {
  id: string;
  orderId: string;
  envelopeId: string;
  status: "pending" | "signed" | "declined";
  sentAt: ISODate;
  signedAt?: ISODate;
  documentIds: string[];
  completionCertificate?: string;
}

export interface Payment {
  id: string;
  orderId: string;
  issuerId: string;
  method: PaymentMethod;
  amount: number;
  /** Fee charged by the rail, deducted before escrow. */
  railFee: number;
  status: PaymentStatus;
  providerRef: string;
  initiatedAt: ISODate;
  clearedAt?: ISODate;
  returnedAt?: ISODate;
  refundedAt?: ISODate;
  returnCode?: string;
  /** Stablecoin only */
  coin?: string;
  network?: string;
  txHash?: string;
  usdSettled?: number;
  /** Amount the provider reports; differs from amount when there is an exception. */
  providerAmount: number;
}

export interface Holding {
  id: string;
  orderId: string;
  investorId: string;
  issuerId: string;
  securityClassId: string;
  shares: number;
  status: HoldingStatus;
  issuedAt?: ISODate;
  transferAgentRef?: string;
  releasedAt?: ISODate;
}

export interface WalletPass {
  id: string;
  orderId: string;
  issuerId: string;
  serial: string;
  authenticationToken: string;
  platform: PassPlatform | null;
  status: PassStatus;
  version: number;
  lastUpdatedAt: ISODate;
  addedAt?: ISODate;
  registeredDevices: number;
}

export interface Order {
  id: string;
  issuerId: string;
  offeringId: string;
  investorId: string;
  amount: number;
  shares: number;
  status: OrderStatus;
  createdAt: ISODate;
  updatedAt: ISODate;
  verifiedAt?: ISODate;
  signedAt?: ISODate;
  acceptedAt?: ISODate;
  refundedAt?: ISODate;
  cancelledAt?: ISODate;
  signatureId?: string;
  paymentId?: string;
  holdingId?: string;
  passId?: string;
  failureReason?: string;
}

export interface AuditEvent {
  id: string;
  issuerId: string;
  at: ISODate;
  actor: string;
  role: string;
  action: string;
  subject: string;
  detail: string;
}

export type ActionType =
  | "failed_check"
  | "missing_document"
  | "unpaid_order"
  | "return"
  | "ta_mismatch";

export interface ActionItem {
  id: string;
  type: ActionType;
  title: string;
  detail: string;
  investorId: string;
  orderId?: string;
  owner: string;
  openedAt: ISODate;
  nextAction: string;
  severity: "high" | "medium" | "low";
}

export type TimelineKind =
  | "application"
  | "check"
  | "signature"
  | "payment"
  | "issuance"
  | "wallet"
  | "support"
  | "note"
  | "email";

export interface TimelineEvent {
  id: string;
  at: ISODate;
  kind: TimelineKind;
  title: string;
  detail?: string;
  tone: "neutral" | "good" | "warn" | "bad";
}

export interface CompanyUpdate {
  id: string;
  issuerId: string;
  publishedAt: ISODate;
  title: string;
  summary: string;
  body: string[];
  audience: string;
  attachments: string[];
  delivery: { sent: number; delivered: number; opened: number; bounced: number };
}

export interface TeamMember {
  id: string;
  issuerId: string;
  name: string;
  email: string;
  role: "Company admin" | "Finance" | "Marketing" | "Read-only";
  lastActiveAt: ISODate;
  mfa: boolean;
}

export interface Integration {
  id: string;
  name: string;
  purpose: string;
  status: "ok" | "degraded" | "pending_approval" | "error";
  detail: string;
  lastEventAt?: ISODate;
  environment: "sandbox" | "production";
}

export interface SupportTicket {
  id: string;
  issuerId: string;
  investorId: string;
  openedAt: ISODate;
  subject: string;
  status: "open" | "resolved";
}

export interface DailyPoint {
  date: ISODate;
  visits: number;
  started: number;
  committed: number;
  received: number;
  cleared: number;
}

export interface Store {
  now: ISODate;
  issuers: Issuer[];
  securityClasses: SecurityClass[];
  offerings: Offering[];
  valuations: Valuation[];
  investors: Investor[];
  orders: Order[];
  signatures: Signature[];
  payments: Payment[];
  holdings: Holding[];
  passes: WalletPass[];
  audit: AuditEvent[];
  updates: CompanyUpdate[];
  team: TeamMember[];
  integrations: Integration[];
  tickets: SupportTicket[];
  /** Anonymous funnel traffic that never created an investor record. */
  traffic: {
    visits: number;
    anonymousStarts: number;
    bySource: Record<string, { visits: number; started: number }>;
    byDevice: Record<Device, { visits: number; started: number }>;
    adSpend: number;
  };
  /** Counter used for ids created at runtime. */
  seq: number;
}

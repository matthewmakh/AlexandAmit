import type { PassView } from "@/lib/data/derive";
import { date, money, number } from "@/lib/data/format";

/** Apple wants colours as rgb(r, g, b). */
export function hexToRgb(hex: string): string {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`;
}

export interface PassField {
  key: string;
  label?: string;
  value: string | number;
  attributedValue?: string;
  textAlignment?: "PKTextAlignmentLeft" | "PKTextAlignmentCenter" | "PKTextAlignmentRight" | "PKTextAlignmentNatural";
  changeMessage?: string;
}

export interface PassJson {
  formatVersion: 1;
  passTypeIdentifier: string;
  teamIdentifier: string;
  serialNumber: string;
  authenticationToken: string;
  webServiceURL: string;
  organizationName: string;
  description: string;
  logoText: string;
  foregroundColor: string;
  backgroundColor: string;
  labelColor: string;
  sharingProhibited: boolean;
  suppressStripShine: boolean;
  barcodes: { format: "PKBarcodeFormatQR"; message: string; messageEncoding: "iso-8859-1"; altText: string }[];
  generic: {
    headerFields: PassField[];
    primaryFields: PassField[];
    secondaryFields: PassField[];
    auxiliaryFields: PassField[];
    backFields: PassField[];
  };
  userInfo: Record<string, string | number>;
}

export const PASS_TYPE_ID = process.env.APPLE_PASS_TYPE_ID ?? "pass.com.farkascapital.investment";
export const TEAM_ID = process.env.APPLE_TEAM_ID ?? "FARKAS0000";

/**
 * Builds pass.json from the synchronized records. Field content follows the
 * scope's rules: never "Shares owned" before issuance, indicative value only
 * with an approved reference price for the same class, valuation with date,
 * source and basis, and the dashboard link in the details area.
 */
export function buildPassJson(view: PassView, origin: string): PassJson {
  const { pass, order, investor, issuer, holding, valuation, securityClass, indicativeValue } = view;
  const issued = view.holdingStatus === "issued";
  const refunded = view.holdingStatus === "refunded" || view.holdingStatus === "cancelled";

  const headerFields: PassField[] = [
    { key: "status", label: "STATUS", value: view.statusLabel, changeMessage: "Your %@ status changed: %@" },
  ];

  const primaryFields: PassField[] = issued
    ? [{ key: "shares", label: securityClass.shortName.toUpperCase(), value: `${number(holding!.shares)} shares`, changeMessage: "Holding updated: %@" }]
    : refunded
      ? [{ key: "order", label: "ORDER", value: money(order.amount) }]
      : [{ key: "order", label: "PENDING ISSUANCE", value: money(order.amount), changeMessage: "Order updated: %@" }];

  const secondaryFields: PassField[] = [
    { key: "owner", label: "REGISTERED OWNER", value: issued ? investor.owner.transferAgentName : investor.owner.registeredName },
    indicativeValue !== null
      ? { key: "value", label: "INDICATIVE VALUE", value: money(indicativeValue), textAlignment: "PKTextAlignmentRight", changeMessage: "Indicative value updated: %@" }
      : { key: "value", label: issued ? "INDICATIVE VALUE" : "AMOUNT INVESTED", value: issued ? "Value unavailable" : money(order.amount), textAlignment: "PKTextAlignmentRight" },
  ];

  const auxiliaryFields: PassField[] = [
    { key: "purchased", label: "PURCHASED", value: date(order.createdAt, "medium") },
    { key: "valuation", label: "COMPANY VALUATION", value: `${compact(valuation.amount)} · ${date(valuation.date, "short")}`, textAlignment: "PKTextAlignmentRight" },
  ];

  const backFields: PassField[] = [
    {
      key: "dashboard",
      label: "Investor dashboard",
      value: `${origin}${view.dashboardUrl}`,
      attributedValue: `<a href="${origin}${view.dashboardUrl}">View investor dashboard</a>`,
    },
    { key: "holding_status", label: "Holding status", value: issued ? `Issued · ${number(holding!.shares)} ${securityClass.name}` : refunded ? view.statusLabel : "Pending issuance. Shares are confirmed only after funds clear, the subscription is accepted, the offering closes and the transfer agent confirms issuance." },
    ...(issued && holding?.issuedAt ? [{ key: "issued_on", label: "Issuance date", value: `${date(holding.issuedAt, "long")} · Transfer-agent ref ${holding.transferAgentRef}` }] : []),
    { key: "purchase_date", label: "Purchase date", value: date(order.createdAt, "long") },
    { key: "valuation_detail", label: "Company valuation", value: `${money(valuation.amount)} · ${valuation.basis} · ${valuation.source} · ${date(valuation.date, "long")}. Not a live market price.` },
    {
      key: "value_detail",
      label: "Indicative value",
      value:
        indicativeValue !== null
          ? `${money(indicativeValue)} = ${number(holding!.shares)} shares × ${money(valuation.referencePrice!, true)} approved reference price for ${securityClass.name}, as of ${date(valuation.date, "long")}. This is not a sale or redemption price.`
          : issued
            ? "No approved reference price exists for this share class, so no value is shown."
            : `Original investment amount ${money(order.amount)}. A value appears after issuance when an approved reference price exists.`,
    },
    { key: "updated", label: "Last updated", value: `${date(pass.lastUpdatedAt, "long")} · pass version ${pass.version}` },
    { key: "support", label: "Support", value: issuer.supportEmail },
    { key: "disclosure", label: "Disclosures", value: `Securities offered through Farkas Capital, a registered broker-dealer. This pass is a display of synchronized records; it is not custody, a tradable token, or the official shareholder register. The investor dashboard shows the authoritative current status. Placeholder text subject to counsel approval.` },
  ];

  return {
    formatVersion: 1,
    passTypeIdentifier: PASS_TYPE_ID,
    teamIdentifier: TEAM_ID,
    serialNumber: pass.serial,
    authenticationToken: pass.authenticationToken,
    webServiceURL: `${origin}/api/wallet`,
    organizationName: issuer.name,
    description: `${issuer.name} investment`,
    logoText: issuer.name,
    foregroundColor: hexToRgb(issuer.brand.onPrimary),
    backgroundColor: hexToRgb(issuer.brand.primary),
    labelColor: "rgb(214, 224, 255)",
    sharingProhibited: true,
    suppressStripShine: true,
    barcodes: [{ format: "PKBarcodeFormatQR", message: pass.serial, messageEncoding: "iso-8859-1", altText: pass.serial }],
    generic: { headerFields, primaryFields, secondaryFields, auxiliaryFields, backFields },
    userInfo: { passId: pass.id, orderId: order.id, version: pass.version },
  };
}

function compact(n: number): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  return money(n);
}

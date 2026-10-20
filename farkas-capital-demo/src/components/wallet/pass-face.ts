import type { PassView } from "@/lib/data/derive";
import { date, money, number } from "@/lib/data/format";

export interface PassFace {
  logoText: string;
  header: { label: string; value: string };
  primary: { label: string; value: string };
  secondary: { label: string; value: string }[];
  auxiliary: { label: string; value: string }[];
  back: { label: string; value: string; href?: string }[];
  serial: string;
  colors: { bg: string; deep: string; fg: string; label: string };
}

/** Front and back content for a pass, derived with the same rules as pass.json. */
export function passFace(view: PassView, origin = ""): PassFace {
  const { order, investor, holding, valuation, securityClass, indicativeValue, issuer, pass } = view;
  const issued = view.holdingStatus === "issued";
  const refunded = view.holdingStatus === "refunded" || view.holdingStatus === "cancelled";
  return {
    logoText: issuer.name,
    header: { label: "Status", value: view.statusLabel },
    primary: issued
      ? { label: securityClass.shortName, value: `${number(holding!.shares)} shares` }
      : { label: refunded ? "Order" : "Pending issuance", value: money(order.amount) },
    secondary: [
      { label: "Registered owner", value: issued ? investor.owner.transferAgentName : investor.owner.registeredName },
      indicativeValue !== null
        ? { label: "Indicative value", value: money(indicativeValue) }
        : { label: issued ? "Indicative value" : "Amount invested", value: issued ? "Value unavailable" : money(order.amount) },
    ],
    auxiliary: [
      { label: "Purchased", value: date(order.createdAt, "medium") },
      { label: "Company valuation", value: `${compact(valuation.amount)} · ${date(valuation.date, "short")}` },
    ],
    back: [
      { label: "Investor dashboard", value: "View investor dashboard", href: `${origin}${view.dashboardUrl}` },
      {
        label: "Holding status",
        value: issued
          ? `Issued · ${number(holding!.shares)} ${securityClass.name}`
          : refunded
            ? view.statusLabel
            : "Pending issuance. Shares are confirmed only after funds clear, the subscription is accepted, the offering closes and the transfer agent confirms issuance.",
      },
      ...(issued && holding?.issuedAt ? [{ label: "Issuance date", value: `${date(holding.issuedAt, "long")} · ref ${holding.transferAgentRef}` }] : []),
      { label: "Purchase date", value: date(order.createdAt, "long") },
      { label: "Company valuation", value: `${money(valuation.amount)} · ${valuation.basis} · ${valuation.source} · ${date(valuation.date, "long")}. Not a live market price.` },
      {
        label: "Indicative value",
        value:
          indicativeValue !== null
            ? `${money(indicativeValue)} = ${number(holding!.shares)} shares × ${money(valuation.referencePrice!, true)} approved reference price for ${securityClass.name}, as of ${date(valuation.date, "long")}. Not a sale or redemption price.`
            : issued
              ? "No approved reference price exists for this share class, so no value is shown."
              : `Original investment amount ${money(order.amount)}. A value appears after issuance when an approved reference price exists.`,
      },
      { label: "Last updated", value: `${date(pass.lastUpdatedAt, "long")} · pass version ${pass.version}` },
      { label: "Support", value: issuer.supportEmail },
      { label: "Disclosures", value: "Securities offered through Farkas Capital, a registered broker-dealer. This pass displays synchronized records; it is not custody, a tradable token, or the official shareholder register. The investor dashboard shows the authoritative current status." },
    ],
    serial: pass.serial,
    colors: { bg: issuer.brand.primary, deep: issuer.brand.deep, fg: issuer.brand.onPrimary, label: "rgba(214,224,255,0.9)" },
  };
}

function compact(n: number): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  return money(n);
}


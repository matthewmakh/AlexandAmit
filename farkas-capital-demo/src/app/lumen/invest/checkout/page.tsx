import type { Metadata } from "next";
import { getStore } from "@/lib/data/store";
import { Checkout } from "./Checkout";

export const metadata: Metadata = { title: "Invest · Checkout" };
export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  const s = getStore();
  const offering = s.offerings[0];
  const issuer = s.issuers[0];
  const cls = s.securityClasses[0];
  return (
    <Checkout
      offering={{
        name: offering.name,
        pricePerShare: offering.pricePerShare,
        minInvestment: offering.minInvestment,
        maxInvestment: offering.maxInvestment,
        documents: offering.documents.filter((d) => d.requiresSignature).map((d) => ({ id: d.id, name: d.name, pages: d.pages })),
        className: cls.name,
        nextClosingAt: offering.nextClosingAt,
      }}
      issuer={{ name: issuer.name, legalName: issuer.legalName, supportEmail: issuer.supportEmail, stablecoinEnabled: issuer.stablecoinEnabled }}
    />
  );
}

import type { PassFace } from "@/components/wallet/pass-face";

/** Two more fictional issuers, so Wallet reads as the familiar place for passes from different companies. */
export const HARBOR_FACE: PassFace = {
  logoText: "Harbor Coffee Roasters",
  header: { label: "Status", value: "Issued" },
  primary: { label: "Class A Common", value: "4,000 shares" },
  secondary: [
    { label: "Registered owner", value: "Jordan A. Ellis" },
    { label: "Indicative value", value: "$10,400" },
  ],
  auxiliary: [
    { label: "Purchased", value: "Mar 3, 2026" },
    { label: "Company valuation", value: "$9.5M · Feb 20" },
  ],
  back: [],
  serial: "HARBOR-5D21-B0A3",
  colors: { bg: "#B45309", deep: "#6B2E05", fg: "#FFFFFF", label: "rgba(255,233,210,0.9)" },
};

export const VERDANT_FACE: PassFace = {
  logoText: "Verdant Grid",
  header: { label: "Status", value: "Pending issuance" },
  primary: { label: "Pending issuance", value: "$25,000" },
  secondary: [
    { label: "Registered owner", value: "Jordan A. Ellis" },
    { label: "Amount invested", value: "$25,000" },
  ],
  auxiliary: [
    { label: "Purchased", value: "Oct 15, 2026" },
    { label: "Company valuation", value: "$120M · Sep 30" },
  ],
  back: [],
  serial: "VERDANT-91C4-7E02",
  colors: { bg: "#15803D", deep: "#064E27", fg: "#FFFFFF", label: "rgba(220,255,230,0.9)" },
};

import type { Metadata } from "next";
import { DashShell } from "@/components/dashboard/Shell";

export const metadata: Metadata = {
  title: { default: "Issuer dashboard", template: "%s · Issuer dashboard" },
};

export default function IssuerLayout({ children }: LayoutProps<"/issuer">) {
  return <DashShell>{children}</DashShell>;
}

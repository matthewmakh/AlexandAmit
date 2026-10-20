import type { Metadata } from "next";
import { OpsShell } from "@/components/ops/OpsShell";

export const metadata: Metadata = { title: { default: "Operations console", template: "%s · Farkas Capital ops" } };

export default function OpsLayout({ children }: LayoutProps<"/ops">) {
  return <OpsShell>{children}</OpsShell>;
}

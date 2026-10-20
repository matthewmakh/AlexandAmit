import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Lumen Robotics", template: "%s · Lumen Robotics" },
  description: "Autonomous fulfilment for the mid-market warehouse.",
};

export default function LumenLayout({ children }: LayoutProps<"/lumen">) {
  return <>{children}</>;
}

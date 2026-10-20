import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { DemoDock } from "@/components/marketing/DemoDock";

const inter = localFont({
  src: "./fonts/InterVariable.woff2",
  variable: "--font-inter",
  display: "swap",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "Invest on the company website. Keep it in your Wallet.",
    template: "%s · Farkas Capital",
  },
  description:
    "A white-label capital-raising platform: investment checkout and a private investor dashboard on the issuer's own website, an issuer dashboard worth using, and a branded Apple or Google Wallet pass for every investment.",
  applicationName: "Farkas Capital Platform Demo",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-paper text-ink">
        {children}
        <DemoDock />
      </body>
    </html>
  );
}

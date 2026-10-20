import Link from "next/link";
import { FloatingNav } from "@/components/marketing/FloatingNav";
import { LumenLogo } from "@/components/brand/LumenMark";
import { Button } from "@/components/ui/Button";
import { FarkasMark } from "@/components/brand/FarkasMark";

/** The issuer's own website chrome. Lumen is the brand throughout. */
export function LumenNav({ dark = false }: { dark?: boolean }) {
  return (
    <FloatingNav
      dark={dark}
      brand={
        <Link href="/lumen" aria-label="Lumen Robotics home">
          <LumenLogo size={26} dark={dark} />
        </Link>
      }
      links={[
        { href: "/lumen#product", label: "Product" },
        { href: "/lumen#customers", label: "Customers" },
        { href: "/lumen#company", label: "Company" },
        { href: "/lumen/investors", label: "Investors" },
      ]}
      cta={
        <Button href="/lumen/invest" size="sm" variant="brand">
          Invest
        </Button>
      }
    />
  );
}

export function LumenFooter() {
  return (
    <footer className="border-t border-line-2 bg-canvas">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div>
            <LumenLogo size={24} />
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-ink-3">Autonomous fulfilment for the mid-market warehouse. Austin, Texas.</p>
          </div>
          <FooterCol title="Product" links={[["Fleet", "/lumen#product"], ["Perception", "/lumen#product"], ["Deployment", "/lumen#product"]]} />
          <FooterCol title="Company" links={[["About", "/lumen#company"], ["Customers", "/lumen#customers"], ["Careers", "/lumen#company"]]} />
          <FooterCol title="Investors" links={[["Invest", "/lumen/invest"], ["Investor dashboard", "/lumen/investors"], ["Support", "mailto:investors@lumenrobotics.com"]]} />
        </div>
        <div className="mt-12 flex flex-col gap-5 border-t border-line-2 pt-8 text-[12px] leading-relaxed text-ink-4 md:flex-row md:items-start md:gap-10">
          <div className="flex shrink-0 items-center gap-2.5">
            <FarkasMark size={26} />
            <span className="text-ink-3">Securities offered through Farkas Capital, a registered broker-dealer.</span>
          </div>
          <p className="max-w-3xl">
            This offering is made under Rule 506(c) of Regulation D to verified accredited investors only. Investing in private companies involves a high degree of risk, including the possible loss of your entire investment. Past performance does not guarantee future results. Read the Private Placement Memorandum and Risk Factors before investing. Required broker-dealer identification and disclosures remain where counsel requires them; this text is a placeholder subject to counsel approval. FINRA Rule 2210.
          </p>
        </div>
        <div className="mt-6 text-[12px] text-ink-4">© 2026 Lumen Robotics, Inc.</div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-3">{title}</div>
      <ul className="mt-3 space-y-2 text-[14px]">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link href={href} className="text-ink-2 hover:text-ink">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

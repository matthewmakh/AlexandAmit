import { LumenNav, LumenFooter } from "@/components/lumen/LumenChrome";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { Button, TextLink } from "@/components/ui/Button";
import { Reveal, Stagger, StaggerItem } from "@/components/marketing/Reveal";
import { Eyebrow } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { LumenMark } from "@/components/brand/LumenMark";

/**
 * The issuer's existing company website, with the "Invest" entry point the
 * platform adds. Everything here is Lumen's brand; the platform is invisible.
 */
export default function LumenHome() {
  return (
    <main className="bg-paper">
      <LumenNav />

      {/* Hero */}
      <section className="relative overflow-hidden bg-aurora">
        <div className="mx-auto max-w-6xl px-5 pb-16 pt-36 sm:pt-44">
          <Reveal>
            <Eyebrow tone="lumen">Lumen Robotics</Eyebrow>
            <h1 className="text-display-xl mt-4 max-w-4xl text-balance">Fulfilment that installs in weeks, not quarters.</h1>
            <p className="text-lede mt-6 max-w-2xl text-ink-3">Fleet-managed picking robots for mid-market distributors. Forty-one facilities run Lumen today, at 99.1% fleet uptime.</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button href="/lumen/invest" size="lg" variant="brand">
                Invest in Lumen
              </Button>
              <TextLink href="/lumen#product">
                See the fleet
              </TextLink>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.15} className="mx-auto max-w-6xl px-5 pb-20">
          <ImageSlot
            tone="light"
            aspect="21/9"
            label="Hero: Lumen picking robot on a warehouse floor"
            brief="Wide cinematic shot of a single robot gliding between racking, soft overhead light, shallow depth of field. Blue accent lights on the robot. Feels like an Apple product film still."
          />
        </Reveal>
      </section>

      {/* Stats */}
      <section className="bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <Stagger className="grid gap-6 sm:grid-cols-3">
            {[
              ["41", "live facilities", "across 14 states"],
              ["612", "robots in the field", "fleet-managed from Austin"],
              ["99.1%", "fleet uptime", "trailing twelve months"],
            ].map(([n, l, h]) => (
              <StaggerItem key={l} className="card-tint p-8">
                <div className="text-display-lg text-lumen tabular">{n}</div>
                <div className="mt-2 text-[17px] font-semibold">{l}</div>
                <div className="text-[14px] text-ink-3">{h}</div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Product */}
      <section id="product" className="bg-canvas">
        <div className="mx-auto max-w-6xl px-5 py-24">
          <Reveal>
            <Eyebrow tone="lumen">Product</Eyebrow>
            <h2 className="text-display-md mt-3 max-w-2xl text-balance">One fleet. Three jobs. Zero new infrastructure.</h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { t: "Pick", d: "Collaborative picking that follows the order, not the aisle. Two to three times the lines per labour hour.", img: "Product: robot picking alongside an associate", brief: "Associate and robot at a pick face, eye-level, natural light. Robot tote half full." },
              { t: "Move", d: "Autonomous tote transport between zones, with no floor tape and no fixed conveyors.", img: "Product: robots moving totes through a cross-aisle", brief: "Three robots in a line crossing a wide aisle, motion blur on the far one, clean floor." },
              { t: "Manage", d: "Fleet software that learns each site and rebalances the fleet by the hour.", img: "Product: fleet management dashboard on a laptop", brief: "Over-the-shoulder shot of a laptop showing a fleet map with blue dots; warehouse out of focus behind." },
            ].map((c, i) => (
              <Reveal key={c.t} delay={i * 0.08}>
                <div className="card overflow-hidden p-0">
                  <ImageSlot label={c.img} brief={c.brief} aspect="4/3" rounded="rounded-none" />
                  <div className="p-7">
                    <div className="flex items-center gap-2 text-[17px] font-semibold">
                      <LumenMark size={18} color="var(--color-lumen)" /> {c.t}
                    </div>
                    <p className="mt-2 text-[15px] leading-relaxed text-ink-3">{c.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Customers */}
      <section id="customers" className="bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-24">
          <Reveal className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <Eyebrow tone="lumen">Customers</Eyebrow>
              <h2 className="text-display-md mt-3 text-balance">Live in Dallas three weeks early.</h2>
              <p className="text-lede mt-5 text-ink-3">A regional beverage distributor replaced a conveyor retrofit with a Lumen fleet and runs two shifts on it today.</p>
              <ul className="mt-6 space-y-3 text-[15px]">
                {["Deployed in 19 days", "2.4× lines per labour hour", "No change to racking or WMS"].map((x) => (
                  <li key={x} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-lumen-soft text-lumen">
                      <Icon name="check" size={14} />
                    </span>
                    {x}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex items-center gap-6 text-[13px] text-ink-4">
                {["Customer logo 1", "Customer logo 2", "Customer logo 3", "Customer logo 4"].map((l) => (
                  <ImageSlot key={l} label={l} aspect="3/1" className="w-28" rounded="rounded-lg" />
                ))}
              </div>
            </div>
            <ImageSlot label="Customer story: Dallas distribution centre at dusk" brief="Exterior-to-interior, warm evening light through dock doors, robots visible inside. Documentary feel." aspect="4/5" />
          </Reveal>
        </div>
      </section>

      {/* Company */}
      <section id="company" className="bg-canvas">
        <div className="mx-auto max-w-6xl px-5 py-24">
          <Reveal className="grid items-center gap-12 lg:grid-cols-2">
            <ImageSlot label="Company: founders in the Austin lab" brief="Two founders beside a half-assembled robot on a bench, candid, black and white or muted colour." aspect="4/3" />
            <div>
              <Eyebrow tone="lumen">Company</Eyebrow>
              <h2 className="text-display-md mt-3 text-balance">Built in Austin since 2021.</h2>
              <p className="text-lede mt-5 text-ink-3">Lumen was founded by two warehouse-automation engineers who kept watching mid-market operators get priced out of robotics. The fleet is designed, assembled and supported from one building in East Austin.</p>
              <TextLink href="/lumen/invest" className="mt-6">
                Read the offering
              </TextLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Invest band */}
      <section className="bg-lumen-gradient text-white">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <Reveal className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div>
              <Eyebrow tone="white">Series A direct offering</Eyebrow>
              <h2 className="text-display-md mt-3 text-balance">Own a piece of Lumen. Keep it in your Wallet.</h2>
              <p className="mt-4 max-w-xl text-[17px] text-white/75">Verified accredited investors can invest directly on this site, sign and pay in minutes, and carry a branded pass for each investment in Apple Wallet or Google Wallet.</p>
            </div>
            <Button href="/lumen/invest" size="lg" variant="white" className="shrink-0">
              Invest in Lumen <Icon name="arrow-right" size={18} />
            </Button>
          </Reveal>
        </div>
      </section>

      <LumenFooter />
    </main>
  );
}

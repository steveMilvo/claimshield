import Link from "next/link";
import { ShieldMark } from "@/components/Logo";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <HowItWorks />
      <MagicMoment />
      <Categories />
      <Pricing />
      <FAQ />
      <CTA />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 dotted-grid opacity-50" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-5 pt-16 pb-20 md:pt-24 md:pb-28 grid md:grid-cols-12 gap-10 items-center">
        <div className="md:col-span-7">
          <span className="inline-flex items-center gap-2 rounded-full bg-shield-50 text-shield-700 text-xs font-medium px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-shield-500" />
            New · AI-powered insurance claim negotiator
          </span>
          <h1 className="mt-5 text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
            Your insurer just said no.
            <br />
            <span className="text-shield-600">We say try again.</span>
          </h1>
          <p className="mt-5 text-lg text-ink-muted max-w-xl">
            ClaimShield reads your policy, picks apart the denial, and writes
            you an expert-level appeal in 60 seconds — so you keep the dollars
            you&apos;re owed.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/start"
              className="inline-flex items-center rounded-full bg-shield-600 text-white font-medium px-5 py-3 hover:bg-shield-700 transition"
            >
              Fight my claim — free analysis
            </Link>
            <Link
              href="/#how"
              className="inline-flex items-center rounded-full bg-white border border-black/10 font-medium px-5 py-3 hover:border-black/30 transition"
            >
              See how it works
            </Link>
          </div>
          <div className="mt-7 flex items-center gap-4 text-sm text-ink-muted">
            <Stars />
            <span>AU, US and UK policies supported.</span>
          </div>
        </div>

        <div className="md:col-span-5">
          <HeroCard />
        </div>
      </div>
    </section>
  );
}

function Stars() {
  return (
    <div className="flex items-center gap-1 text-shield-600">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-4 w-4 fill-current">
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9 4.8 17.6l1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

function HeroCard() {
  return (
    <div className="relative rounded-2xl bg-white shadow-card border border-black/5 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-medium text-ink-muted">
          <ShieldMark className="h-5 w-5" />
          ClaimShield Analysis
        </div>
        <span className="text-xs rounded-full bg-accent/10 text-accent-dark px-2 py-0.5">
          Strong case
        </span>
      </div>

      <div className="mt-4 rounded-xl shield-gradient text-white p-4">
        <div className="text-xs/5 opacity-80">Recoverable upside</div>
        <div className="mt-1 text-3xl font-semibold tracking-tight">
          + $5,300
        </div>
        <div className="text-xs opacity-80">
          Insurer offered $2,100 on a $7,400 claim
        </div>
      </div>

      <ul className="mt-4 space-y-2 text-sm">
        <li className="flex gap-2">
          <Check />
          <span>
            Exclusion <span className="font-medium">2.4(b)</span> misapplied —
            event is covered under endorsement E-12.
          </span>
        </li>
        <li className="flex gap-2">
          <Check />
          <span>
            Settlement breaches <span className="font-medium">GICOP §8.7</span>{" "}
            — fair-value obligation.
          </span>
        </li>
        <li className="flex gap-2">
          <Check />
          <span>
            Appeal letter + AFCA complaint generated &amp; ready to send.
          </span>
        </li>
      </ul>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-shield-50 text-shield-700 text-xs font-medium px-3 py-2 text-center">
          ClaimShield Score 86
        </div>
        <div className="rounded-lg bg-canvas text-ink-soft text-xs font-medium px-3 py-2 text-center">
          ~60 seconds
        </div>
      </div>
    </div>
  );
}

function Check() {
  return (
    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent-dark">
      <svg viewBox="0 0 20 20" className="h-3 w-3 fill-current">
        <path d="M7.6 13.2L4.4 10l-1.1 1.1 4.3 4.3 9.1-9.1-1.1-1.1z" />
      </svg>
    </span>
  );
}

function TrustBar() {
  const items = [
    "Personal & business cover",
    "AU, US & UK supported",
    "Regulator-ready complaint",
    "No lawyer required",
    "Pay only if you win more",
  ];
  return (
    <section className="border-y border-black/5 bg-white/60">
      <div className="mx-auto max-w-6xl px-5 py-4 flex flex-wrap items-center gap-x-8 gap-y-2 text-sm text-ink-muted">
        {items.map((t) => (
          <span key={t} className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-shield-500" />
            {t}
          </span>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Upload your policy",
      body:
        "PDF, photo, or insurer portal. We parse 40–80 page policies and turn them into plain English.",
    },
    {
      n: "02",
      title: "Add the denial or offer",
      body:
        "Drop in the letter and a few details. We cross-reference clauses, exclusions, and the rules your insurer must follow.",
    },
    {
      n: "03",
      title: "Send the response",
      body:
        "Get a formal appeal, demand letter and AFCA-ready complaint — with step-by-step guidance on what to send, when, and to whom.",
    },
  ];
  return (
    <section id="how" className="mx-auto max-w-6xl px-5 py-20">
      <SectionHeader
        eyebrow="How it works"
        title="From denial to dollars in three steps"
        body="Insurers have analysts and lawyers. You have ClaimShield — the same firepower, instantly, without hiring anyone."
      />
      <div className="mt-10 grid md:grid-cols-3 gap-5">
        {steps.map((s) => (
          <div
            key={s.n}
            className="rounded-2xl bg-white border border-black/5 shadow-card p-6"
          >
            <div className="text-xs font-mono text-shield-600">{s.n}</div>
            <div className="mt-2 text-lg font-semibold">{s.title}</div>
            <p className="mt-2 text-ink-muted text-sm leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function MagicMoment() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <div className="rounded-3xl shield-gradient text-white p-8 md:p-12 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 h-60 w-60 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -left-10 -bottom-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="relative grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="text-shield-100 text-sm">The magic moment</div>
            <h3 className="mt-2 text-3xl md:text-4xl font-semibold leading-tight">
              You were about to accept $2,100 on a $7,400 claim.
            </h3>
            <p className="mt-3 text-shield-100 max-w-md">
              ClaimShield highlights the exact clause your insurer is
              misapplying, names the regulation they&apos;re ignoring, and
              hands you a letter that makes them blink.
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 border border-white/15 p-5 backdrop-blur">
            <div className="text-xs text-shield-100">Excerpt — your appeal</div>
            <p className="mt-2 text-sm leading-relaxed">
              &ldquo;The denial relies on exclusion 2.4(b), which by its own
              terms applies only to deliberate acts. Endorsement E-12,
              incorporated at policy issuance, explicitly extends cover to
              accidental water damage of the kind documented in my claim. The
              offer of $2,100 also fails the fair-settlement obligation under
              GICOP §8.7 in light of the three independent repair estimates
              attached…&rdquo;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Categories() {
  const personal = [
    { name: "Auto / Motor", value: "$1,500 – $8,000" },
    { name: "Home / Property", value: "$3,000 – $25,000" },
    { name: "Renters", value: "$500 – $5,000" },
    { name: "Travel", value: "$200 – $3,000" },
    { name: "Health / Medical", value: "$500 – $15,000" },
    { name: "Pet", value: "$500 – $5,000" },
  ];
  const commercial = [
    { name: "Business / Commercial", value: "$5,000 – $100,000+" },
    { name: "Restaurant / hospitality", value: "$5,000 – $250,000" },
    { name: "Food truck / food business", value: "$2,000 – $50,000" },
    { name: "Builder / Construction", value: "$10,000 – $500,000" },
    { name: "Tradies / contractors", value: "$2,000 – $80,000" },
    { name: "Public liability", value: "$5,000 – $1,000,000" },
    { name: "Professional indemnity", value: "$5,000 – $500,000" },
    { name: "Workers compensation", value: "$5,000 – $250,000" },
    { name: "Commercial property", value: "$10,000 – $1,000,000" },
    { name: "Commercial motor / fleet", value: "$3,000 – $150,000" },
    { name: "Business interruption", value: "$10,000 – $500,000" },
    { name: "Cyber liability", value: "$10,000 – $1,000,000" },
    { name: "Farm / agricultural", value: "$5,000 – $500,000" },
    { name: "Marine / cargo", value: "$5,000 – $250,000" },
  ];
  return (
    <section className="mx-auto max-w-6xl px-5 py-20">
      <SectionHeader
        eyebrow="Coverage"
        title="The categories where most dollars get lost"
        body="Personal and business / commercial cover, across AU, US and UK — pick your jurisdiction when you start."
      />

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <CoverageList title="Personal lines" rows={personal} />
        <CoverageList title="Business / Commercial" rows={commercial} />
      </div>
    </section>
  );
}

function CoverageList({
  title,
  rows,
}: {
  title: string;
  rows: { name: string; value: string }[];
}) {
  return (
    <div className="rounded-2xl bg-white border border-black/5 shadow-card overflow-hidden">
      <div className="bg-canvas px-5 py-3 flex items-center justify-between">
        <div className="text-sm font-medium">{title}</div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 text-accent-dark px-2 py-0.5 text-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Live
        </span>
      </div>
      <table className="w-full text-sm">
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className="border-t border-black/5">
              <td className="px-5 py-2.5 font-medium">{r.name}</td>
              <td className="px-5 py-2.5 text-ink-muted text-right whitespace-nowrap">{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Pricing() {
  const tiers = [
    {
      name: "Policy Review",
      price: "$29",
      tag: "No claim required",
      bullets: [
        "Full policy parsed to plain English",
        "Inclusions, exclusions, sub-limits",
        "Jurisdiction-specific notes",
      ],
    },
    {
      name: "Claim Analysis",
      price: "$79",
      tag: "Most popular",
      featured: true,
      bullets: [
        "Everything in Policy Review",
        "Denial / offer analysis",
        "Appeal letter generated",
        "Step-by-step guidance",
      ],
    },
    {
      name: "Premium Defence",
      price: "$149",
      tag: "Full escalation",
      bullets: [
        "Everything in Claim Analysis",
        "Regulator complaint filed (AFCA / DOI / FOS)",
        "30 days follow-up guidance",
        "Escalation playbook",
      ],
    },
  ];
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-5 py-20">
      <SectionHeader
        eyebrow="Pricing"
        title="Flat fees. Or pay only when you win more."
        body="Choose a tier — or opt into success pricing: 15% of the extra recovery, capped. No win, no fee."
      />
      <div className="mt-10 grid md:grid-cols-3 gap-5">
        {tiers.map((t) => (
          <div
            key={t.name}
            className={
              "rounded-2xl border p-6 shadow-card " +
              (t.featured
                ? "bg-ink text-white border-ink"
                : "bg-white border-black/5")
            }
          >
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">{t.name}</div>
              <span
                className={
                  "text-xs rounded-full px-2 py-0.5 " +
                  (t.featured
                    ? "bg-white/15 text-white"
                    : "bg-shield-50 text-shield-700")
                }
              >
                {t.tag}
              </span>
            </div>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-semibold tracking-tight">{t.price}</span>
              <span className={t.featured ? "text-white/60 text-sm" : "text-ink-muted text-sm"}>
                AUD
              </span>
            </div>
            <ul className={"mt-5 space-y-2 text-sm " + (t.featured ? "text-white/80" : "text-ink-muted")}>
              {t.bullets.map((b) => (
                <li key={b} className="flex gap-2">
                  <span
                    className={
                      "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full " +
                      (t.featured ? "bg-white/15" : "bg-accent/15 text-accent-dark")
                    }
                  >
                    <svg viewBox="0 0 20 20" className="h-3 w-3 fill-current">
                      <path d="M7.6 13.2L4.4 10l-1.1 1.1 4.3 4.3 9.1-9.1-1.1-1.1z" />
                    </svg>
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/start"
              className={
                "mt-6 inline-flex w-full items-center justify-center rounded-full px-4 py-2.5 font-medium transition " +
                (t.featured
                  ? "bg-white text-ink hover:bg-shield-50"
                  : "bg-shield-600 text-white hover:bg-shield-700")
              }
            >
              Start with {t.name}
            </Link>
          </div>
        ))}
      </div>
      <p className="mt-6 text-xs text-ink-muted">
        ClaimShield provides information and document preparation. We are not a
        law firm and do not provide legal advice.
      </p>
    </section>
  );
}

function FAQ() {
  const qs = [
    {
      q: "Is this legal advice?",
      a: "No. ClaimShield is an information and document preparation tool. We translate your policy, analyse the insurer's reasoning, and prepare templates you can send. For complex matters we'll flag when a licensed professional makes sense.",
    },
    {
      q: "What does it do with my documents?",
      a: "Policies and claim letters are processed in memory. We don't persist raw documents on our servers. Only anonymised outcomes feed back into the system intelligence.",
    },
    {
      q: "Which countries do you cover?",
      a: "Australia (AFCA), the United States (state Departments of Insurance) and the United Kingdom (Financial Ombudsman Service) — pick the jurisdiction when you start a claim. We're adding more.",
    },
    {
      q: "Do you cover business / commercial policies?",
      a: "Yes — ClaimShield works for business and commercial claims as well as personal lines. That includes hospitality, restaurants and food trucks, builders and tradies, public liability, professional indemnity, workers compensation, commercial property and motor, business interruption, cyber, farm and marine. Pick the category that fits when you start your claim.",
    },
    {
      q: "What's the ClaimShield Score?",
      a: "A 0–100 strength-of-position rating based on policy fit, regulatory leverage, and comparable outcomes. Higher score = stronger appeal.",
    },
  ];
  return (
    <section id="faq" className="mx-auto max-w-6xl px-5 py-20">
      <SectionHeader eyebrow="FAQ" title="Quick answers" />
      <div className="mt-8 grid md:grid-cols-2 gap-5">
        {qs.map((x) => (
          <div key={x.q} className="rounded-2xl bg-white border border-black/5 shadow-card p-6">
            <div className="font-medium">{x.q}</div>
            <p className="mt-2 text-sm text-ink-muted leading-relaxed">{x.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-20">
      <div className="rounded-3xl bg-ink text-white p-10 md:p-14 text-center relative overflow-hidden">
        <div className="absolute inset-0 dotted-grid opacity-20" />
        <div className="relative">
          <h3 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Don&apos;t leave thousands on the table.
          </h3>
          <p className="mt-3 text-white/70 max-w-xl mx-auto">
            Run a free analysis on your denial or settlement offer. If we can
            help you recover more, you&apos;ll see the number before you pay.
          </p>
          <Link
            href="/start"
            className="mt-6 inline-flex items-center rounded-full bg-white text-ink font-medium px-5 py-3 hover:bg-shield-50 transition"
          >
            Start free analysis →
          </Link>
        </div>
      </div>
    </section>
  );
}

function SectionHeader({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body?: string;
}) {
  return (
    <div className="max-w-2xl">
      <div className="text-xs uppercase tracking-[0.18em] text-shield-600 font-semibold">
        {eyebrow}
      </div>
      <h2 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight">
        {title}
      </h2>
      {body && <p className="mt-3 text-ink-muted">{body}</p>}
    </div>
  );
}

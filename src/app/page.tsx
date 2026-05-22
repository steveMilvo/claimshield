import Link from "next/link";
import { BlueprintMark } from "@/components/Logo";

export default function HomePage() {
  return (
    <>
      <DisclaimerBanner />
      <Hero />
      <TrustBar />
      <Problem />
      <HowItWorks />
      <ReportSections />
      <WhoIsItFor />
      <FAQ />
      <CTA />
    </>
  );
}

function DisclaimerBanner() {
  return (
    <div className="bg-gold-50 border-b border-gold-200 text-center px-5 py-2 text-xs text-gold-700">
      <strong>General information only.</strong> Reports are designed to be reviewed by a registered tax agent — not acted on alone.{" "}
      <Link href="/legal" className="underline hover:text-gold-900">Read full disclaimer.</Link>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 dotted-grid opacity-40" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-5 pt-16 pb-20 md:pt-24 md:pb-28 grid md:grid-cols-12 gap-10 items-center">
        <div className="md:col-span-7">
          <span className="inline-flex items-center gap-2 rounded-full bg-blueprint-50 text-blueprint-700 text-xs font-medium px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-blueprint-500" />
            Updated for the 2026–27 Federal Budget · Australian structures only
          </span>
          <h1 className="mt-5 text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
            Structure your business right —
            <br />
            <span className="text-blueprint-600">before it costs you.</span>
          </h1>
          <p className="mt-5 text-lg text-ink-muted max-w-xl">
            Founder Tax Blueprint analyses every Australian business structure
            against your specific circumstances and exit plan — so you don&rsquo;t
            lock in the wrong decisions at day zero.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/start"
              className="inline-flex items-center rounded-full bg-blueprint-600 text-white font-medium px-5 py-3 hover:bg-blueprint-700 transition"
            >
              Start free Blueprint →
            </Link>
            <Link
              href="/#how"
              className="inline-flex items-center rounded-full bg-white border border-black/10 font-medium px-5 py-3 hover:border-black/30 transition"
            >
              See how it works
            </Link>
          </div>
          <p className="mt-5 text-xs text-ink-muted">
            Takes ~5 minutes · General information only · Designed to be reviewed with your accountant
          </p>
        </div>

        <div className="md:col-span-5">
          <HeroCard />
        </div>
      </div>
    </section>
  );
}

function HeroCard() {
  return (
    <div className="relative rounded-2xl bg-white shadow-card border border-black/5 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-medium text-ink-muted">
          <BlueprintMark className="h-5 w-5" />
          Blueprint Analysis
        </div>
        <span className="text-xs rounded-full bg-blueprint-50 text-blueprint-700 px-2 py-0.5 font-medium">
          HoldCo/OpCo recommended
        </span>
      </div>

      <div className="rounded-xl blueprint-gradient text-white p-4">
        <div className="text-xs/5 opacity-80">Estimated CGT saving at exit</div>
        <div className="mt-1 text-3xl font-semibold tracking-tight">$280K+</div>
        <div className="text-xs opacity-80">
          $10M exit · wrong structure vs right structure
        </div>
      </div>

      <ul className="space-y-2 text-sm">
        <li className="flex gap-2">
          <GoldCheck />
          <span>
            IP assigned to <span className="font-medium">HoldCo before OpCo has value</span> —
            protected from trading liabilities.
          </span>
        </li>
        <li className="flex gap-2">
          <GoldCheck />
          <span>
            <span className="font-medium">Division 152</span> small business concessions: eligible — up to $500K retirement exemption.
          </span>
        </li>
        <li className="flex gap-2">
          <GoldCheck />
          <span>
            <span className="font-medium">Singapore holding structure</span> viable if raising international VC — modelled in report.
          </span>
        </li>
      </ul>

      <div className="grid grid-cols-3 gap-2 text-xs font-medium text-center">
        <div className="rounded-lg bg-canvas text-ink-soft px-2 py-2">8 structures</div>
        <div className="rounded-lg bg-canvas text-ink-soft px-2 py-2">3 exit scenarios</div>
        <div className="rounded-lg bg-canvas text-ink-soft px-2 py-2">18–28 pages</div>
      </div>
    </div>
  );
}

function GoldCheck() {
  return (
    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-600">
      <svg viewBox="0 0 20 20" className="h-3 w-3 fill-current">
        <path d="M7.6 13.2L4.4 10l-1.1 1.1 4.3 4.3 9.1-9.1-1.1-1.1z" />
      </svg>
    </span>
  );
}

function TrustBar() {
  const items = [
    "All Australian domestic structures",
    "International holding structures (SG, US, UK, HK)",
    "Division 152 CGT concessions",
    "2026–27 Budget changes modelled",
    "Exit strategy tax modelling",
    "Accountant-ready brief included",
  ];
  return (
    <section className="border-y border-black/5 bg-white/60">
      <div className="mx-auto max-w-6xl px-5 py-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-ink-muted">
        {items.map((t) => (
          <span key={t} className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
            {t}
          </span>
        ))}
      </div>
    </section>
  );
}

function Problem() {
  const decisions = [
    {
      title: "IP in the wrong entity",
      body: "IP assigned to a sole trader or the wrong company cannot be retrospectively transferred at nil value once it has commercial worth. The window closes the moment you make your first invoice.",
      tag: "Irreversible",
    },
    {
      title: "Trust chosen without understanding the 2027 changes",
      body: "From 1 July 2027, a 30% minimum CGT rate applies to trust capital gain distributions — eliminating the strategy of distributing gains to low-bracket beneficiaries. The trust advantage on exit is materially reduced.",
      tag: "High impact",
    },
    {
      title: "No holding company before the business has value",
      body: "A Singapore flip or HoldCo restructure after your OpCo has real value triggers CGT for all shareholders. The cost can be $50,000–$200,000 in legal and tax fees. It must happen at day zero.",
      tag: "Costly to fix",
    },
  ];
  return (
    <section className="mx-auto max-w-6xl px-5 py-20">
      <SectionHeader
        eyebrow="The problem"
        title="120,000+ founders get this wrong every year"
        body="Australia has some of the most complex structuring decisions in the world — and most founders make them without any modelling."
      />
      <div className="mt-10 grid md:grid-cols-3 gap-5">
        {decisions.map((d) => (
          <div key={d.title} className="rounded-2xl bg-white border border-black/5 shadow-card p-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-danger/10 text-danger text-xs font-medium px-2.5 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-danger" />
              {d.tag}
            </span>
            <h3 className="mt-3 font-semibold leading-snug">{d.title}</h3>
            <p className="mt-2 text-sm text-ink-muted leading-relaxed">{d.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Answer the questionnaire",
      body: "Six sections, ~30 questions. Your circumstances, business type, revenue projections, capital plans, exit strategy, and preferences. Takes about 5 minutes.",
    },
    {
      n: "02",
      title: "The engine models your scenarios",
      body: "A codified tax rule engine runs every relevant structure against your inputs — income tax, CGT, Division 152, DTA rates, and the 2026–27 Budget changes. No free-form AI guesswork on the numbers.",
    },
    {
      n: "03",
      title: "Get your personalised report",
      body: "An 18–28 page structured report: structure comparison matrix, exit tax modelling, irreversibility map, action checklist, and a one-page brief ready to hand to your accountant.",
    },
  ];
  return (
    <section id="how" className="mx-auto max-w-6xl px-5 py-20">
      <SectionHeader
        eyebrow="How it works"
        title="From questionnaire to report in minutes"
        body="The AI handles narrative and scenario analysis. A codified rule engine handles all the numbers — so they&rsquo;re accurate."
      />
      <div className="mt-10 grid md:grid-cols-3 gap-5">
        {steps.map((s) => (
          <div key={s.n} className="rounded-2xl bg-white border border-black/5 shadow-card p-6">
            <div className="text-xs font-mono text-blueprint-600">{s.n}</div>
            <div className="mt-2 text-lg font-semibold">{s.title}</div>
            <p className="mt-2 text-ink-muted text-sm leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ReportSections() {
  const sections = [
    { title: "Your Situation Summary", body: "Plain-English recap of all inputs, confirming your context before any analysis." },
    { title: "Structure Comparison Matrix", body: "All relevant structures scored side-by-side across tax efficiency, asset protection, capital raising, compliance cost, and exit flexibility." },
    { title: "Exit Tax Modelling", body: "CGT outcome under each structure, including Division 152 eligibility, indexation calculation, and the new 30% minimum rate impact." },
    { title: "International Analysis", body: "Where relevant: Singapore, Delaware, UK, HK, NZ, and Ireland structures with CFC analysis, substance requirements, and DTA implications." },
    { title: "The Irreversibility Map", body: "Colour-coded: green (reversible), amber (costly to change), red (irreversible once acted on). So you know what must be decided now." },
    { title: "2026–27 Budget Impact", body: "Specific impact of the new CGT indexation regime, 30% minimum rate, and individual tax cuts on your modelled scenarios." },
    { title: "Action Checklist", body: "Time-sequenced: before registration, within 30 days, within 90 days, and what can wait." },
    { title: "Accountant Brief", body: "One page. Key inputs, structures to discuss, and specific questions for your registered tax agent — ready to hand over." },
  ];
  return (
    <section id="report" className="mx-auto max-w-6xl px-5 py-20">
      <SectionHeader
        eyebrow="The report"
        title="Eight sections covering every dimension"
        body="Not a one-paragraph summary — a comprehensive scenario document designed to work alongside your accountant."
      />
      <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {sections.map((s, i) => (
          <div key={s.title} className="rounded-2xl bg-white border border-black/5 shadow-card p-5">
            <div className="text-[10px] font-mono text-blueprint-600 mb-2">§{String(i + 1).padStart(2, "0")}</div>
            <div className="font-semibold text-sm leading-snug">{s.title}</div>
            <p className="mt-1.5 text-xs text-ink-muted leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function WhoIsItFor() {
  const personas = [
    {
      title: "Pre-ABN founders",
      body: "You haven't registered yet. This is the exact moment the report is designed for. Every decision is still open.",
    },
    {
      title: "Early-stage founders (pre-revenue)",
      body: "You're registered but haven't invoiced yet. IP assignment, trust setup, and HoldCo decisions can still be made at negligible cost.",
    },
    {
      title: "Founders raising capital",
      body: "About to take angel or VC money? The structure you raise into determines your tax position on exit — and whether investors will even invest.",
    },
    {
      title: "Accountants and tax agents",
      body: "Use the Practice Edition as a client-intake and modelling tool. Generates branded reports under your firm's name.",
    },
  ];
  return (
    <section className="mx-auto max-w-6xl px-5 py-20">
      <SectionHeader
        eyebrow="Who it's for"
        title="Built for the decision point"
        body="The moment before the first ABN, the first invoice, or the first shareholder round."
      />
      <div className="mt-10 grid md:grid-cols-2 gap-5">
        {personas.map((p) => (
          <div key={p.title} className="rounded-2xl bg-white border border-black/5 shadow-card p-6 flex gap-4">
            <span className="mt-1 h-2 w-2 rounded-full bg-gold-400 shrink-0" />
            <div>
              <div className="font-semibold">{p.title}</div>
              <p className="mt-1.5 text-sm text-ink-muted">{p.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FAQ() {
  const qs = [
    {
      q: "Is this tax advice?",
      a: "No. Founder Tax Blueprint generates general information only — not personal tax advice, financial advice, or a tax agent service under TASA 2009. Reports are designed to be used by a registered tax agent, or handed to your accountant for professional review before you act.",
    },
    {
      q: "How accurate are the numbers?",
      a: "Tax calculations use a codified rule engine with hard-coded ATO rates, thresholds, and concessions — not AI-generated figures. The AI generates the narrative and scenario analysis. Numbers are based on your self-reported inputs and may not reflect your full circumstances.",
    },
    {
      q: "Why does the 2026–27 Budget matter so much?",
      a: "From 1 July 2027, the CGT 50% discount is replaced with indexation and a 30% minimum rate applies. This fundamentally changes the calculus for trust structures and short-hold assets. Any report generated before modelling these changes is already out of date.",
    },
    {
      q: "I already have a structure — is it too late?",
      a: "Many decisions are still open. The Irreversibility Map in the report shows exactly what can still be changed and at what cost. The report also flags which decisions must be made urgently.",
    },
    {
      q: "What is the Practice Edition?",
      a: "A B2B white-label version for accounting firms. Generates reports branded to your firm, with your registration number and PI details. Includes a client intake portal and unlimited reports. Coming soon — contact us to register interest.",
    },
    {
      q: "What about SMSF and ESS?",
      a: "The report flags SMSF investment and ESS/ESOP opportunities where relevant, and notes which structures are compatible. Detailed SMSF and ESS modelling requires specialist advice and is noted as such in the report.",
    },
  ];
  return (
    <section id="faq" className="mx-auto max-w-6xl px-5 py-20">
      <SectionHeader eyebrow="FAQ" title="Common questions" />
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
      <div className="rounded-3xl blueprint-gradient text-white p-10 md:p-14 text-center relative overflow-hidden">
        <div className="absolute -right-10 -top-10 h-60 w-60 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -left-10 -bottom-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="relative">
          <h3 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Get your Blueprint before you register.
          </h3>
          <p className="mt-3 text-white/70 max-w-xl mx-auto">
            Answer six sections. Get a report that covers every viable structure,
            models your exit, and gives your accountant exactly what they need.
          </p>
          <Link
            href="/start"
            className="mt-6 inline-flex items-center rounded-full bg-white text-ink font-medium px-6 py-3 hover:bg-gold-50 transition"
          >
            Start free Blueprint →
          </Link>
          <p className="mt-4 text-xs text-white/50">
            General information only. Always obtain advice from a registered tax agent before acting.
          </p>
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
      <div className="text-xs uppercase tracking-[0.18em] text-blueprint-600 font-semibold">
        {eyebrow}
      </div>
      <h2 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight">
        {title}
      </h2>
      {body && <p className="mt-3 text-ink-muted">{body}</p>}
    </div>
  );
}

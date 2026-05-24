import Link from "next/link";
import { BlueprintMark } from "@/components/Logo";

export default function HomePage({
  searchParams,
}: {
  searchParams?: { practice?: string; consult?: string };
}) {
  const practiceState = searchParams?.practice;
  const consultState = searchParams?.consult;
  return (
    <>
      <DisclaimerBanner />
      <Hero />
      <TrustBar />
      <Problem />
      <HowItWorks />
      <ReportSections />
      <SamplePreview />
      <Testimonials />
      <WhoIsItFor />
      <Pricing consultState={consultState} />
      <AccountantInterest practiceState={practiceState} />
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
            Most founders lose <span className="text-blueprint-600">$280K+ on exit</span> because they got the structure wrong on day one.
          </h1>
          <p className="mt-5 text-lg text-ink-muted max-w-xl">
            Fix it in 5 minutes — before you register the ABN.
            Founder Tax Blueprint analyses every Australian business structure
            against your circumstances and exit plan, so you don&rsquo;t lock in
            decisions you can&rsquo;t reverse.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/start"
              className="inline-flex items-center rounded-full bg-blueprint-600 text-white font-medium px-5 py-3 hover:bg-blueprint-700 transition"
            >
              Start free Blueprint →
            </Link>
            <a
              href="/sample-blueprint.pdf"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 rounded-full bg-white border border-black/10 font-medium px-5 py-3 hover:border-black/30 transition"
            >
              <DownloadIcon />
              Download sample report
            </a>
          </div>
          <p className="mt-3 text-xs text-ink-muted">
            <Link href="/#how" className="hover:text-ink underline-offset-2 hover:underline">See how it works</Link>
            <span className="mx-2 text-ink-muted/40">·</span>
            <span>Sample is a real report — generated for a SaaS founder raising US VC</span>
          </p>
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

function DownloadIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current text-blueprint-600" aria-hidden>
      <path d="M10 2a1 1 0 0 1 1 1v7.59l2.3-2.3a1 1 0 1 1 1.4 1.42l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.42L9 10.6V3a1 1 0 0 1 1-1zm-6 13a1 1 0 0 1 1 1v1h10v-1a1 1 0 1 1 2 0v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1z" />
    </svg>
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
        title="The wrong structure costs tens of thousands"
        body="Of the 1.2 million+ new business registrations in Australia each year, an estimated 120,000–180,000 are growth ventures. Most pick the wrong structure — not from ignorance, but because the right answer depends on 30+ variables they haven&rsquo;t thought through yet."
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

      <div className="mt-8 rounded-2xl border border-gold-200 bg-gold-50 px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="font-semibold text-sm text-ink">See what a real Blueprint looks like</div>
          <p className="mt-1 text-xs text-ink-muted">
            8-page sample · SaaS founder, 2 co-founders, raising US VC, $10–$50M target exit.
          </p>
        </div>
        <a
          href="/sample-blueprint.pdf"
          target="_blank"
          rel="noopener"
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white border border-black/10 px-4 py-2.5 text-sm font-medium hover:border-black/30 transition"
        >
          <DownloadIcon />
          Download sample (PDF)
        </a>
      </div>
    </section>
  );
}

function SamplePreview() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20">
      <SectionHeader
        eyebrow="Sample report"
        title="See exactly what you get"
        body="A real 8-page Blueprint generated for a SaaS founder with two co-founders raising US VC capital, targeting a $10–$50M exit."
      />
      <div className="mt-10 grid md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-7 rounded-2xl bg-white border border-black/5 shadow-card overflow-hidden">
          <a href="/sample-blueprint.pdf" target="_blank" rel="noopener" className="block group">
            <img
              src="/sample-blueprint-preview.png"
              alt="Sample Founder Tax Blueprint report — cover page and structure analysis"
              className="w-full h-auto block group-hover:opacity-95 transition"
            />
          </a>
        </div>
        <div className="md:col-span-5">
          <ul className="space-y-4 text-sm">
            <li className="flex gap-3">
              <GoldCheck />
              <div>
                <div className="font-medium">Real numbers, not vibes</div>
                <div className="text-ink-muted text-xs mt-0.5">
                  Year 1 and Year 3 tax modelled for every relevant structure using a codified rule engine, not free-form AI.
                </div>
              </div>
            </li>
            <li className="flex gap-3">
              <GoldCheck />
              <div>
                <div className="font-medium">Division 152 eligibility on the cover</div>
                <div className="text-ink-muted text-xs mt-0.5">
                  No hunting through the report — you see your CGT concession status front and centre.
                </div>
              </div>
            </li>
            <li className="flex gap-3">
              <GoldCheck />
              <div>
                <div className="font-medium">Accountant brief, ready to forward</div>
                <div className="text-ink-muted text-xs mt-0.5">
                  One-page summary that turns a $500 intake call into a $500 advice call.
                </div>
              </div>
            </li>
          </ul>
          <a
            href="/sample-blueprint.pdf"
            target="_blank"
            rel="noopener"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-blueprint-600 text-white text-sm font-medium px-5 py-2.5 hover:bg-blueprint-700 transition"
          >
            <DownloadIcon />
            Open sample (PDF)
          </a>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const quotes = [
    {
      quote:
        "This is the report I wish I'd had three years ago. Two pages in I could see exactly where I'd left $40K of CGT concession on the table.",
      author: "Sarah K.",
      role: "SaaS founder, Sydney",
    },
    {
      quote:
        "Handed it straight to my accountant. She said it saved her 90 minutes of intake — we got to the structure conversation immediately.",
      author: "Daniel M.",
      role: "Pre-seed AgTech, Melbourne",
    },
    {
      quote:
        "The irreversibility map alone is worth it. The 2027 CGT changes are the thing nobody is talking about and the report puts them front and centre.",
      author: "J. Park",
      role: "Solo founder, Brisbane",
    },
  ];
  return (
    <section className="mx-auto max-w-6xl px-5 py-20">
      <SectionHeader eyebrow="Early access" title="What founders are saying" />
      <div className="mt-10 grid md:grid-cols-3 gap-5">
        {quotes.map((q) => (
          <figure key={q.author} className="rounded-2xl bg-white border border-black/5 shadow-card p-6 flex flex-col">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-blueprint-500 mb-3" fill="currentColor" aria-hidden>
              <path d="M9.4 17.7c0-3.6 2-6.4 5.4-7.8l1 1.7c-2.2 1-3.6 2.4-3.6 4.2 0 .8.3 1.4.8 1.9.6.5 1.3.8 2 .8.5 0 1-.2 1.5-.5l.4 1.5c-.9.5-1.9.7-3 .7-1.4 0-2.5-.5-3.4-1.4-.8-.9-1.1-2-1.1-3.1zM2 17.7c0-3.6 2-6.4 5.4-7.8l1 1.7c-2.2 1-3.6 2.4-3.6 4.2 0 .8.3 1.4.8 1.9.6.5 1.3.8 2 .8.5 0 1-.2 1.5-.5l.4 1.5c-.9.5-1.9.7-3 .7-1.4 0-2.5-.5-3.4-1.4C2.4 19.9 2 18.8 2 17.7z" />
            </svg>
            <blockquote className="text-sm text-ink-soft leading-relaxed flex-1">
              &ldquo;{q.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-4 pt-4 border-t border-black/5 text-xs">
              <div className="font-semibold text-ink">{q.author}</div>
              <div className="text-ink-muted">{q.role} · early access</div>
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="mt-4 text-[11px] text-ink-muted text-center">
        Early-access feedback from beta users. Names anonymised at request.
      </p>
    </section>
  );
}

function AccountantInterest({ practiceState }: { practiceState?: string }) {
  return (
    <section id="practice" className="mx-auto max-w-6xl px-5 py-20">
      <div className="rounded-3xl bg-white border border-black/5 shadow-card p-8 md:p-12 grid md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-7">
          <div className="text-xs uppercase tracking-[0.18em] text-gold-600 font-semibold">
            For Accountants & Tax Agents
          </div>
          <h3 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">
            Practice Edition — coming soon
          </h3>
          <p className="mt-3 text-ink-muted text-sm">
            White-label the Blueprint under your firm&rsquo;s name. Use it as a client intake tool, scenario modeller, and pre-meeting brief generator. Unlimited reports, your branding, your PI details, your registration number.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-ink-muted">
            <li className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold-400 shrink-0" />Branded report covers and footers</li>
            <li className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold-400 shrink-0" />Client intake portal with shareable links</li>
            <li className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold-400 shrink-0" />Unlimited reports + API access</li>
            <li className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold-400 shrink-0" />Cross-sells from D2C user base to your firm</li>
          </ul>
        </div>
        <div className="md:col-span-5">
          <AccountantInterestForm state={practiceState} />
        </div>
      </div>
    </section>
  );
}

function AccountantInterestForm({ state }: { state?: string }) {
  if (state === "registered") {
    return (
      <div className="rounded-2xl bg-blueprint-50 border border-blueprint-100 p-6 text-center">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blueprint-600 text-white mb-3">
          <svg viewBox="0 0 20 20" className="h-5 w-5 fill-current">
            <path d="M7.6 13.2L4.4 10l-1.1 1.1 4.3 4.3 9.1-9.1-1.1-1.1z" />
          </svg>
        </div>
        <div className="font-semibold text-sm">You&rsquo;re on the list</div>
        <p className="mt-1 text-xs text-ink-muted">
          We&rsquo;ll email you when Practice Edition opens — typically within 30 days.
        </p>
      </div>
    );
  }
  return (
    <form
      className="rounded-2xl bg-blueprint-50 border border-blueprint-100 p-5"
      action="/api/accountant-interest"
      method="POST"
    >
      <div className="text-xs font-semibold text-blueprint-700 mb-3">Register interest</div>
      <div className="space-y-2.5">
        <input
          name="firm"
          required
          placeholder="Firm name"
          className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-blueprint-500 focus:ring-2 focus:ring-blueprint-500/15"
        />
        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-blueprint-500 focus:ring-2 focus:ring-blueprint-500/15"
        />
        <input
          name="tpb"
          placeholder="TPB registration number (optional)"
          className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-blueprint-500 focus:ring-2 focus:ring-blueprint-500/15"
        />
      </div>
      <button
        type="submit"
        className="mt-4 w-full inline-flex items-center justify-center rounded-full bg-blueprint-600 text-white text-sm font-medium px-4 py-2.5 hover:bg-blueprint-700 transition"
      >
        Notify me at launch →
      </button>
      <p className="mt-3 text-[10px] text-ink-muted leading-relaxed">
        We&rsquo;ll email you when Practice Edition is ready. No spam.
      </p>
    </form>
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

function Pricing({ consultState }: { consultState?: string }) {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-5 py-20">
      <SectionHeader
        eyebrow="Pricing"
        title="Pick your level of certainty."
        body="Start with the free preview to see the engine works on your situation. Upgrade for the full report, or add a 30-minute call with a matched registered tax agent."
      />
      <div className="mt-10 grid md:grid-cols-3 gap-5">
        {/* Free */}
        <div className="rounded-2xl bg-white border border-black/10 shadow-card p-6 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Free Preview</div>
            <span className="text-xs rounded-full bg-canvas text-ink-muted px-2 py-0.5">No card</span>
          </div>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-4xl font-semibold tracking-tight">$0</span>
            <span className="text-ink-muted text-sm">AUD</span>
          </div>
          <p className="mt-2 text-xs text-ink-muted">Designed to prove the engine works on your specific situation.</p>
          <ul className="mt-5 space-y-2 text-sm text-ink-muted flex-1">
            <li className="flex gap-2"><BulletCheck /><span>Personalised situation summary (1 paragraph)</span></li>
            <li className="flex gap-2"><BulletCheck /><span>Structure matrix preview (2 of 8 structures scored)</span></li>
            <li className="flex gap-2"><BulletCheck /><span>Primary exit type identified</span></li>
            <li className="flex gap-2"><BulletCheck /><span>Most urgent irreversible decision flagged</span></li>
          </ul>
          <Link
            href="/start"
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-white border border-blueprint-500 text-blueprint-700 font-medium px-4 py-2.5 hover:bg-blueprint-50 transition text-sm"
          >
            Start free preview →
          </Link>
        </div>

        {/* Full Blueprint */}
        <div className="rounded-2xl bg-ink text-white border border-ink shadow-card p-6 flex flex-col relative overflow-hidden md:-my-3">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold-400/20 blur-3xl" aria-hidden />
          <div className="relative flex flex-col h-full">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Full Blueprint</div>
              <span className="text-xs rounded-full bg-gold-400/20 text-gold-300 px-2 py-0.5 font-medium">Most popular</span>
            </div>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-semibold tracking-tight">$249</span>
              <span className="text-white/50 text-sm">AUD · one-time</span>
            </div>
            <p className="mt-2 text-xs text-white/60">Everything in Free, plus:</p>
            <ul className="mt-5 space-y-2 text-sm text-white/80 flex-1">
              <li className="flex gap-2"><BulletCheckGold /><span>Full situation summary (4 paragraphs)</span></li>
              <li className="flex gap-2"><BulletCheckGold /><span>All 8+ structures scored with detailed notes</span></li>
              <li className="flex gap-2"><BulletCheckGold /><span>Primary &amp; secondary recommendations</span></li>
              <li className="flex gap-2"><BulletCheckGold /><span>Full exit narrative — Div 152, after-tax proceeds, post-2027 impact</span></li>
              <li className="flex gap-2"><BulletCheckGold /><span>Complete irreversibility map (time-sequenced)</span></li>
              <li className="flex gap-2"><BulletCheckGold /><span>Action checklist + Budget impact</span></li>
              <li className="flex gap-2"><BulletCheckGold /><span>International structure analysis</span></li>
              <li className="flex gap-2"><BulletCheckGold /><span>Accountant Brief — ready to hand over</span></li>
            </ul>
            <Link
              href="/start"
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-gold-500 text-ink font-semibold px-4 py-2.5 hover:bg-gold-400 transition text-sm"
            >
              Start &amp; unlock full report →
            </Link>
            <p className="mt-3 text-[10px] text-white/40 text-center">
              Stripe checkout · 100% money-back if it doesn&rsquo;t apply
            </p>
          </div>
        </div>

        {/* Blueprint + Consult */}
        <div className="rounded-2xl bg-white border border-black/10 shadow-card p-6 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Blueprint + Consult</div>
            <span className="text-xs rounded-full bg-gold-100 text-gold-700 px-2 py-0.5 font-medium">Coming soon</span>
          </div>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-4xl font-semibold tracking-tight">$599</span>
            <span className="text-ink-muted text-sm">AUD · one-time</span>
          </div>
          <p className="mt-2 text-xs text-ink-muted">When you want a human to verify before you act.</p>
          <ul className="mt-5 space-y-2 text-sm text-ink-muted flex-1">
            <li className="flex gap-2"><BulletCheck /><span>Everything in Full Blueprint</span></li>
            <li className="flex gap-2"><BulletCheck /><span>Matched intro to a TPB-registered tax agent</span></li>
            <li className="flex gap-2"><BulletCheck /><span>30-minute strategy call with that agent</span></li>
            <li className="flex gap-2"><BulletCheck /><span>Agent reviews your Blueprint pre-call</span></li>
            <li className="flex gap-2"><BulletCheck /><span>Written follow-up with recommendations</span></li>
          </ul>
          <ConsultInterestForm state={consultState} />
        </div>
      </div>
      <p className="mt-6 text-xs text-ink-muted text-center">
        For accounting firms — <Link href="#practice" className="text-blueprint-600 hover:underline">Practice Edition $199/mo</Link> with branded reports + intake portal.
      </p>
    </section>
  );
}

function ConsultInterestForm({ state }: { state?: string }) {
  if (state === "registered") {
    return (
      <div className="mt-6 rounded-xl bg-blueprint-50 border border-blueprint-100 p-4 text-center">
        <div className="font-semibold text-sm text-blueprint-800">You&rsquo;re on the list</div>
        <p className="mt-1 text-xs text-ink-muted">We&rsquo;ll email you when Consult opens.</p>
      </div>
    );
  }
  return (
    <form action="/api/consult-interest" method="POST" className="mt-6 space-y-2">
      <input
        name="firstName"
        placeholder="First name (optional)"
        className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-xs outline-none focus:border-blueprint-500 focus:ring-2 focus:ring-blueprint-500/15"
      />
      <input
        name="email"
        type="email"
        required
        placeholder="Email"
        className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-xs outline-none focus:border-blueprint-500 focus:ring-2 focus:ring-blueprint-500/15"
      />
      <button
        type="submit"
        className="w-full inline-flex items-center justify-center rounded-full bg-ink text-white font-medium px-4 py-2.5 hover:bg-ink-soft transition text-sm"
      >
        Notify me at launch →
      </button>
    </form>
  );
}

function BulletCheck() {
  return (
    <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blueprint-100 text-blueprint-600">
      <svg viewBox="0 0 20 20" className="h-2.5 w-2.5 fill-current">
        <path d="M7.6 13.2L4.4 10l-1.1 1.1 4.3 4.3 9.1-9.1-1.1-1.1z" />
      </svg>
    </span>
  );
}

function BulletCheckGold() {
  return (
    <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gold-400/20 text-gold-300">
      <svg viewBox="0 0 20 20" className="h-2.5 w-2.5 fill-current">
        <path d="M7.6 13.2L4.4 10l-1.1 1.1 4.3 4.3 9.1-9.1-1.1-1.1z" />
      </svg>
    </span>
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

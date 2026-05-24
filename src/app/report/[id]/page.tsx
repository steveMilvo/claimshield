"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getReport, StoredReport, StructureMatrixRow, IrreversibilityItem, Lead } from "@/lib/reportStore";
import { BlueprintMark } from "@/components/Logo";
import { cn } from "@/lib/cn";

function buildUpgradeMailto(lead?: Lead): string {
  const subject = encodeURIComponent("Full Founder Tax Blueprint — request");
  const greeting = lead?.firstName
    ? `Hi, this is ${lead.firstName}${lead.lastName ? ` ${lead.lastName}` : ""} (${lead.email}).`
    : "Hi,";
  const body = encodeURIComponent(
    `${greeting}\n\nI generated a free preview Blueprint and I'd like the full version — including the complete structure matrix, exit narrative, action checklist, international analysis, and accountant brief.\n\nThanks.`
  );
  return `mailto:info@milvotech.com?subject=${subject}&body=${body}`;
}

export default function ReportPage() {
  const { id } = useParams<{ id: string }>();
  const [stored, setStored] = useState<StoredReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const r = getReport(id);
    setStored(r);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner />
      </div>
    );
  }

  if (!stored) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 text-center">
        <h2 className="text-2xl font-semibold">Report not found</h2>
        <p className="mt-2 text-ink-muted">This report may have expired or was opened in a different browser.</p>
        <Link href="/start" className="mt-6 inline-flex rounded-full bg-blueprint-600 text-white px-5 py-3 text-sm font-medium hover:bg-blueprint-700">
          Generate a new Blueprint
        </Link>
      </div>
    );
  }

  const { report, generatedAt, tier, lead } = stored;
  const isFree = tier !== "paid";
  const date = new Date(generatedAt).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });
  const upgradeMailto = buildUpgradeMailto(lead);

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      {/* Cover */}
      <div className="rounded-3xl blueprint-gradient text-white p-8 md:p-12 mb-8 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 h-60 w-60 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <BlueprintMark className="h-8 w-8" />
            <div>
              <div className="text-sm font-semibold">Founder Tax Blueprint</div>
              <div className="text-xs text-white/60">A SynthexIQ product · MilvoTech Pty Ltd</div>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight">
            Your Tax Structure Blueprint
          </h1>
          <p className="mt-2 text-white/70 text-sm">Generated {date}</p>
          <div className="mt-6 rounded-xl bg-white/10 border border-white/15 px-5 py-4 text-xs text-white/80 leading-relaxed">
            <strong className="text-white">GENERAL INFORMATION ONLY.</strong> This report does not constitute personal tax advice or a tax agent service under the Tax Agent Services Act 2009 (Cth). MilvoTech Pty Ltd is not a registered tax agent. This report is designed to be provided to a qualified, TPB-registered tax agent for professional review before any action is taken.
          </div>
        </div>
      </div>

      {/* Free preview banner */}
      {isFree && (
        <div className="mb-8 rounded-2xl border-2 border-dashed border-gold-300 bg-gold-50 p-5 flex flex-col md:flex-row md:items-center gap-4 md:justify-between">
          <div className="flex items-start gap-3">
            <LockIcon className="h-5 w-5 text-gold-600 mt-0.5 shrink-0" />
            <div>
              <div className="font-semibold text-sm text-gold-800">
                You&rsquo;re viewing the free preview
              </div>
              <p className="mt-0.5 text-xs text-gold-700 leading-relaxed">
                The full Blueprint includes the complete structure matrix, exit narrative,
                irreversibility map, budget impact, action checklist, international analysis, and accountant brief.
              </p>
            </div>
          </div>
          <a
            href={upgradeMailto}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-gold-600 text-white text-sm font-medium px-4 py-2.5 hover:bg-gold-700 transition"
          >
            Get the full Blueprint →
          </a>
        </div>
      )}

      {/* Quick nav */}
      <div className="flex flex-wrap gap-2 mb-8 text-xs font-medium">
        {[
          { href: "#summary", label: "Situation Summary", locked: false },
          { href: "#structures", label: "Structure Matrix", locked: false },
          { href: "#exit", label: "Exit Analysis", locked: false },
          { href: "#irreversibility", label: "Irreversibility Map", locked: false },
          { href: "#budget", label: "Budget Impact", locked: isFree },
          { href: "#checklist", label: "Action Checklist", locked: isFree },
          { href: "#accountant", label: "Accountant Brief", locked: isFree },
        ].map((n) => (
          <a
            key={n.href}
            href={n.href}
            className={cn(
              "rounded-full border px-3 py-1.5 transition inline-flex items-center gap-1.5",
              n.locked
                ? "border-gold-200 bg-gold-50/40 text-gold-700 hover:border-gold-400"
                : "border-black/10 bg-white text-ink-muted hover:border-blueprint-500 hover:text-blueprint-700"
            )}
          >
            {n.locked && <LockIcon className="h-3 w-3" />}
            {n.label}
          </a>
        ))}
      </div>

      {/* 1. Situation Summary */}
      <Section id="summary" number="01" title="Your Situation Summary">
        <div className="prose prose-sm max-w-none text-ink-muted leading-relaxed">
          {report.situationSummary?.split("\n\n").map((p, i) => (
            <p key={i} className="mb-4">{p}</p>
          ))}
        </div>
      </Section>

      {/* 2. Recommended Structures */}
      {report.recommendedStructures?.length > 0 && (
        <Section id="structures" number="02" title="Structure Scenarios Modelled">
          <div className="space-y-3 mb-6">
            {(isFree
              ? report.recommendedStructures.filter((s) => s.priority === "primary").slice(0, 1)
              : report.recommendedStructures
            ).map((s) => (
              <div
                key={s.name}
                className={cn(
                  "rounded-xl border p-4 flex gap-3 items-start",
                  s.priority === "primary" && "border-blueprint-300 bg-blueprint-50",
                  s.priority === "secondary" && "border-black/10 bg-white",
                  s.priority === "consider" && "border-black/8 bg-canvas",
                  s.priority === "avoid" && "border-danger/20 bg-danger/5",
                )}
              >
                <PriorityBadge priority={s.priority} />
                <div>
                  <div className="font-semibold text-sm">{s.name}</div>
                  <p className="mt-1 text-xs text-ink-muted leading-relaxed">{s.reason}</p>
                </div>
              </div>
            ))}
            {isFree && report.recommendedStructures.length > 1 && (
              <InlineLockNote
                text={`${report.recommendedStructures.length - 1} more recommendations including secondary, consider, and avoid scenarios`}
                upgradeUrl={upgradeMailto}
              />
            )}
          </div>

          {/* Matrix */}
          {report.structureMatrix?.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-canvas">
                    <th className="text-left px-3 py-2.5 font-medium text-ink-muted border border-black/8">Structure</th>
                    <th className="px-3 py-2.5 font-medium text-ink-muted border border-black/8">Tax Efficiency</th>
                    <th className="px-3 py-2.5 font-medium text-ink-muted border border-black/8">Asset Protection</th>
                    <th className="px-3 py-2.5 font-medium text-ink-muted border border-black/8">Capital Raising</th>
                    <th className="px-3 py-2.5 font-medium text-ink-muted border border-black/8">Compliance Cost</th>
                    <th className="px-3 py-2.5 font-medium text-ink-muted border border-black/8">Exit Flexibility</th>
                    <th className="px-3 py-2.5 font-medium text-ink-muted border border-black/8">Verdict</th>
                  </tr>
                </thead>
                <tbody>
                  {(isFree ? report.structureMatrix.slice(0, 2) : report.structureMatrix).map((row: StructureMatrixRow) => (
                    <tr key={row.structure} className="border-b border-black/5 hover:bg-canvas/60">
                      <td className="px-3 py-3 font-medium border border-black/8">{row.structure}</td>
                      <td className="px-3 py-3 text-center border border-black/8"><Dots score={row.taxEfficiency} /></td>
                      <td className="px-3 py-3 text-center border border-black/8"><Dots score={row.assetProtection} /></td>
                      <td className="px-3 py-3 text-center border border-black/8"><Dots score={row.capitalRaising} /></td>
                      <td className="px-3 py-3 text-center border border-black/8"><Dots score={row.complianceCost} /></td>
                      <td className="px-3 py-3 text-center border border-black/8"><Dots score={row.exitFlexibility} /></td>
                      <td className="px-3 py-3 border border-black/8">
                        <RelevanceBadge relevance={row.relevance} />
                      </td>
                    </tr>
                  ))}
                  {isFree && report.structureMatrix.length > 2 && (
                    <tr>
                      <td colSpan={7} className="px-3 py-3 border border-gold-200 bg-gold-50 text-center text-xs font-medium text-gold-700">
                        <span className="inline-flex items-center gap-1.5">
                          <LockIcon className="h-3 w-3" />
                          {report.structureMatrix.length - 2} more structures scored in the full report
                        </span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Structure notes (paid only) */}
          {!isFree && report.structureMatrix?.length > 0 && (
            <div className="mt-4 space-y-2">
              {report.structureMatrix.map((row: StructureMatrixRow) => row.notes && (
                <details key={row.structure} className="rounded-lg border border-black/8 bg-white">
                  <summary className="px-4 py-2.5 text-xs font-medium text-ink-soft cursor-pointer hover:text-ink">
                    {row.structure} — detailed notes
                  </summary>
                  <div className="px-4 pb-3 text-xs text-ink-muted leading-relaxed">{row.notes}</div>
                </details>
              ))}
            </div>
          )}
          {isFree && (
            <div className="mt-4">
              <UpgradeInline label="Unlock detailed notes for every structure" upgradeUrl={upgradeMailto} />
            </div>
          )}
        </Section>
      )}

      {/* 3. Exit Analysis */}
      {report.exitAnalysis && (
        <Section id="exit" number="03" title="Exit Strategy Tax Modelling">
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <InfoCard label="Primary exit type" value={report.exitAnalysis.primaryExitType} />
            <InfoCard label="Division 152 eligibility" value={report.exitAnalysis.div152Eligible} highlight={report.exitAnalysis.div152Eligible?.startsWith("eligible")} />
            <InfoCard label="Est. tax before concessions" value={report.exitAnalysis.preConcessionsTax} />
            <InfoCard label="Est. after-tax proceeds" value={report.exitAnalysis.estimatedAfterTaxProceeds} highlight />
          </div>

          {isFree ? (
            <LockedTeaser
              title="Detailed exit narrative + post-2027 impact"
              detail="The full report includes a 3–4 paragraph exit analysis covering CGT implications, Division 152 stacking, post-2027 indexation impact, and a list of key risks to your specific exit strategy."
              upgradeUrl={upgradeMailto}
            />
          ) : (
            <>
              {report.exitAnalysis.narrative && (
                <div className="prose prose-sm max-w-none text-ink-muted leading-relaxed mb-4">
                  {report.exitAnalysis.narrative?.split("\n\n").map((p: string, i: number) => (
                    <p key={i} className="mb-4">{p}</p>
                  ))}
                </div>
              )}

              {report.exitAnalysis.postBudget2027Impact && (
                <div className="rounded-xl border border-gold-200 bg-gold-50 p-4">
                  <div className="text-xs font-semibold text-gold-700 mb-1">2026–27 Budget Impact on Your Exit</div>
                  <p className="text-xs text-gold-800 leading-relaxed">{report.exitAnalysis.postBudget2027Impact}</p>
                </div>
              )}

              {report.exitAnalysis.keyRisks?.length > 0 && (
                <div className="mt-4">
                  <div className="text-xs font-semibold text-ink-soft mb-2">Key risks to your exit strategy</div>
                  <ul className="space-y-1">
                    {report.exitAnalysis.keyRisks.map((risk: string, i: number) => (
                      <li key={i} className="flex gap-2 text-xs text-ink-muted">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-danger shrink-0" />
                        {risk}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </Section>
      )}

      {/* 4. Irreversibility Map */}
      {report.irreversibilityMap?.length > 0 && (
        <Section id="irreversibility" number="04" title="The Irreversibility Map">
          <p className="text-sm text-ink-muted mb-4">
            Colour-coded: <span className="text-green-700 font-medium">green</span> (easily changed), <span className="text-amber-700 font-medium">amber</span> (costly to change), <span className="text-danger font-medium">red</span> (effectively irreversible once acted on).
          </p>
          <div className="space-y-2">
            {(isFree ? report.irreversibilityMap.slice(0, 2) : report.irreversibilityMap).map((item: IrreversibilityItem, i: number) => (
              <div
                key={i}
                className={cn(
                  "rounded-xl border p-4 flex gap-4 items-start",
                  item.reversibility === "green" && "border-green-200 bg-green-50",
                  item.reversibility === "amber" && "border-amber-200 bg-amber-50",
                  item.reversibility === "red" && "border-danger/20 bg-danger/5",
                )}
              >
                <div
                  className={cn(
                    "mt-0.5 h-3 w-3 rounded-full shrink-0",
                    item.reversibility === "green" && "bg-green-500",
                    item.reversibility === "amber" && "bg-amber-500",
                    item.reversibility === "red" && "bg-danger",
                  )}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold">{item.decision}</div>
                  <p className="mt-0.5 text-xs text-ink-muted leading-relaxed">{item.detail}</p>
                  {item.timing && (
                    <div className="mt-1.5 text-[11px] text-ink-muted">
                      <span className="font-medium">Timing:</span> {item.timing}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isFree && report.irreversibilityMap.length > 2 && (
              <InlineLockNote
                text={`${report.irreversibilityMap.length - 2} more irreversible decisions mapped — including IP timing, HoldCo establishment, offshore structures, and equity grants`}
                upgradeUrl={upgradeMailto}
              />
            )}
          </div>
        </Section>
      )}

      {/* 5. Budget Impact */}
      {report.budgetImpact?.length > 0 && (
        <Section id="budget" number="05" title="2026–27 Budget Impact Analysis" locked={isFree}>
          {isFree ? (
            <LockedTeaser
              title={`${report.budgetImpact.length} budget changes assessed for your specific situation`}
              detail="The full report breaks down each 2026–27 Budget change (CGT indexation, 30% minimum rate, individual tax cuts, start-up offset, loss carry-back, instant write-off) and explains the specific dollar impact on your scenarios."
              upgradeUrl={upgradeMailto}
            />
          ) : (
            <div className="space-y-3">
              {report.budgetImpact.map((item: { change: string; impactOnYou: string; level: "high" | "medium" | "low" }, i: number) => (
                <div key={i} className="rounded-xl border border-black/8 bg-white p-4 flex gap-4 items-start">
                  <span className={cn(
                    "mt-0.5 text-[10px] font-bold rounded px-1.5 py-0.5 shrink-0",
                    item.level === "high" && "bg-danger/10 text-danger",
                    item.level === "medium" && "bg-gold-100 text-gold-700",
                    item.level === "low" && "bg-canvas text-ink-muted",
                  )}>
                    {item.level.toUpperCase()}
                  </span>
                  <div>
                    <div className="text-sm font-semibold">{item.change}</div>
                    <p className="mt-1 text-xs text-ink-muted leading-relaxed">{item.impactOnYou}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>
      )}

      {/* 6. Action Checklist */}
      {report.actionChecklist && (
        <Section id="checklist" number="06" title="Action Checklist" locked={isFree}>
          {isFree ? (
            <LockedTeaser
              title="Time-sequenced action checklist"
              detail="The full report gives you a complete checklist: actions to take before you register an ABN, within 30 days, within 90 days, and what can wait. Specific to your structure, your IP, and your capital raising plans."
              upgradeUrl={upgradeMailto}
            />
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { label: "Before you register", items: report.actionChecklist.beforeRegistration, urgent: true },
                { label: "Within 30 days", items: report.actionChecklist.within30Days, urgent: true },
                { label: "Within 90 days", items: report.actionChecklist.within90Days, urgent: false },
                { label: "Can wait — but don't forget", items: report.actionChecklist.canWait, urgent: false },
              ].map(({ label, items, urgent }) =>
                items?.length > 0 ? (
                  <div
                    key={label}
                    className={cn(
                      "rounded-xl border p-4",
                      urgent ? "border-blueprint-200 bg-blueprint-50/60" : "border-black/8 bg-white"
                    )}
                  >
                    <div className="text-xs font-semibold text-ink-soft mb-2">{label}</div>
                    <ul className="space-y-1.5">
                      {items.map((action: string, i: number) => (
                        <li key={i} className="flex gap-2 text-xs text-ink-muted">
                          <span className={cn(
                            "mt-1 h-1.5 w-1.5 rounded-full shrink-0",
                            urgent ? "bg-blueprint-500" : "bg-black/20"
                          )} />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null
              )}
            </div>
          )}
        </Section>
      )}

      {/* 7. International Analysis */}
      {report.internationalAnalysis && (
        <Section id="international" number="07" title="International Structure Analysis" locked={isFree}>
          {isFree ? (
            <LockedTeaser
              title="International holding structure analysis"
              detail="The full report covers the most relevant offshore options for your situation (Singapore, Delaware, UK, Hong Kong, NZ, Ireland) — CFC analysis, substance requirements, DTA implications, and the critical timing of each."
              upgradeUrl={upgradeMailto}
            />
          ) : (
            <>
              <div className="rounded-xl border border-gold-200 bg-gold-50 p-4 mb-4">
                <p className="text-xs text-gold-800 font-medium">
                  International structures require genuine commercial substance and specialist advice with international tax expertise. CFC rules, transfer pricing, and Part IVA apply. Never act on international structuring without specialist professional review.
                </p>
              </div>
              <div className="prose prose-sm max-w-none text-ink-muted leading-relaxed">
                {report.internationalAnalysis?.split("\n\n").map((p: string, i: number) => (
                  <p key={i} className="mb-4">{p}</p>
                ))}
              </div>
            </>
          )}
        </Section>
      )}

      {/* 8. Key Risks */}
      {report.keyRisks?.length > 0 && (
        <Section id="risks" number="08" title="Key Risks to Monitor" locked={isFree}>
          {isFree ? (
            <LockedTeaser
              title={`${report.keyRisks.length} risks identified for your specific circumstances`}
              detail="The full report enumerates the specific risks your structure choice creates — Division 7A traps, transfer pricing exposure, Part IVA, substance failures, and more."
              upgradeUrl={upgradeMailto}
            />
          ) : (
            <ul className="space-y-2">
              {report.keyRisks.map((risk: string, i: number) => (
                <li key={i} className="flex gap-3 items-start text-sm">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-danger shrink-0" />
                  <span className="text-ink-muted">{risk}</span>
                </li>
              ))}
            </ul>
          )}
        </Section>
      )}

      {/* 9. Accountant Brief */}
      {report.accountantBrief && (
        <Section id="accountant" number="09" title="Accountant Brief" locked={isFree}>
          {isFree ? (
            <LockedTeaser
              title="One-page brief ready to hand to your registered tax agent"
              detail="The full report includes a professionally-formatted Accountant Brief: client overview, key inputs, structures to model, specific questions for the agent, and areas of uncertainty. Designed to save your accountant 60–90 minutes of intake and get you to the actual advice conversation faster."
              upgradeUrl={upgradeMailto}
              accent="blueprint"
            />
          ) : (
            <div className="rounded-xl border-2 border-dashed border-blueprint-200 bg-blueprint-50/40 p-6">
              <div className="flex items-center gap-2 mb-4">
                <BlueprintMark className="h-5 w-5" />
                <span className="text-xs font-semibold text-blueprint-700">
                  DESIGNED TO BE HANDED DIRECTLY TO YOUR REGISTERED TAX AGENT
                </span>
              </div>
              <div className="prose prose-sm max-w-none text-ink leading-relaxed">
                {report.accountantBrief?.split("\n\n").map((p: string, i: number) => (
                  <p key={i} className="mb-3 text-sm">{p}</p>
                ))}
              </div>
            </div>
          )}
        </Section>
      )}

      {/* Full disclaimer */}
      <div className="rounded-2xl border border-black/8 bg-white p-6 mt-6 text-xs text-ink-muted leading-relaxed space-y-3">
        <div className="font-semibold text-ink-soft">DISCLAIMER — GENERAL INFORMATION ONLY</div>
        <p>This report has been generated by Founder Tax Blueprint, a product of MilvoTech Pty Ltd. This report constitutes general information only and does not constitute personal financial advice, tax advice, or a tax agent service within the meaning of the Tax Agent Services Act 2009 (Cth). MilvoTech Pty Ltd is not a registered tax agent and does not provide tax agent services.</p>
        <p>INTENDED USE: This report is designed to be used by registered tax agents as a professional scenario modelling and client-intake tool, or to be provided by the end user to a qualified, Tax Practitioners Board (TPB) registered tax agent or accountant for professional review, interpretation, and personalised advice. No action should be taken based solely on the contents of this report.</p>
        <p>NO RELIANCE: The scenarios, calculations, and analysis in this report are based on general tax rules, the user&apos;s self-reported inputs, and current legislation as at the date of generation. They do not account for the user&apos;s full financial circumstances, may not reflect recent legislative changes, and may contain simplifications that affect accuracy. Tax law is complex and subject to interpretation by the ATO and courts.</p>
        <p>LIMITATION OF LIABILITY: To the maximum extent permitted by law, MilvoTech Pty Ltd, its directors, employees, and agents disclaim all liability for any loss, damage, or expense arising from the use of or reliance on this report.</p>
        <p className="text-[10px]">Generated: {date} · Founder Tax Blueprint v1.0 · MilvoTech Pty Ltd · A SynthexIQ Ecosystem product</p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mt-6">
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-ink hover:border-black/30 transition"
        >
          Print / Save as PDF
        </button>
        <Link
          href="/start"
          className="inline-flex items-center gap-2 rounded-full bg-blueprint-600 text-white px-4 py-2 text-sm font-medium hover:bg-blueprint-700 transition"
        >
          Generate another Blueprint
        </Link>
      </div>

      <p className="mt-4 text-xs text-ink-muted">
        Save this page URL to return to your report.{" "}
        <span className="font-mono bg-canvas px-1.5 py-0.5 rounded text-[11px]">{typeof window !== "undefined" ? window.location.href : ""}</span>
      </p>
    </div>
  );
}

function Section({
  id,
  number,
  title,
  children,
  locked,
}: {
  id: string;
  number: string;
  title: string;
  children: React.ReactNode;
  locked?: boolean;
}) {
  return (
    <section id={id} className="mb-8 rounded-2xl bg-white border border-black/5 shadow-card overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-black/5">
        <span className="text-xs font-mono text-blueprint-600">{number}</span>
        <h2 className="font-semibold flex-1">{title}</h2>
        {locked && (
          <span className="inline-flex items-center gap-1 rounded-full bg-gold-100 text-gold-700 text-[10px] font-bold px-2 py-1">
            <LockIcon className="h-2.5 w-2.5" />
            FULL REPORT
          </span>
        )}
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

function InfoCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={cn(
      "rounded-xl border p-4",
      highlight ? "border-blueprint-200 bg-blueprint-50" : "border-black/8 bg-canvas"
    )}>
      <div className="text-[11px] uppercase tracking-wider text-ink-muted font-medium">{label}</div>
      <div className={cn("mt-1 text-sm font-semibold leading-snug", highlight && "text-blueprint-800")}>{value}</div>
    </div>
  );
}

function Dots({ score }: { score: number | string | null | undefined }) {
  const raw = typeof score === "number" ? score : typeof score === "string" ? parseInt(score, 10) : NaN;
  const valid = Number.isFinite(raw) && raw >= 1 && raw <= 5;

  if (!valid) {
    return <span className="text-ink-muted/60 text-xs">—</span>;
  }

  return (
    <div className="flex gap-0.5 justify-center items-center">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={cn(
            "h-2 w-2 rounded-full",
            i <= raw ? "bg-blueprint-500" : "bg-black/20"
          )}
        />
      ))}
    </div>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const map: Record<string, { label: string; className: string }> = {
    primary: { label: "Primary", className: "bg-blueprint-600 text-white" },
    secondary: { label: "Secondary", className: "bg-blueprint-100 text-blueprint-800" },
    consider: { label: "Consider", className: "bg-canvas text-ink-muted" },
    avoid: { label: "Avoid", className: "bg-danger/10 text-danger" },
  };
  const badge = map[priority] ?? map.consider;
  return (
    <span className={cn("text-[10px] font-bold rounded px-2 py-1 shrink-0 mt-0.5", badge.className)}>
      {badge.label}
    </span>
  );
}

function RelevanceBadge({ relevance }: { relevance: string }) {
  const map: Record<string, { label: string; className: string }> = {
    recommended: { label: "Recommended", className: "bg-blueprint-100 text-blueprint-800" },
    viable: { label: "Viable", className: "bg-canvas text-ink-soft" },
    possible: { label: "Possible", className: "bg-canvas text-ink-muted" },
    "not-recommended": { label: "Not recommended", className: "bg-danger/10 text-danger" },
  };
  const badge = map[relevance] ?? map.viable;
  return (
    <span className={cn("text-[10px] font-medium rounded px-1.5 py-0.5 whitespace-nowrap", badge.className)}>
      {badge.label}
    </span>
  );
}

function Spinner() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8 animate-spin text-blueprint-500">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" fill="none" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={cn("inline-block", className)} fill="currentColor" aria-hidden>
      <path d="M10 2a4 4 0 0 0-4 4v2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-1V6a4 4 0 0 0-4-4zm-2 6V6a2 2 0 1 1 4 0v2H8z" />
    </svg>
  );
}

function LockedTeaser({
  title,
  detail,
  upgradeUrl,
  accent,
}: {
  title: string;
  detail: string;
  upgradeUrl: string;
  accent?: "blueprint";
}) {
  const isBlueprint = accent === "blueprint";
  return (
    <div
      className={cn(
        "rounded-2xl border-2 border-dashed p-6 text-center",
        isBlueprint ? "border-blueprint-200 bg-blueprint-50/40" : "border-gold-300 bg-gold-50/60"
      )}
    >
      <div
        className={cn(
          "inline-flex items-center justify-center h-10 w-10 rounded-full mb-3",
          isBlueprint ? "bg-blueprint-100 text-blueprint-700" : "bg-gold-100 text-gold-700"
        )}
      >
        <LockIcon className="h-5 w-5" />
      </div>
      <div className="font-semibold text-base">{title}</div>
      <p className="mt-2 text-sm text-ink-muted leading-relaxed max-w-md mx-auto">{detail}</p>
      <a
        href={upgradeUrl}
        className={cn(
          "mt-4 inline-flex items-center gap-2 rounded-full text-sm font-medium px-5 py-2.5 transition",
          isBlueprint
            ? "bg-blueprint-600 text-white hover:bg-blueprint-700"
            : "bg-gold-600 text-white hover:bg-gold-700"
        )}
      >
        Get the full Blueprint →
      </a>
    </div>
  );
}

function InlineLockNote({ text, upgradeUrl }: { text: string; upgradeUrl: string }) {
  return (
    <div className="rounded-xl border border-dashed border-gold-300 bg-gold-50/40 px-4 py-3 flex items-center gap-3">
      <LockIcon className="h-4 w-4 text-gold-600 shrink-0" />
      <div className="text-xs text-gold-800 flex-1">{text}</div>
      <a
        href={upgradeUrl}
        className="shrink-0 rounded-full bg-gold-600 text-white text-[11px] font-medium px-3 py-1.5 hover:bg-gold-700 transition"
      >
        Unlock →
      </a>
    </div>
  );
}

function UpgradeInline({ label, upgradeUrl }: { label: string; upgradeUrl: string }) {
  return (
    <a
      href={upgradeUrl}
      className="block rounded-xl border border-dashed border-blueprint-200 bg-blueprint-50/40 px-4 py-3 text-center text-xs font-medium text-blueprint-700 hover:bg-blueprint-50 transition"
    >
      <LockIcon className="inline h-3 w-3 mr-1.5" />
      {label} →
    </a>
  );
}

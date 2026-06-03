"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import Pip from "@/components/Pip";
import SkillBars from "@/components/SkillBar";
import PipReport from "@/components/PipReport";
import WorkshopModal, { type Look } from "@/components/WorkshopModal";
import {
  ITEMS,
} from "@/lib/items";
import {
  initState,
  applyTurn,
  pipTiers,
  overallStage,
  SKILLS,
  type GameState,
  type Item,
  type PipTiers,
  type TurnResult,
} from "@/lib/game";

type Phase = "ask" | "judge" | "locate" | "teach" | "feedback";

const COLORS = ["#7C6BE0", "#5BC8F5", "#3FD3A7", "#FF8A5B", "#FF7BA9", "#FFC44D"];
const STAGE_NAMES = ["Little Blob", "Sprout", "Buddy", "Bright Spark", "Genius Pip"];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function PlayPage() {
  const [state, setState] = useState<GameState>(() => initState());
  const [deck, setDeck] = useState<Item[]>(() => shuffle(ITEMS));
  const [packName, setPackName] = useState<string | null>(null);
  const [qi, setQi] = useState(0);
  const [phase, setPhase] = useState<Phase>("ask");
  const [tapped, setTapped] = useState<number | null>(null);
  const [result, setResult] = useState<TurnResult | null>(null);
  const [grew, setGrew] = useState<string | null>(null);
  const [color, setColor] = useState(COLORS[0]);
  const [muted, setMuted] = useState(false);
  const [pipPulse, setPipPulse] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showWorkshop, setShowWorkshop] = useState(false);
  const [look, setLook] = useState<Look>({
    eyes: null,
    mouth: null,
    body: null,
    source: null,
    pattern: "none",
  });

  // Load a teacher-published pack (from the Content Studio) if present.
  useEffect(() => {
    try {
      const raw = localStorage.getItem("pip-pack");
      if (!raw) return;
      const pack = JSON.parse(raw) as { name?: string; items?: Item[]; practisedTopic?: string };
      if (pack.items && pack.items.length > 0) {
        setDeck(shuffle(pack.items));
        setPackName(pack.name ?? "Your class topic");
        setQi(0);
        setState({ ...initState(), practisedTopic: pack.practisedTopic });
      }
    } catch {
      /* ignore malformed pack */
    }
  }, []);

  const item = deck[qi % deck.length];
  const ceiling = pipTiers(state); // what mastery has unlocked
  const cap = (k: "eyes" | "mouth" | "body" | "source") =>
    Math.min(look[k] ?? ceiling[k], ceiling[k]);
  const tiers = {
    eyes: cap("eyes"),
    mouth: cap("mouth"),
    body: cap("body"),
    source: cap("source"),
    glow: ceiling.glow,
  };
  const stage = overallStage(ceiling);

  const correctionOrder = useMemo(
    () => shuffle(item.corrections),
    // reshuffle each new item
    [item.id]
  );

  function speak(text: string) {
    if (muted || typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.98;
    u.pitch = 1.35;
    window.speechSynthesis.speak(u);
  }

  function answerText() {
    return item.tokens.join(" ").replace(/\s+([.,!?])/g, "$1");
  }

  function onAsk() {
    setPhase("judge");
    speak(answerText());
  }

  function commit(saidWrong: boolean, tapIdx: number | null) {
    const before = pipTiers(state);
    const { state: next, result: r } = applyTurn(state, item, saidWrong, tapIdx);
    const after = pipTiers(next);
    setState(next);
    setResult(r);
    setTapped(tapIdx);
    // detect which Pip part grew
    const growKey = grownPart(before, after);
    setGrew(growKey);
    if (growKey) {
      setPipPulse(true);
      setTimeout(() => setPipPulse(false), 600);
    }
    setPhase("feedback");
    speak(r.message);
  }

  function onJudge(saidRight: boolean) {
    if (saidRight) {
      commit(false, null);
      return;
    }
    // "something's wrong"
    if (item.errorType === "NONE") {
      commit(true, null); // false alarm
    } else {
      setPhase("locate");
    }
  }

  function onTapWord(i: number) {
    if (phase !== "locate") return;
    commit(true, i);
  }

  function onNext() {
    setResult(null);
    setTapped(null);
    setGrew(null);
    const nextQi = qi + 1;
    // end of a session (worked through the deck once) → show the report
    if (nextQi > 0 && nextQi % deck.length === 0) {
      setShowReport(true);
    }
    setQi(nextQi);
    setPhase("ask");
  }

  // celebrate teach step (after a successful catch we offer to teach the fix)
  const caughtIt = result?.outcome === "catch";
  useEffect(() => {
    if (phase === "feedback" && caughtIt) {
      const t = setTimeout(() => setPhase("teach"), 650);
      return () => clearTimeout(t);
    }
  }, [phase, caughtIt]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-5">
      {/* top bar */}
      <header className="mb-5 flex items-center justify-between gap-3">
        <Link href="/" className="font-display text-2xl font-bold text-grape">
          Pip
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/teacher"
            className="rounded-full bg-white/70 px-3 py-1.5 font-display text-sm font-semibold text-grapeDark shadow-soft transition hover:scale-105"
          >
            👩‍🏫 Teacher
          </Link>
          <button
            onClick={() => setMuted((m) => !m)}
            className="rounded-full bg-white/70 px-3 py-1.5 text-lg shadow-soft"
            aria-pressed={muted}
            aria-label={muted ? "Unmute Pip" : "Mute Pip"}
          >
            {muted ? "🔇" : "🔊"}
          </button>
          <button
            onClick={() => setShowWorkshop(true)}
            className="rounded-full bg-white/70 px-4 py-1.5 font-display text-sm font-semibold text-grapeDark shadow-soft transition hover:scale-105"
          >
            🎨 Workshop
          </button>
          <button
            onClick={() => setShowReport(true)}
            className="rounded-full bg-grape px-4 py-1.5 font-display text-sm font-semibold text-white shadow-soft transition hover:scale-105"
          >
            📊 Report
          </button>
        </div>
      </header>

      {showReport && <PipReport state={state} onClose={() => setShowReport(false)} />}
      {showWorkshop && (
        <WorkshopModal
          ceiling={ceiling}
          look={look}
          color={color}
          onLook={(patch) => setLook((l) => ({ ...l, ...patch }))}
          onColor={setColor}
          onClose={() => setShowWorkshop(false)}
        />
      )}

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        {/* Pip column */}
        <aside className="flex flex-col items-center">
          <div className={pipPulse ? "animate-wiggle" : "animate-bob"}>
            <Pip tiers={tiers} color={color} pattern={look.pattern} size={260} />
          </div>
          <div className="mt-1 rounded-full bg-grape/10 px-4 py-1 font-display text-lg font-semibold text-grapeDark">
            {STAGE_NAMES[stage]} · Stage {stage}
          </div>
          <p className="mt-2 text-center text-sm text-ink/55">
            Good catches grow Pip. Each skill changes a different part!
          </p>
        </aside>

        {/* play column */}
        <section>
          {/* mission */}
          <div className="mb-3 rounded-2xl bg-white/70 px-5 py-3 shadow-soft">
            <span className="text-sm font-bold uppercase tracking-wide text-grape">
              {packName ? `Topic · ${packName}` : "Mission"}
            </span>
            <p className="font-display text-lg">{item.mission}</p>
          </div>

          {/* ASK */}
          {phase === "ask" && (
            <div className="animate-pop rounded-xl2 bg-white p-6 shadow-soft">
              <p className="mb-4 text-ink/70">Tell Pip what to do:</p>
              <button
                onClick={onAsk}
                className="w-full rounded-2xl bg-sky/20 px-6 py-5 text-left font-display text-xl font-semibold transition hover:bg-sky/30 active:scale-[0.99]"
              >
                🗣️ “{item.chip}”
              </button>
            </div>
          )}

          {/* JUDGE / LOCATE / FEEDBACK answer card */}
          {(phase === "judge" || phase === "locate" || phase === "feedback" || phase === "teach") && (
            <div className="animate-pop rounded-xl2 bg-white p-6 shadow-soft">
              <div className="mb-1 flex items-center gap-2 text-sm font-bold text-grape">
                <span>Pip says</span>
                <button
                  onClick={() => speak(answerText())}
                  className="rounded-full bg-grape/10 px-2 py-0.5 text-xs"
                >
                  🔊 hear it
                </button>
              </div>

              <p className="font-display text-2xl leading-relaxed">
                {item.tokens.map((tok, i) => {
                  const isErr = item.errorIdx.includes(i);
                  const reveal = phase === "feedback" || phase === "teach";
                  const tappedThis = tapped === i;
                  const cls = [
                    "tappable-word",
                    phase === "locate" ? "cursor-pointer underline decoration-dotted decoration-grape/40" : "",
                    reveal && isErr ? "bg-bubble/30 text-bubble line-through decoration-2" : "",
                    reveal && tappedThis && isErr ? "ring-2 ring-mint" : "",
                  ].join(" ");
                  return phase === "locate" ? (
                    <button key={i} className={cls} onClick={() => onTapWord(i)}>
                      {tok}{" "}
                    </button>
                  ) : (
                    <span key={i} className={cls}>
                      {tok}{" "}
                    </span>
                  );
                })}
              </p>

              {/* JUDGE buttons */}
              {phase === "judge" && (
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <button
                    onClick={() => onJudge(true)}
                    className="rounded-2xl bg-mint/20 px-5 py-5 font-display text-xl font-semibold transition hover:bg-mint/30 active:scale-95"
                  >
                    👍 Pip’s right!
                  </button>
                  <button
                    onClick={() => onJudge(false)}
                    className="rounded-2xl bg-sunny/25 px-5 py-5 font-display text-xl font-semibold transition hover:bg-sunny/40 active:scale-95"
                  >
                    🤔 Something’s wrong
                  </button>
                </div>
              )}

              {/* LOCATE hint */}
              {phase === "locate" && (
                <p className="mt-5 rounded-xl bg-sunny/20 px-4 py-3 font-display text-lg">
                  👆 Tap the part that’s wrong.
                </p>
              )}

              {/* FEEDBACK */}
              {phase === "feedback" && result && (
                <FeedbackBlock result={result} grew={grew} onNext={onNext} showNext />
              )}

              {/* TEACH */}
              {phase === "teach" && (
                <div className="mt-6" aria-live="polite">
                  {grew && <GrowBanner grew={grew} />}
                  <p className="mb-3 font-display text-lg font-semibold">
                    🎓 Now teach Pip the right answer:
                  </p>
                  <TeachOptions
                    options={correctionOrder}
                    onPick={(correct) => {
                      speak(correct ? "Thank you, teacher! I will remember." : "Hmm, let me think again.");
                    }}
                  />
                  <button
                    onClick={onNext}
                    className="mt-5 w-full rounded-full bg-grape px-6 py-4 font-display text-xl font-semibold text-white shadow-soft transition hover:scale-[1.02] active:scale-95"
                  >
                    Next question →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* skill bars */}
          <div className="mt-6">
            <SkillBars mastery={state.mastery} />
          </div>
        </section>
      </div>
    </main>
  );
}

function FeedbackBlock({
  result,
  grew,
  onNext,
  showNext,
}: {
  result: TurnResult;
  grew: string | null;
  onNext: () => void;
  showNext: boolean;
}) {
  if (result.outcome === "catch") {
    // teach phase takes over; show nothing here
    return null;
  }
  const tone =
    result.outcome === "goodTrust"
      ? "bg-mint/20"
      : result.outcome === "falseAlarm"
      ? "bg-sky/20"
      : "bg-bubble/15";
  return (
    <div className="mt-6" aria-live="polite">
      <div className={`rounded-2xl ${tone} px-5 py-4 font-display text-lg`}>
        {result.message}
      </div>
      {showNext && (
        <button
          onClick={onNext}
          className="mt-4 w-full rounded-full bg-grape px-6 py-4 font-display text-xl font-semibold text-white shadow-soft transition hover:scale-[1.02] active:scale-95"
        >
          Next question →
        </button>
      )}
    </div>
  );
}

function GrowBanner({ grew }: { grew: string }) {
  const skill = SKILLS.find((s) => s.key === grew);
  return (
    <div className="mb-4 animate-pop rounded-2xl bg-gradient-to-r from-sunny/40 to-bubble/30 px-5 py-3 text-center font-display text-lg font-semibold">
      ✨ Great catch! {skill ? `${skill.part} leveled up!` : "Pip grew!"} ✨
    </div>
  );
}

function TeachOptions({
  options,
  onPick,
}: {
  options: { text: string; correct: boolean }[];
  onPick: (correct: boolean) => void;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  return (
    <div className="grid gap-2">
      {options.map((o, i) => {
        const isPicked = picked === i;
        const show = picked !== null;
        const cls = show
          ? o.correct
            ? "bg-mint/30 ring-2 ring-mint"
            : isPicked
            ? "bg-bubble/20 ring-2 ring-bubble"
            : "bg-white"
          : "bg-white hover:bg-grape/5";
        return (
          <button
            key={i}
            disabled={show}
            onClick={() => {
              setPicked(i);
              onPick(o.correct);
            }}
            className={`rounded-xl border border-ink/10 px-4 py-3 text-left font-display text-lg transition ${cls}`}
          >
            {show && o.correct && "✅ "}
            {show && isPicked && !o.correct && "❌ "}
            {o.text}
          </button>
        );
      })}
    </div>
  );
}

function grownPart(before: PipTiers, after: PipTiers): string | null {
  if (after.eyes > before.eyes) return "factual";
  if (after.mouth > before.mouth) return "bias";
  if (after.body > before.body) return "overconfidence";
  if (after.source > before.source) return "source";
  return null;
}

import Link from "next/link";
import Pip from "@/components/Pip";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 py-12 text-center">
      <div className="animate-bob">
        <Pip
          tiers={{ eyes: 3, mouth: 3, body: 2, source: 2, glow: 0.7 }}
          color="#7C6BE0"
          size={260}
        />
      </div>

      <h1 className="mt-4 font-display text-5xl font-bold tracking-tight text-ink sm:text-6xl">
        Meet <span className="text-grape">Pip</span>
      </h1>
      <p className="mt-3 max-w-xl font-display text-xl text-ink/70">
        Pip is a friendly robot apprentice who is still learning — so it{" "}
        <b>makes mistakes</b>. Your job is to catch them, teach Pip, and watch it
        grow smarter.
      </p>

      <Link
        href="/play"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-grape px-9 py-4 font-display text-2xl font-semibold text-white shadow-soft transition-transform hover:scale-105 active:scale-95"
      >
        ▶ Start teaching Pip
      </Link>

      <div className="mt-12 grid w-full max-w-3xl gap-4 sm:grid-cols-3">
        <Card emoji="🗣️" title="Direct Pip">
          You ask Pip a question.
        </Card>
        <Card emoji="🔎" title="Catch mistakes">
          Pip answers — but watch out, it sometimes gets things wrong!
        </Card>
        <Card emoji="🌱" title="Pip grows">
          Every good catch teaches Pip and changes how it looks.
        </Card>
      </div>

      <p className="mt-10 max-w-lg text-sm text-ink/50">
        A prototype of <b>Pip — train your AI</b>: building real AI-literacy in
        primary students by putting the child in charge of a fallible AI.
      </p>
    </main>
  );
}

function Card({
  emoji,
  title,
  children,
}: {
  emoji: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white/70 p-5 text-left shadow-soft backdrop-blur">
      <div className="text-3xl" aria-hidden>
        {emoji}
      </div>
      <div className="mt-1 font-display text-lg font-semibold">{title}</div>
      <div className="text-ink/70">{children}</div>
    </div>
  );
}

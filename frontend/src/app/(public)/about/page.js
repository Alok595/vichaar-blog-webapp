import Link from "next/link";
import { ArrowLeft, BookOpen, Feather, Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-10 md:py-16 max-w-3xl">
      {/* Back Link */}
      <div className="mb-8 border-b border-border/60 pb-3">
        <Link
          href="/"
          className="inline-flex items-center text-xs font-sans uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="mr-2 h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
          Return to The Journal
        </Link>
      </div>

      <header className="mb-10 text-center space-y-3">
        <span className="text-xs uppercase tracking-[0.3em] font-sans font-semibold text-amber-800 dark:text-amber-400">
          The Manifesto
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground">
          About Vichaar (विचार)
        </h1>
        <p className="font-serif italic text-lg sm:text-xl text-muted-foreground">
          A dedicated sanctuary for long-form engineering essays, computational philosophy, and craft.
        </p>
      </header>

      <div className="font-serif text-lg sm:text-xl leading-[1.9] text-foreground space-y-6">
        <p className="drop-cap text-foreground/95">
          Vichaar was conceived out of a quiet dissatisfaction with the accelerationist brevity of the modern web. In an ecosystem saturated with ephemeral snippets, algorithmic feeds, and 15-second summaries, we believe that profound ideas demand contemplation, cadence, and care.
        </p>

        <p className="text-foreground/90">
          The word <em>विचार</em> in Sanskrit and Hindi encapsulates not just a passing thought, but deliberate inquiry, deep consideration, and the pursuit of reasoned truth. Our journal brings together software architects, systems thinkers, and interface craftsmen to publish inquiries that withstand the test of time.
        </p>

        <div className="my-10 border-y border-border py-8 text-center">
          <blockquote className="italic text-xl sm:text-2xl text-foreground font-serif max-w-xl mx-auto leading-relaxed">
            &ldquo;We shape our tools, and thereafter our tools shape our thoughts.&rdquo;
          </blockquote>
          <p className="text-xs uppercase tracking-[0.2em] font-sans text-muted-foreground mt-3">
            &mdash; The Editorial Principle of Vichaar
          </p>
        </div>

        <h3 className="font-serif text-2xl font-bold tracking-tight pt-4 text-foreground">
          Our Editorial Tenets
        </h3>

        <ul className="space-y-4 text-base sm:text-lg font-serif list-disc pl-6 text-foreground/90">
          <li>
            <strong>Depth Over Velocity:</strong> We prioritize comprehensive treatises over sensational hot takes.
          </li>
          <li>
            <strong>Aesthetic Reverence:</strong> Code and prose are two expressions of human intellect; both deserve typographic dignity.
          </li>
          <li>
            <strong>Open Dialogue:</strong> True progress emerges from respectful critique, open-source spirit, and intellectual honesty.
          </li>
        </ul>

        <div className="mt-12 pt-8 border-t border-border/80 text-xs font-sans text-muted-foreground flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <span className="font-semibold text-foreground uppercase tracking-widest block mb-1">
              Editorial Board
            </span>
            <p>Dr. Ananya Sharma &bull; Julian Vance &bull; Marcus Sterling</p>
          </div>
          <div className="sm:text-right">
            <span className="font-semibold text-foreground uppercase tracking-widest block mb-1">
              Colophon
            </span>
            <p>Set in Newsreader &amp; Geist &bull; Built on Next.js 15 &bull; Tailwind CSS v4</p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import TextType from "./TextType";

/**
 * The home hero's animated headline and lede.
 *
 * Sequencing, not guessed delays: the lead types once and settles, and only
 * when it reports done do the rotating stack terms and the lede start. A fixed
 * `initialDelay` would drift the moment the copy or the typing speed changed —
 * and the PT lead is six characters longer than the EN one.
 *
 * The shimmer is chained, not concurrent: `leadDone` already gates the rotating
 * term and the lede, and it now also swaps `.shiny-text` onto the settled lead —
 * so the typewriter finishes before the gradient starts, and no element ever
 * runs two effects at once (TASKS.md K1). The rotating term is left plain; it is
 * still typing and deleting for the life of the page.
 *
 * ⛔ Every animated span is decorative and `aria-hidden`. The complete
 * positioning line — "Design Engineer. Next.js, Python, and scalable growth
 * automation." — is verbatim-mandated by the workspace CLAUDE.md, and a
 * rotating headline never holds all of it at once. The real strings therefore
 * ride along in `.visually-hidden` siblings, which Astro server-renders into
 * the static HTML, so the accessible name and the crawled `<h1>` are unchanged
 * and complete. Hero.astro carries the `<noscript>` visual fallback.
 */

interface Props {
  /** The full, verbatim positioning line. Never animated — read, not typed. */
  title: string;
  lead: string;
  rotating: string[];
  lede: string;
}

export default function HeroHeadline({ title, lead, rotating, lede }: Props) {
  const [leadDone, setLeadDone] = useState(false);

  return (
    <>
      <h1 id="hero-title">
        <span className="typed-real">{title}</span>
        <span className="hero__type typed-anim">
          <TextType
            className={leadDone ? "shiny-text" : ""}
            text={lead}
            loop={false}
            showCursor={!leadDone}
            onDone={() => setLeadDone(true)}
          />
          <TextType
            as="span"
            className="hero__type-rotating"
            text={rotating}
            start={leadDone}
            showCursor={leadDone}
            pauseDuration={2000}
            reserveSpace
          />
        </span>
      </h1>

      <p>
        <span className="typed-real">{lede}</span>
        <TextType
          as="span"
          className="hero__type-lede typed-anim"
          text={lede}
          loop={false}
          start={leadDone}
          showCursor={false}
          typingSpeed={16}
          reserveSpace
        />
      </p>
    </>
  );
}

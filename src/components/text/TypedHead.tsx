import { useState } from "react";
import TextType from "./TextType";

/**
 * A page header whose title and lede type in, in that order.
 *
 * Same contract as HeroHeadline: the animated spans are decorative and
 * `aria-hidden`, the real strings ship in `.typed-real` siblings that Astro
 * server-renders, and TypedFallback.astro swaps them into flow when scripts
 * are off. Neither string rotates here, so both settle and stay.
 */

interface Props {
  title: string;
  lede: string;
  titleClassName?: string;
  ledeClassName?: string;
}

export default function TypedHead({
  title,
  lede,
  titleClassName = "",
  ledeClassName = "",
}: Props) {
  const [titleDone, setTitleDone] = useState(false);

  return (
    <>
      <h1 className={titleClassName}>
        <span className="typed-real">{title}</span>
        <TextType
          as="span"
          className="pindex-head__title-type typed-anim"
          text={title}
          loop={false}
          showCursor={!titleDone}
          onDone={() => setTitleDone(true)}
          reserveSpace
        />
      </h1>

      <p className={ledeClassName}>
        <span className="typed-real">{lede}</span>
        <TextType
          as="span"
          className="pindex-head__lede-type typed-anim"
          text={lede}
          loop={false}
          start={titleDone}
          showCursor={false}
          typingSpeed={16}
          reserveSpace
        />
      </p>
    </>
  );
}

---
format: 1920x1080
duration: 45s
fps: 30
message: "One system, two halves, and a line drawn down the middle on purpose."
arc: Mark → The payload → The watcher → The refusal → The line → The walk → The close → The count
audience: "Engineering-literate readers landing on two GitHub READMEs and one case-study hero"
mode: collaborative
workflow: general-video
storyboard: yes
variants: dark + light — one source, two rows through `render --batch`
status: BUILT & APPROVED 2026-09-13 — both cuts rendered, check passed
---

# price-watcher → ticket-autobuy — showcase v2

> **Archived board — this is the plan that was actually built.** Superseded the 20s v1.
> Approved by Juan 2026-09-13; both cuts rendered and shipped.
>
> - **Composition:** [`../../price-watcher-ticket-autobuy-showcase/`](../../price-watcher-ticket-autobuy-showcase/)
>   — design truth is its `frame.md`; the build is a single `index.html`.
> - **Visual board:** `price-watcher-ticket-autobuy-showcase.storyboard.html` (sibling, opens
>   locally — it reads `frames/`) · published at
>   <https://claude.ai/code/artifact/b1e66aed-4e93-4f9c-9306-6f3de13ffd3f>
> - **Contact sheets:** `contact-sheet-{dark,light}.png` · stills in `frames/`
>
> ⛔ **One correction to the plan below:** it proposed 8 sub-compositions under
> `compositions/frames/`. That is **not** what was built — the persistent divider spanning F6→F7
> required one timeline, so the piece is a single `index.html` with 8 view blocks. Frame numbering,
> timings and motion citations below are otherwise as shipped.

---

## Why v2 exists

The rendered v1 is five typographic slides on a dark ground. Pulled frames at
t=2.8 / 11.0 / 15.6 / 19.4 confirm it: no chrome, no mark, no product surface, nothing
that says *whose* this is. It reads as a generic cyan-on-dark AI deck — which HyperFrames'
own `house-style.md` lists by name as the first lazy default to question.

Three things change:

1. **The mark exists now.** `assets/vector-nobg.svg` (1254², 111 paths) has never appeared
   in the reel. It opens and closes v2, and it is the through-line between the halves.
2. **Every scene sits in real UI furniture** — a terminal, a Telegram thread, a browser
   under automation. Built in HTML, not captured.
3. **One brand, one journey.** Per your call: the two repos are not rivals, they are
   step A and step B of the same system. One mark covers both; the line between them is a
   *handoff*, not a wall.

---

## ⛔ The honesty constraint that governs every frame

`_memory/project_juansilva_price_watcher_case_study.md` records the record as
`featured: false` for a specific reason: *"this record has zero design evidence (two CLIs,
no interface)."* That is still true, and v2 must not quietly contradict it.

**The UI may only depict surfaces these tools genuinely touch:**

| Allowed | Because |
|---|---|
| A terminal window | `watch.py` — the literal interface |
| A Telegram message | the real notification sink |
| A browser under Playwright | `buy.py` drives a real one |
| A JSON payload / target file | what the adapter actually parses |

⛔ **Forbidden:** a price-watcher dashboard, a settings panel, an admin console, a charting
app, a "product" of any kind. Neither tool has one. Inventing an interface to fix
"no UI" would be the same lie the reel exists to avoid.

Carried over unchanged from `frame.md`: no real CPF / phone / address / cookie / bot token /
chat id; no seller identity; no invented metric; no render-time network, `Date.now()` or
`Math.random()`.

---

## Two variants, one source

Both a **dark** and a **light** cut ship. They are not two compositions — that would let the
timing drift the first time one was edited alone. One `index.html` declares a `theme`
variable, and the CLI renders both from it in a single command:

```bash
# themes.json
[ { "theme": "dark" }, { "theme": "light" } ]

npx hyperframes render --batch themes.json --strict-variables
```

`--batch` renders one output per variable row; `--strict-variables` fails the render if
`theme` is ever undeclared or mistyped rather than quietly warning. Layout, timing and motion
are physically the same source, so the two cuts cannot desynchronise.

**Why both is the right answer, not just twice the work:** GitHub honours
`prefers-color-scheme` in a README via `<picture>` — the pattern the HyperFrames README uses
for its own logo, three lines up from where ours sits:

```html
<picture>
  <source media="(prefers-color-scheme: dark)"  srcset="assets/showcase/…-dark.webp">
  <source media="(prefers-color-scheme: light)" srcset="assets/showcase/…-light.webp">
  <img src="assets/showcase/…-light.webp" alt="…" width="100%">
</picture>
```

Today's single dark hero floats as a black slab for every reader on GitHub's default light
theme. Two cuts fix that in both repos, and the portfolio already ships a `data-theme`
switch, so the case-study hero can match the page it sits in.

---

## Palette — both grounds, and every value is already a token

v1's cyan came from the portfolio's `tokens.css`. The logo is violet/indigo and has never
met it. v2 bridges them — and the light column is not invented: `tokens.css` already carries
a complete `:root[data-theme="light"]` semantic layer, written for exactly this problem. Its
own comment, in the dark block, says so:

> `--primary` is the fill; `--primary-ink` is foreground ink. They happen to be identical on
> the dark canvas, but separating them **prevents cyan text from failing contrast against the
> light canvas.**

That is the whole light-theme problem, already solved: `#00c8ff` measures **1.96:1 on white**
and cannot be type there. The design system routes around it, so v2 does too.

| Role | Dark cut | Light cut |
|---|---|---|
| Ground | `#0c0e12` neutral-1000 | `#ffffff` white |
| Panel / raised | `#13161b` · `#1a1d24` | slate-50 · slate-100 |
| Border subtle / strong | `#22262f` · `#344054` | `#d1d5db` · slate-400 |
| Heading ink | `#f7f7f7` — 19.4:1 ✓ | `#0c0e12` — 19.4:1 ✓ |
| Body ink | `#cecfd2` | `#344054` — 10.5:1 ✓ |
| Muted ink | `#85888e` | slate-600 — 5.3:1 ✓ |
| **A-side — the watcher** *(type)* | `#00c8ff` cyan-400 — 9.9:1 ✓ | `#00769d` cyan-800 — 5.2:1 ✓ |
| A-side fill / glow | `#00c8ff` | `#009cd4` cyan-500 |
| **B-side — the buyer** *(type)* | `#826AFB` *(logo)* — 5.0:1 ✓ | `#625df5` violet-500 — 4.8:1 ✓ |
| B-side fill / glow | `#4F2DEA` *(logo)* | `#4F2DEA` *(logo)* |
| The refusal | `#ff5d8b` pink-300 | `#d7004b` pink-700 — 5.3:1 ✓ |
| The armed ceiling / the key that crosses | `#fde272` amber-200 | `#854a0e` amber-800 — 7.0:1 ✓ |
| The confirmed order — **once, F7** | `#22c55e` green-500 | `#095c37` green-800 — 8.0:1 ✓ |

Every light value is a real token from `tokens.css`; every violet is a literal fill from
`vector-nobg.svg`. Nothing in either column was invented.

⛔ **`#4F2DEA` is a fill, a stroke and a glow — never type.** It measures 2.67:1 on the dark
ground. Type uses `#826AFB` (dark) / `#625df5` (light). This is the rule most likely to get
broken during the build, so it is written down here.

⭐ The gradient `#4F2DEA → #00c8ff` is the A→B journey. It appears on the mark and the arrow
between the two names and **nowhere else** — a gradient used twice is decoration.

⭐ **The teal is gone.** v1 had no teal and I had proposed one for the `0 dependencies` badge.
There is no contrast-safe teal token for the light ground, and spending a sixth hue on a claim
that is not a status was wrong anyway. The badge is neutral ink in both cuts, which keeps green
meaning *exactly one thing* — the order in Frame 7.

### The mark is native to light

`png.png` renders the logo on white and it is plainly where it was designed to live: the
ticket's interior is near-white (`#F0EEFE`, `#EDEAFD`) held inside a violet outline that does
all the work. On the dark ground that interior becomes a bright slab and needs care; on white
it simply reads. The light cut is the mark's home ground, which is a point in the light cut's
favour, not a compromise.

⛔ **Do not apply `--brand-mark-filter`.** The light theme sets it to `invert(1)`, which is
correct for the monochrome wordmark it was written for and catastrophic here — inverting a
full-colour violet/teal illustration yields yellow-green sludge. The mark ships unfiltered in
both cuts. Where a mark must sit on an uncertain ground (the Telegram avatar in Frame 4),
`png-profile-nobg.png` carries its own blue disc and works on either.

Typography is unchanged across both cuts: Inter 700–800 display, JetBrains Mono for money,
ids and code — both already vendored as local WOFF2, no network at render.

---

## Frames

### ## Frame 1 — The mark

- scene: The logo draws itself on, the two names lock up under it, then the mark shrinks into a browser tab
- duration: 4.2s
- transition_in: cut
- status: outline
- src: compositions/frames/01-mark.html
- poster: 3.2s
- blueprint: `logo-assemble-lockup`
- rules: `svg-path-draw`, `ambient-glow-bloom`

Cold open on the bare ground. The ticket's outer contour draws on as a stroke, the interior
fills cross-fade up underneath it, and a violet bloom lifts behind the mark and settles.

The wordmark builds under it, and the arrow between the names draws left to right — the
journey stated once, in one gesture:

```
                    [ mark ]

        price-watcher  ──────▶  ticket-autobuy

              one system · two halves
```

**Exit is a match cut, not a wipe.** The mark scales down and travels to the top-left, where
it lands as the favicon in Frame 2's tab strip. The brand does not get introduced and then
abandoned; it becomes the furniture.

⚠️ Build note: `svg-path-draw` across all 111 paths would be soup. Only the outer ticket
contour draws; everything inside cross-fades. If the contour reads as mush at 1920, fall
back to a masked wipe across the whole mark.

---

### ## Frame 2 — One price. Nineteen in the payload.

- scene: A browser page shows one price; a cursor opens the payload drawer and nineteen rows are under it
- duration: 6.8s
- transition_in: match-cut
- status: outline
- src: compositions/frames/02-payload.html
- poster: 5.6s
- blueprint: `cursor-ui-demo`
- rules: `cursor-click-ripple`, `anchored-layout-expand`, `coordinate-target-zoom`
- registry: `browser-device-stage` (`chrome: browser`)

Real browser chrome. Tab strip carrying the mark as favicon, an address pill, a reload
control. The page shows what a human sees: the event, and **one** number.

The cursor travels in, presses a disclosure control, and the drawer opens — then the
JSON underneath is what fills it. That is the actual claim of the adapter: the site is
Next.js SSR and ships the whole matrix in its payload, which is why a CSS scraper would be
worse than useless here.

```
╭──────────────────────────────────────────────────────────╮
│ ◆ rockinrio2026-09-04  ✕  ＋                             │
│ ● ● ●   ⌂  https://•••••••••/e/rockinrio2026-09-04  ⟳    │
├──────────────────────────────────────────────────────────┤
│  Rock in Rio 2026 · 04/09 · Gramado                      │
│  R$ 220,00   CHEAPEST                          [ ⌄ ]  ←  │
│  ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌       │
│  Gramado || Inteira          qty 12    R$   220,00       │
│  Gramado || Meia Estudante   qty  4    R$   248,00       │
│  Gramado || Meia Até 21      qty 26    R$   265,00       │
│  … 19 rows                                               │
╰──────────────────────────────────────────────────────────╯
   The page shows one price. The payload carries nineteen.
```

⚠️ **The host is elided to `•••••••••` on purpose.** `frame.md` bans the seller's branding.
The elision reads as a deliberate redaction rather than an accident, which fits the project.
Say the word if you'd rather name the site — its README already links it publicly — and
I'll unmask it.

⛔ The drawer opens via `anchored-layout-expand` (mask + counter-scale). v1 tweens
`#s1-matrix { height }`, which the animation rules contract forbids outright — `width` /
`height` / `top` / `left` tweens snap to integer device pixels and stutter under the
seek-by-frame renderer. This is a real defect being fixed, not a restyle.

---

### ## Frame 3 — The watcher runs

- scene: A terminal types the command and three polls land; the record falls
- duration: 6.6s
- transition_in: vertical travel
- status: outline
- src: compositions/frames/03-watcher.html
- poster: 5.4s
- blueprint: `prompt-type-submit-generate`
- rules: `discrete-text-sequence`, `context-sensitive-cursor`, `ambient-glow-bloom`
- registry: `terminal-simulator`

The browser travels up and out; a terminal window rises into its place. Real window chrome —
title bar, muted dots, `watch.py — bash — 96×28`.

The command **types**, character by character, with a blinking caret. Log lines then arrive
on a beat rather than as a dump: a watcher is a thing that runs *over time*, and a single
paste would read as a static list.

```
╭──────────────────────────────────────────────────────────╮
│ ● ● ●        watch.py — bash — 96×28                     │
├──────────────────────────────────────────────────────────┤
│ $ python3 watch.py▌                                      │
│                                                          │
│ rockinrio2026-09-04   Gramado || Inteira    R$ 242,00    │
│ rockinrio2026-09-05   Gramado || Inteira    R$ 330,00    │
│ rockinrio2026-09-11   Gramado || Inteira    R$ 220,00    │
│                                                          │
│ record low so far     R$ 242,00  →  R$ 220,00            │
╰──────────────────────────────────────────────────────────╯
            ( stdlib only · 0 dependencies )
```

The record-low line updating in place is the rule firing — edge-triggered, which is the
repo's own invariant. The teal `stdlib only · 0 dependencies` badge lands under it.

---

### ## Frame 4 — The alert, and the refusal

- scene: A Telegram alert rises over the blurred terminal, then NEVER BUYS stamps across it
- duration: 5.6s
- transition_in: rack-focus
- status: outline
- src: compositions/frames/04-refusal.html
- poster: 4.6s
- blueprint: `agent-progress-theater`
- rules: `depth-of-field-blur`, `press-release-spring`, `sine-wave-loop`
- registry: `chat-message`

The terminal stays on screen and racks **out** of focus. A Telegram bubble rises into the
sharp plane — the mark as the bot's avatar, so the brand is doing a job rather than sitting
in a corner.

```
        ╭────────────────────────────────────────╮
        │ ◆  price-watcher bot            19:41  │
        │                                        │
        │  ⚠  NEW LOWEST — R$ 220,00             │
        │     Gramado || Inteira · qty 12        │
        │     beats the previous R$ 242,00       │
        ╰────────────────────────────────────────╯

              ┌────────────────────────┐
              │     N E V E R  B U Y S │   ← stamps, pink
              └────────────────────────┘
```

`NEVER BUYS` gets its own beat here rather than riding along as one badge in a row of two.
It is the load-bearing claim of the whole piece and v1 spends it as decoration at the bottom
of a frame. It arrives hard — a press-spring overshoot, then dead still.

⛔ No chat id, no handle, no phone number. The timestamp is authored.

---

### ## Frame 5 — The line

- scene: A divider draws down the middle; the two halves open out from it; one config key crosses
- duration: 7.2s ← **longest hold in the piece**
- transition_in: wipe
- status: outline
- src: compositions/frames/05-the-line.html
- poster: 6.0s
- blueprint: `comparison-split`
- rules: `svg-path-draw`, `split-tilt-cards`, `depth-of-field-blur`

The centre of the argument, and the frame a reader pauses on.

The divider **draws** top-to-bottom via `stroke-dashoffset` — a boundary being *decided*,
which is what actually happened. (v1 scales it in on `scaleY`; drawing it is both the
rule-sanctioned mechanism and the better read.) The two halves then open out from the line
with mirrored book-open tilts, each away from the centre — the motion itself says *these are
two things and the line is between them*.

This is where your "one system" reframe lands: **the F1 lockup returns, small, centred, and
straddling the line.** One mark above, two halves below it.

```
                        [ mark ]
                  one system · the line is the design
                              │
        price-watcher         │         ticket-autobuy
   Python stdlib · no venv    │   Playwright · venv · a real session
      polls · records · alerts│   resolves · walks · reserves
                              │
         cannot buy           │      hands you the Pix code
            (pink)            │             (amber)
                              │
              ╭───────────────┴───────────────╮
              │ "buy": { "enabled": true,     │  ← sits ON the line
              │   "max_price_brl": 220.00 }   │
              ╰───────────────────────────────╯
         a key in a target file the watcher parses and ignores
```

Left is cyan, right is violet — the two logo-derived channels. The `buy` block materialises
**on** the divider and stays there; it is the only object in the piece that touches both
sides. ~2.2s of authored stillness before the exit.

---

### ## Frame 6 — The walk

- scene: A checkout stepper ticks through five screens on the buyer's side; a cursor clicks Reservar
- duration: 6.2s
- transition_in: vertical travel (the line persists)
- status: outline
- src: compositions/frames/06-the-walk.html
- poster: 5.2s
- blueprint: `agent-progress-theater`
- rules: `cursor-click-ripple`, `physics-press-reaction`, `stat-bars-and-fills`
- registry: `browser-device-stage` (`chrome: browser`), `state-chip-rail`

⛔ **Everything in this frame lives RIGHT of the line.** v1's post-mortem records this as the
one error that got caught in a contact sheet and not by the linter: the order card had been
sitting over the *watcher's* column, which reads as "the watcher bought it" — the single
claim the piece exists to deny. The check tool rated it `info`-level. It was nearly shipped.

The divider does not redraw; it persists out of Frame 5. A narrower browser opens on the
right, and this is where your in-UI navigation lives — a real stepper across its top:

```
   the watcher      │  ╭──────────────────────────────────────────╮
   never stops      │  │ ● ● ●   ⌂  •••••••••/checkout      ⟳     │
                    │  ├──────────────────────────────────────────┤
   autobuy reads    │  │  ①──②──③──④──⑤                          │
   the history it   │  │  listing price checkout reserve  Pix     │
   just wrote —     │  │  ✓     ✓      ✓        ◉               │
   zero extra       │  │                                          │
   requests to      │  │           [  Reservar  ]  ←  cursor      │
   the site         │  │                                          │
                    │  │  walk ████████████░░░░░░  18.37s / 45s   │
                    │  ╰──────────────────────────────────────────╯
```

The stepper advances screen by screen at the measured cadence, the cursor travels to
`Reservar` and presses with a ripple, and the budget bar fills to 18.37 of its 45s ceiling.
The left half keeps one dim, true line so the side stays occupied without competing.

⛔ No green anywhere in this frame. The steps tick cyan.

---

### ## Frame 7 — Left unpaid on purpose

- scene: The order resolves green, a Pix hold starts counting down, and the piece says it stopped deliberately
- duration: 4.4s
- transition_in: cut
- status: outline
- src: compositions/frames/07-unpaid.html
- poster: 3.4s
- blueprint: `titlecard-reveal`
- rules: `success-check`, `counting-dynamic-scale`, `ambient-glow-bloom`

Still on the right of the line. The order card resolves under the walk that produced it and
its border goes **green — the only green in 45 seconds.**

```
                    │   ╭────────────────────────────────────╮
                    │   │ ORDER  6731D321                ✓   │
                    │   │ Gramado || Inteira                 │
                    │   │ R$ 352,00                          │
                    │   │ Pix extracted in 5.49s             │
                    │   │ ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌ │
                    │   │ 00020126•••••••••••••••  ⧗ 09:58   │
                    │   ╰────────────────────────────────────╯

              left unpaid on purpose — the hold is the human gate
```

The hold ticks down from 10:00 — measured on order #7707X57Q, where the checkout says
*"Você tem 10 minutos para completar sua compra"*. It ticking is the point: something is
running out, and the tool has deliberately handed it to a person.

⛔ The Pix payload is greeked. ⛔ 10 minutes, not 30 — the README records that an earlier
draft said 30, which is three times the real margin a human gets.

---

### ## Frame 8 — The count, and the mark

- scene: Three figures count up and stop; the mark returns on the line and the line stays lit
- duration: 4.0s
- transition_in: vertical travel
- status: outline
- src: compositions/frames/08-count.html
- poster: 3.6s
- blueprint: `dataviz-countup` → `logo-assemble-lockup`
- rules: `counting-dynamic-scale`, `ambient-glow-bloom`

```
        424                  7                    1
   tests green, offline  nights watched live   real order, end to end
   228 watcher · 196 buyer  on two cron cadences  against a hostile site

                            [ mark ]
              price-watcher  ──────▶  ticket-autobuy
                    github.com/juansilvadesign
```

Numbers count up and **stop on their real value** — nothing rolls past its own figure and
settles back, which would be a lie about precision in a piece whose whole argument is that
the figures are checkable. `counting-dynamic-scale` grows the type slightly with the value.

All three verified: `228 + 196 = 424` was re-run against both suites on 2026-09-12 after the
READMEs were caught claiming 187 and 114.

The divider outlives everything it separated and is the last thing still lit.

---

## Decisions — all settled 2026-09-13

1. ~~**The elided host.**~~ → **Named in full.** `buyticketbrasil.com` reads in the address bar in
   F2 and F6; the elision was lifted by Juan. `frame.md`'s ban now covers the seller's *branding
   and identity*, not the hostname their own README links publicly.
2. ~~**The README loop seam.**~~ → **Lockup kept, seam accepted.** One single video is mirrored to
   both READMEs rather than cutting a separate short loop.
3. ~~**WebP weight.**~~ → **1080p kept; compressed on quality, never downscaled.** Juan's call:
   render at full size, then compress only the README derivative. Shipped at 1080p · 12fps · q40
   via `libwebp_anim` → **1.68 MB** (dark) / **1.82 MB** (light), both **45.00s, `loop=0`**
   (verified by summing ANMF chunks — `ffprobe` reports `duration=N/A` for animated WebP).

## What ships

Per variant, from the one source:

| Artifact | Spec | Lands in |
|---|---|---|
| `…-showcase-{dark,light}.mp4` | 1920×1080, 30fps | case-study hero, archive |
| `…-showcase-{dark,light}.webp` | ~15fps @960, `loop=0` | both repo READMEs via `<picture>` |
| `…-preview-{dark,light}.mp4` | 1280×720 | `public/assets/images/` on the site |
| `…-poster-{dark,light}.webp` | still at the poster second | `<picture>` fallback + OG |

⛔ **ffprobe cannot read an animated WebP** and reports nothing for it — v1's duration was
verified by summing ANMF frame durations, and both variants get the same treatment rather
than an assumed length.

## On approval

`frame.md` is the design truth this project resolves first, so it gets updated to match
(the dual palette, the honesty constraint, the new scene plan) **before** any HTML is
written — then 8 sub-compositions, `npx hyperframes check` to 0 errors and clean AA contrast
**on both grounds**, and a contact sheet at every frame's poster second in both cuts.

⭐ **I will look at the frames, not just the checker.** The one semantic error v1 shipped into
review — the order card sitting over the watcher's column — was rated `info` by `check` and
caught by eye in a contact sheet. Two variants means two sheets to actually look at.

Render only after you approve the sheet.

---

## Late changes, after the board was written

All four were Juan's calls during the build, and all landed in **both** cuts. `frame.md` carries
them as design truth:

1. **Positive register is now a hard copy rule.** `NEVER BUYS` → **`ALWAYS PRECISE`**;
   `cannot buy` → **`get instant prices`**; `left unpaid on purpose` → **`you approve the
   payment`**. ⛔ The substance is unchanged — the human still holds the trigger; it is said
   forward instead of as a refusal. Frames 4, 5, 6 and 7 below predate this and still show the
   old wording in their sketches.
2. **`ALWAYS PRECISE` is success green**, not the pink refusal colour. Green is therefore a
   *family* now (the stamp **and** the order), not the single spend the palette section describes.
   The red/pink accent ends up **unused** in v2.
3. **The divider only appears where there are genuinely two columns** — it draws at F6, holds
   through F7, retracts at F8. ⛔ Absent from **F5** (the two cards *are* the columns) and F8.
   Length reduced to **581px**, two thirds of frame height, centred on 540.
4. **The watcher's half of F6/F7 holds real UI** — the `history/<target>.jsonl` the watcher
   actually writes. The contact sheet showed the composition using ~60% of a 1080p frame;
   everything was scaled up and that dead half filled.

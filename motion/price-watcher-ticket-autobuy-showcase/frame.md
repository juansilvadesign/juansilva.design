# Frame: price-watcher + ticket-autobuy — Showcase v2

## Purpose

**One** silent reel serving three surfaces: the hero of *both* repository READMEs
(`juansilvadesign/price-watcher`, `juansilvadesign/ticket-autobuy`) and the hero of the joint
case study on `juansilva.design`. One video, mirrored — not a per-surface edit.

It is one video because the two projects are **one system** — step A and step B of the same
journey. The mark is shared. The line down the middle is a **handoff**, not a wall.

It must land two claims in a single viewing, in this order:

1. **The handoff is the design.** One half watches and reports; the other holds the browser
   and reserves. They meet through a `buy` block in a target file.
2. **It closed.** The pipeline is not a diagram — it completed end to end against a live
   hostile site, and the last step is handed to a human on purpose.

⛔ It is **not** a feature list, and it is **not** "I built a ticket bot". The asset being
shown is *systems that survive contact with hostile production*.

## Format

- Canvas: 1920 × 1080, 16:9 — **1080p is the default for every deliverable**, including the
  README derivative. Size is reduced by encoder quality, never by downscaling.
- Duration: 45 seconds · 30 fps · 8 frames
- **Two cuts, one source:** a `theme` composition variable (`dark` | `light`), rendered as two
  rows through `hyperframes render --batch`. ⛔ Never fork the composition — the timing would
  drift the first time one cut was edited alone.
- Delivery per cut: H.264 MP4 (site + archive), an animated WebP for the READMEs
  (`libwebp_anim`, quality-tuned at 1080p), and a poster still.
- Context: GitHub README and a case-study hero; legible without audio, captions, or a replay.

## Voice — positive register

⭐ **Every claim is phrased as a capability, never as a refusal.** This is a hard rule on the
copy, decided 2026-09-13. The architecture still says what it always said; the words state what
the system *does* rather than what it won't.

| ⛔ Do not write | ✅ Write |
|---|---|
| `NEVER BUYS` | `ALWAYS PRECISE` |
| `cannot buy` | `GET INSTANT PRICES` |
| `left unpaid on purpose` | `you approve the payment` |
| `the watcher never stops` | `the watcher keeps watching` |
| `no venv · 0 deps` | `Python stdlib · runs anywhere` |
| `zero extra requests to the site` | `reads the history it already wrote` |

⛔ **The substance is not negotiable, only the phrasing.** The human still holds the trigger,
and the reel must still show it — as `you approve the payment` and the ticking hold in F7, and
as the visible two-sided architecture in F5. A positive register that quietly implied the tool
pays would be a lie; a positive register that says *you* complete it is simply the same truth,
told forward.

## Palette — both cuts

Dark values are the portfolio's `design-system/tokens.css`. Light values are that same file's
`:root[data-theme="light"]` semantic layer — whose own comment explains why it exists:
*"separating them prevents cyan text from failing contrast against the light canvas."*
`#00c8ff` measures **1.96:1 on white** and cannot be type there. Violets are literal fills
sampled from `assets/mark.svg`.

| Role | Dark cut | Light cut |
|---|---|---|
| Ground | `#0c0e12` | `#ffffff` |
| Panel / raised | `#13161b` · `#1a1d24` | `hsl(210 40% 98%)` · `hsl(210 40% 96%)` |
| Border subtle / strong | `#22262f` · `#344054` | `#d1d5db` · `hsl(215 20% 65%)` |
| Heading ink | `#f7f7f7` | `#0c0e12` |
| Body ink | `#cecfd2` | `#344054` |
| Muted ink | `#85888e` | `hsl(215 16% 44%)` |
| **A-side — the watcher** *(type)* | `#00c8ff` 9.9:1 | `#00769d` 5.2:1 |
| A-side fill / glow | `#00c8ff` | `#009cd4` |
| **B-side — the buyer** *(type)* | `#826AFB` 5.0:1 | `#625df5` 4.8:1 |
| B-side fill / glow | `#4F2DEA` | `#4F2DEA` |
| The emphasis accent *(unused in v2)* | `#ff5d8b` | `#d7004b` 5.3:1 |
| The armed ceiling / the key that crosses | `#fde272` | `#854a0e` 7.0:1 |
| The confirmed order | `#22c55e` | `#095c37` 8.0:1 |

⛔ **`#4F2DEA` is a fill, a stroke and a glow — never type on the dark ground** (2.67:1). On
white it passes at 7.2:1 and may be type. Type uses `#826AFB` (dark) / `#625df5` (light).

⭐ **Green is the success family** (owner, 2026-09-13). It carries the `ALWAYS PRECISE` stamp in
F4 and the confirmed order in F7 — both are successes, and under the positive register that is
one signal, not two. ⛔ It appears nowhere else. The red/pink accent is consequently unused in
v2; it stays in the table because the tokens file owns it, not because the reel spends it.

⭐ The gradient `#4F2DEA → #00c8ff` is the A→B journey and appears only on the mark and the
arrow between the two names.

## The mark

`assets/mark.svg` — the shared system mark, 1254², 110 paths. `assets/mark-avatar.png` is the
blue-disc variant, used wherever the mark sits on an uncertain ground (the bot avatar in F4).

- The mark appears in **F1** (built), **F2** (as the browser favicon), **F4** (as the bot
  avatar), **F5** (small, centred above the two cards) and **F8** (the closing lockup).
- ⛔ **Never apply `--brand-mark-filter`.** The light theme sets it to `invert(1)`, correct for
  the monochrome wordmark it was written for and catastrophic on a full-colour illustration.
- The mark is unmodified in both cuts. Its near-white interior (`#F0EEFE`, `#EDEAFD`) sits
  inside a violet outline that carries it on white; on the dark ground it gets a soft violet
  bloom behind it rather than any recolour.

## Typography

- Display: `Inter`, 700–800, tracking `-0.03em`
- Code, money, identifiers, counters: `JetBrains Mono`, 500–700
- Labels: uppercase, `0.16em` tracking, 18–20px
- Minimums: display 64px, statement 34px, mono body 26px, metadata 18px

Both vendored as local WOFF2 under `assets/fonts`. ⛔ No network fetch at render time.

## Scene plan

Every frame must sit in **real UI furniture** — a window, a surface, a chrome. A frame carried
by typography alone is a defect in this cut.

| # | t | Beat | Its UI |
|---|---|---|---|
| F1 | 0.0–4.2 | **The mark.** Built, then it becomes the favicon. | the mark itself, then a browser tab |
| F2 | 4.2–11.0 | **One price. Nineteen in the payload.** | full browser: tabs, URL, toolbar, a data table, a devtools payload drawer |
| F3 | 11.0–17.6 | **The watcher runs.** | full terminal: title bar, tab, prompt, log stream, a status line |
| F4 | 17.6–23.2 | **The alert.** `ALWAYS PRECISE`, in success green. | Telegram: chat header, bubble, avatar, tick marks |
| F5 | 23.2–30.4 | **The handoff.** Longest hold. | two app cards facing each other, no divider |
| F6 | 30.4–36.6 | **The walk.** The divider draws here. | the JSONL history panel · the divider · browser + 5-step stepper, cursor, budget meter |
| F7 | 36.6–41.0 | **You approve the payment.** | history panel persists · order card + Pix panel + a ticking hold |
| F8 | 41.0–45.0 | **The count.** | a stat surface, then the closing lockup |

## Motion character

- Deliberate and instrumented, never breathless. Things *resolve* rather than fly in.
- **The divider belongs only to the frames that actually have two columns** (owner,
  2026-09-13): it draws in at F6, persists through F7, and retracts at F8. ⛔ Not in F5 —
  there the two cards *are* the columns and a line between them is noise; ⛔ not in F8, where
  one centred column makes it an artifact. Its length is 581px, two thirds of the frame
  height, centred on the midline.
- Numbers count up in mono and stop on a real value; nothing rolls past its own figure.
- Transitions are luma wipes and vertical travel, plus one match cut (F1→F2).

## Do

- Keep every figure checkable against the repos: `228` + `196` tests, `7` nights, order
  `6731D321`, `R$ 352,00`, Pix in `5.49s`, walk `18.37s` against a `45s` budget.
- **Name the site.** `buyticketbrasil.com` is shown in full in the address bar — it is linked
  publicly from `ticket-autobuy`'s own README, and the owner lifted the elision on 2026-09-13.
- Let the divider carry the meaning; the type only names what it separates.

## Do not

- ⛔ Do not phrase any claim as a refusal — see **Voice** above.
- ⛔ Do not imply the tool pays, bypasses a queue, stores a card, or logs in on its own.
- ⛔ Do not show a real CPF, phone, address, session cookie, bot token, or chat id.
- ⛔ Do not show a seller's identity or a real listing owner.
- ⛔ Do not invent an interface. The reel may depict a terminal, a Telegram thread, a browser
  under Playwright and a JSON payload — the surfaces these tools genuinely touch. There is no
  price-watcher dashboard, settings panel or analytics app, and inventing one would contradict
  the case-study record's own `featured: false` reasoning ("zero design evidence").
- ⛔ Do not invent a metric. Every number on screen exists in the repos or the project memory.
- ⛔ Do not fetch fonts, assets, or data at render time.
- ⛔ Do not use `Date.now()` or `Math.random()` — the render must be frame-deterministic.

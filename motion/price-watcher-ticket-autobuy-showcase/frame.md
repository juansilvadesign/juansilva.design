# Frame: price-watcher + ticket-autobuy — Showcase

## Purpose

One silent reel serving three surfaces: the hero of **both** repository READMEs
(`juansilvadesign/price-watcher`, `juansilvadesign/ticket-autobuy`) and the hero of the
joint case study on `juansilva.design`. It is one video because the two projects are one
system, and the thing worth showing is the **line between them**.

It must land two claims in a single viewing, in this order:

1. **The boundary is the design.** One tool watches and structurally cannot buy; the other
   holds the browser and the risk. They talk through a `buy` block in a target file that the
   watcher parses and ignores.
2. **It closed.** The pipeline is not a diagram — it completed end to end against a live
   hostile site, and the last step was deliberately handed to a human.

⛔ It is **not** a feature list, and it is **not** "I built a ticket bot". The asset being
shown is *systems that survive contact with hostile production*.

## Format

- Canvas: 1920 × 1080, 16:9
- Duration: 20 seconds
- Frame rate: 30 fps
- Delivery: H.264 MP4, an animated WebP for the GitHub READMEs, and a PNG poster
- Context: GitHub README and a case-study hero; legible without audio, captions, or a replay

## Palette

Taken from the portfolio's own `design-system/tokens.css` — the site is dark-themed and the
reel must not read as a different brand.

| Token | Value | Use |
|---|---|---|
| Ground | `#0c0e12` | Canvas, everywhere |
| Panel | `#13161b` | Cards, terminal, matrix rows |
| Panel raised | `#1a1d24` | Highlighted row, proof card |
| Border | `#22262f` | Hairlines, card edges |
| Border strong | `#344054` | Active edges, the divider |
| Heading ink | `#f7f7f7` | Display type |
| Body ink | `#cecfd2` | Secondary statements |
| Muted ink | `#85888e` | Metadata, labels, units |
| Primary cyan | `#00c8ff` | The watcher, routes, focus, the count-ups |
| Cyan light | `#2cd6ff` | Highlights on cyan |
| Pink | `#ff0059` | The refusal — `NEVER BUYS`, the crossed line |
| Amber | `#fde272` | The armed ceiling, the thing under watch |
| Green | `#22c55e` | Only on the confirmed order. Nowhere else. |

⛔ Green appears exactly once, on the real order. Spending it earlier makes the one moment
that is genuinely a success read as decoration.

## Typography

- Display: `Inter`, weight 700–800, tracking `-0.03em`
- Code, money, identifiers, counters: `JetBrains Mono`, weight 500–700
- Labels: uppercase, `0.16em` tracking, 18–20px
- Minimum sizes: display 64px, statement 34px, mono body 26px, metadata 18px

Both families are vendored as local WOFF2 under `assets/fonts`. ⛔ No network fetch at render
time — the render must be reproducible offline.

## Scene plan

| # | t | Beat |
|---|---|---|
| S1 | 0.0–3.8 | **The market.** The page shows one price. The payload holds nineteen. The panel opens and the matrix is there — this is why a CSS scraper would be worse than useless. |
| S2 | 3.8–7.6 | **The watcher.** `watch.py` polls, a record falls, `lowest_ever` fires to Telegram. Stamped `stdlib only · 0 dependencies` and `NEVER BUYS`. |
| S3 | 7.6–12.4 | **The line.** Two columns, one divider. The only thing that crosses is a `buy` block the watcher ignores. This is the centre of the piece and gets the longest hold. |
| S4 | 12.4–16.6 | **It closed.** The buyer walks the checkout, the Pix code arrives, and the order card resolves — then states it was left unpaid on purpose. |
| S5 | 16.6–20.0 | **The count.** 424 tests, 7 nights, 1 real order. Both repo names, side by side, with the line still drawn between them. |

## Motion character

- Deliberate and instrumented, never breathless. Things *resolve* rather than fly in.
- The vertical divider in S3 is drawn once and then **persists** into S5 — the line is the
  argument, so it should be the last thing on screen.
- Numbers count up in mono and stop on a real value; nothing rolls past its own figure.
- Transitions are luma wipes and vertical travel, matching the sibling `upos-lp-app-showcase`.

## Do

- Keep every figure checkable against the repos: `228` + `196` tests, `7` nights, order
  `6731D321`, `R$ 352,00`, Pix in `5.49s`, walk `18.37s` against a `45s` budget.
- Keep `NEVER BUYS` and `left unpaid on purpose` legible — they are the honesty of the piece.
- Let the divider carry the meaning; the type only names what it separates.

## Do not

- ⛔ Do not imply the tool pays, bypasses a queue, stores a card, or logs in on its own.
- ⛔ Do not show a real CPF, phone, address, session cookie, bot token, or chat id.
- ⛔ Do not show buyticketbrasil branding, a seller's identity, or a real listing owner.
- ⛔ Do not invent a metric. Every number on screen exists in the repos or the project memory.
- ⛔ Do not fetch fonts, assets, or data at render time.
- ⛔ Do not use `Date.now()` or `Math.random()` — the render must be frame-deterministic.

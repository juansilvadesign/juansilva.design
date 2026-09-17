# AllPrice — source audit

Prepared 2026-09-16–17. Source preparation is complete for the proposed storyboards.
This is not a video-render or publication approval.

## What motion adds — Gate 0

- Main: a viewer follows the entire landing-page explanation from its opening
  promise to pricing, answers, and footer, with real scrolling and interactions.
- Remediation: a matched visual comparison reveals the change in document
  structure while showing that the design intent was preserved.
- Responsive: the same content is shown in two real layouts, including horizontally
  browsable cards, instead of implying responsiveness with a scaled screenshot.
- Interactions: action → visible response → return demonstrates the mobile menu
  and FAQ behavior that a still cannot show.

## Sources and provenance

- Figma document: AllPrice-Spaceapps; landing-page page `1484:3`.
- Transport: local talk-to-figma-fork MCP, `--channel=4hj86qf7`.
- Runtime compatibility checked: server `r3.2.1-server-cbd2531f8a0e`, plugin
  `r3.2.1-plugin-ad75ba5fe779`, schema 1.21.0, compatible fingerprints.
- Original composite: node `1489:7245`, 1280×10584 at 1×.
- Optimized composite: node `1830:1121`, 1280×10637 at 1×; section exports at 2×.
- Export receipt list: `capture/figma-exports.json`; raw metadata and export
  receipts in `.media/figma-cache/`. Figma designs were not modified.
- Live source: https://allprice-lp.juanpablosilva.com.br/ — Juan's preserved React
  mirror, not the former production origin and not the WordPress v1.
- Automated capture: HyperFrames 0.8.43, successful HTTP 200, 16 screenshots and
  43 extracted assets. Optional vision captions disabled. Asset cap dropped 20
  catalog candidates and one asset was unavailable; supplementary browser captures
  verified all 20 rendered image elements decoded, with no page errors.
- Browser captures: light mode, desktop 1440×900 at DPR 2; mobile 390×844 at DPR 2.
- Asserted page heights: desktop 11279 CSS px; mobile 15607 CSS px. Mobile document
  width is 390 CSS px, with no document-level horizontal overflow.
- Desktop eight strips overlap by 120 CSS px and cover 0–11279 without a gap.
- Full-page offset and state receipts: `capture/live-metadata.json` and
  `capture/interaction-metadata.json`. Asset SHA-256s: `capture/source-files.json`.
- Additional inspected mobile section plates cover all audience cards and both
  full plan cards; geometry and decode receipt: `capture/mobile-section-metadata.json`.

## Source truth and safe framing — Gate 1

Contact sheets in `review/` were inspected, including matched original/optimized
hero composites and the new menu, feature-scroll and FAQ states. Archive exports
are retained, not silently cleaned. Selected camera-resting surfaces are the
headlines, marketing explanatory cards, actual pricing cards, and FAQ answers.

| Source issue | Treatment in the proposed videos |
| --- | --- |
| Original isolated hero omits dashboard siblings | Reject `original-hero.png` as comparison media; use matching crops from the complete original and optimized frames. |
| Dashboard contains old illustrative dates and inconsistent number formatting | Traverse in context; no metric close-up, number animation, or business-results claim. Hero reading holds stop above dashboard figures. |
| Pricing-table illustration has repeated rows and dummy store identifier | Show it within the landing-page tour, moving through the region; rest on the clean heading/explanation, not identifiers or duplicated rows. |
| Repeated testimonial names, photos and copy | Traverse the section to satisfy the complete-page requirement, without a quotation, customer-count claim, or testimonial hold. This is source-page content, not verified social proof. |
| Early FAQ shots clipped the heading | Use `desktop-faq-framed-closed.png` / `desktop-faq-framed-open.png`; older files are archival. |
| Case-study prose mentions billing toggles | Live source has two fixed plan cards. No invented billing toggle. Leave the unrelated record unchanged at this stage. |
| Figma metadata omits auto-layout fields | Show observed types/names and 32 mixed direct children vs 12 section-level frames. Do not claim the export measured auto-layout settings. |
| Mobile menu links leave the preserved site | Show open/close only; do not sign in, register, contact support, or simulate those destinations. |

The pipeline's clean-frame rule is applied to **resting crops**. Full-page
traversal necessarily retains the listed original source imperfections; this
framing decision is explicit in the storyboard approval proposal.

## Measured desktop coverage

| Region | Document Y | Height (CSS px, rounded) |
| --- | ---: | ---: |
| Header | 0 | 86 |
| Hero | 86 | 1360 |
| Blue banner | 1446 | 96 |
| Audiences | 1542 | 1125 |
| ERP / Bling / Tiny | 2667 | 1260 |
| Features | 3927 | 1013 |
| Pricing-workflow illustration | 4940 | 1270 |
| Alerts | 6210 | 549 |
| Monthly and annual plans | 6759 | 1557 |
| Testimonials | 8316 | 955 |
| FAQ | 9271 | 1448 |
| Footer | 10719 | 560 |

The header is sticky. Its late-scroll bounding box in raw geometry is not its
normal-flow document position. Keep header, page track and outer camera separate.
At 1440×900 the final scroll position is 10379, exposing the complete footer.

## Verified interactions

- Desktop feature scroller: width 1168, scroll width 1614; left 0 → right 446.
- Mobile feature scroller: left 0 → right 1256. Five headings: Precificação,
  Avisos em tempo real, Vendas, Cadastro, Saúde e evolução.
- FAQ question 2 expands; desktop document height grows 11279 → 11360. Question
  4 was also tested and captured, but is not selected for the current main cut.
- Mobile hamburger opens the actual account/support modal; its visible X closes
  it. The page under the modal is not interactive until dismissal.
- Header logo is an internal `#inicio` link. Signup/login links are external and
  were not followed. No backend/app product workflow was captured or implied.

## Attribution

The source of record is `workspace/juansilva.design/_config/portfolio/records/allprice.json`.
Credit Juan for landing-page remediation and responsive React implementation.
Thiago originated the landing-page design; the product UI, Bubble backend and
integrations belong to the wider team. No retained conversion metrics exist.
The three supporting loops are proposed at the remediation and front-end sections
of the case study; no WordPress → React performance comparison is claimed.

## Pending gates

Storyboard approval → wireframe approval → animation preview approval → final
render/encode QA. Upload, content-record changes and deployment remain separately
user-gated. There are no completed video deliverables yet.

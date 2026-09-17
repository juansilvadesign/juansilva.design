# AllPrice — shared motion asset contract

Shared across four films. All paths are project-relative. These imports already
exist. The scene-prefixed motion layers, reveal mattes and design notes live in
each film's storyboard; this registry supplies their real pixels/data.

| Asset ID | Import filename | Use / motion-design note |
| --- | --- | --- |
| BRAND_symbol | assets/figma/brand-symbol.png | Original raster mark. No hand-redrawn logo or fictitious product badge. |
| UI01 | assets/live/desktop-hero.png | 1440×900 CSS at 2×; clean hero hold above dashboard figures. Header crop is separate from scroll. |
| UI02 | assets/live/desktop-strip-00.png | Document Y=0, H=1600 CSS; main page track, source image at 2×. |
| UI03 | assets/live/desktop-strip-01.png | Y=1480, H=1600; exact overlap with previous strip. |
| UI04 | assets/live/desktop-strip-02.png | Y=2960, H=1600; ERP and feature entry. |
| UI05 | assets/live/desktop-strip-03.png | Y=4440, H=1600; features and pricing-workflow entry. |
| UI06 | assets/live/desktop-strip-04.png | Y=5920, H=1600; pricing-workflow tail, alerts, plans. |
| UI07 | assets/live/desktop-strip-05.png | Y=7400, H=1600; plan tail and testimonial entry. |
| UI08 | assets/live/desktop-strip-06.png | Y=8880, H=1600; testimonial tail and FAQ. |
| UI09 | assets/live/desktop-strip-07.png | Y=10360, H=919; remaining FAQ and complete footer. |
| UI10 | assets/live/desktop-features-left.png | Real feature rail at horizontal 0; keep a separate rail matte. |
| UI11 | assets/live/desktop-features-right.png | Same surface at horizontal 446; no invented sixth category. |
| UI12 | assets/live/desktop-faq-framed-closed.png | Corrected matched FAQ composition, Y=9181. |
| UI13 | assets/live/desktop-faq-framed-open.png | Question 2 open; answer changes page height by 81 CSS px. |
| UI14 | assets/live/desktop-pricing.png | Real fixed-card tops; use page strips for the full card lengths. |
| UI15 | assets/live/mobile-hero.png | Real 390×844 CSS at 2×; not a scaled desktop crop. |
| UI16 | assets/live/mobile-comofunciona-full.png | Entire stacked audience section, 390×2289 CSS at 2×; own vertical track. |
| UI17 | assets/live/mobile-features-left.png | Mobile feature rail at horizontal 0, if needed in revision. |
| UI18 | assets/live/mobile-features-right.png | Same rail at horizontal 1256, if needed in revision. |
| UI19 | assets/live/mobile-pricing-full.png | Complete two-plan vertical stack, 390×2802 CSS at 2×. |
| UI20 | assets/live/mobile-menu-open.png | Real modal open over hero; source X closes it. |
| UI21 | assets/live/mobile-faq.png | Real mobile closed FAQ, available for revision. |
| UI22 | assets/live/mobile-faq-open.png | Real mobile expanded FAQ, available for revision. |
| UI23 | assets/figma/original-desktop-full.png | Original complete composite, 1280×10584; use matching top 0–410 crop in remediation. |
| UI24 | assets/figma/optimized-desktop-full.png | Optimized complete composite, 1280×10637; same crop in remediation. |
| DATA_hierarchy | capture/figma-hierarchy.json | Source node names/types/counts for an explicitly editorial structure diagram. |
| DATA_page_geometry | capture/live-metadata.json | Desktop/mobile geometry and strip positioning; not user-facing metrics. |
| DATA_interactions | capture/interaction-metadata.json | Exact state coordinates and scroller endpoints. |
| DATA_mobile_sections | capture/mobile-section-metadata.json | Full mobile-section crop coordinates and decode confirmation. |

## Import and authoring constraints

1. Original UI remains raster evidence. Do not redraw the page, its logo, app
   dashboard, testimonials, charts, or pricing table.
2. Real customer, marketplace and ERP marks already embedded in these source
   pixels stay unchanged. The generic preset's placeholder fallback does not
   replace known source assets.
3. Derive bounded crops before rendering long composites. Record parent filename,
   SHA, crop rectangle and output dimensions; inspect each new resting crop.
4. For multiple image instances, make explicitly named local file copies at build
   time rather than reusing one `src` across several mounted images. Source assets
   above remain immutable. Derivatives must enter the local media manifest.
5. Keep camera perspective, scale, viewport mask, vertical scroll and horizontal
   feature track separate. Preserve sticky headers.
6. At state changes, animate only the measured region and displacement. Do not
   dissolve whole screens to imply an interaction that did not occur.
7. Text and editorial cursor/diagram shapes are authored layers, not source UI.
   Every reveal has its named matte. No new photos, generated imagery, audio,
   stock device render, backend response or external service is needed.

Additional archive captures and SHA-256 inventory:
`capture/extracted/asset-descriptions.md`, `capture/source-files.json`.
Visual inspection notes and exclusions: `SOURCE_AUDIT.md`.

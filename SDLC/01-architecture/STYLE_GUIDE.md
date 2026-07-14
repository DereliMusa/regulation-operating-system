# Certra Style Guide

The single source of truth for Certra's visual design. Every screen must conform to it.
Its code counterparts are `app/assets/css/main.css` (CSS `@theme` tokens) and
`app.config.ts` (NuxtUI theme). Tokens here are extracted verbatim from the approved
mockups in `eski-veriler/certa-mvp/*/code.html` and `eski-veriler/certa-web-sitesi/*`.

Design philosophy: **calm, precise, reliable** — a technical/scientific professional tool.
Rely on 1px hairline borders and tonal layers rather than heavy shadows.

> **Resolved: design-source reconciliation (owner decision).** Where the mockups and
> `eski-veriler/taslak.md` disagree:
> - **Colors & radius: use taslak.md.** Primary `#2456E6`, AI `#6D5AE6`, radius card 10 /
>   button 8 / chip 6, background `#F5F7FA`, ink `#0E1B2C`.
> - **Icons: use Material Symbols** (from the mockups), via Iconify.
>
> Note: the mockup screenshots render primary as `#003dc1`; the implementation follows the
> taslak tokens above, so the built app's blue is slightly lighter than the screenshots.
> The tables below reflect this resolved decision.

## 1. Color tokens

### Brand / primary
| Token | Hex |
|---|---|
| primary | `#2456E6` |
| primary-ink (hover/pressed) | `#1B45C4` |
| primary-wash | `#EAF0FF` |
| secondary | `#535f73` |

### AI / tertiary (used only for AI-generated content)
| Token | Hex |
|---|---|
| ai | `#6D5AE6` |
| ai-wash | `#F0EDFD` |

### Status (text / background pairs)
| Status | Text | Background |
|---|---|---|
| draft | `#6B7688` | `#EEF1F5` |
| review | `#B9770A` | `#FBF1DE` |
| approved | `#1E8E5A` | `#E7F5EE` |
| deficiency | `#C43D3D` | `#FBE9E9` |
| error | `#ba1a1a` | `#ffdad6` |

### Surfaces / text
| Token | Hex |
|---|---|
| surface | `#FFFFFF` |
| surface-2 (alt / zebra) | `#FAFBFC` |
| background (bg) | `#F5F7FA` |
| line (1px borders) | `#E4E9F0` |
| ink (text) | `#0E1B2C` |
| ink-soft | `#55627A` |
| ink-muted | `#8A94A6` |

**Severity mapping** (risk/finding): critical/high -> deficiency red; major/moderate/medium
-> review amber; minor/low -> draft gray; resolved/approved -> approved green.

## 2. Typography

Families: **Geist** (headings/display), **Inter** (body/UI), **Geist Mono** (IDs, refs, code).

| Role | Font | Size | Weight | Line-height |
|---|---|---|---|---|
| Display | Geist | 32px | 600 | 40px |
| H1 | Geist | 24px | 600 | 32px |
| H2 | Geist | 20px | 600 | 28px |
| H3 | Geist | 16px | 600 | 24px |
| Body | Inter | 14px | 400 | 22px |
| Body-strong | Inter | 14px | 500 | 22px |
| Small | Inter | 13px | 400 | 20px |
| Caption (UPPERCASE) | Inter | 12px | 500 | 16px, letter-spacing 0.04em |
| Mono | Geist Mono | 13px | 500 | 20px |

All IDs and regulatory references (device ids, GSPR refs, RISK-xxx, LOG-xxx, traceability
chips) use **Geist Mono**.

## 3. Spacing, radius, layout

- Spacing grid (4px base): 4, 8, 12, 16, 24, 32, 48, 64; gutter 24px.
- Border radius: card/panel 10px, input/button 8px, chip/badge 6px, avatar full. No oval/pill excess.
- Layout: 12-column fluid grid, max content width 1280px, 24px gutters.
- Density: Comfortable rows 44px, Compact 36px (tables support both).
- App shell: fixed left sidebar (~240px), fixed topbar (~56px).

## 4. Iconography

- **Material Symbols Outlined**, delivered via Iconify (`i-material-symbols-*`).
- Default settings: weight 400, optical size ~20, unfilled; AI marker `auto_awesome` is filled.
- Common icons: `dashboard`, `description`, `report_problem`, `analytics`, `biotech`,
  `history`, `settings`, `help_outline`, `add`, `search`, `filter_list`, `sort`,
  `file_download`, `notifications`, `more_vert`, `check_circle`, `pending`, `flag`,
  `auto_awesome`, `verified`.

## 5. Core components (anatomy)

- **StatusBadge** — pill; uppercase caption text; status text+bg pair; subtle 1px border.
- **SeverityBadge** — like StatusBadge, mapped to severity colors.
- **TraceabilityChip** — mono text, `surface-container` bg, 1px `line` border; may render
  as a linked sequence (e.g. `REQ-021 -> TEST-88`).
- **ReadinessRing / ReadinessBar** — progress in primary; ring shows percent + "Ready".
- **AiPanel** — `ai-wash` background, 4px left border in tertiary, `auto_awesome` icon,
  a label like "AI VERIFICATION NEEDED", and a confidence percentage. Used **only** for
  AI-generated/assisted content, never for human-authored content.
- **DataTable** — header row `surface-alt` + uppercase caption in `ink-muted`; 44px rows
  (comfortable) / 36px (compact); 1px `line` dividers; hover `surface-alt`; mono IDs in
  primary; two-line cells (title + subtext).
- **BentoCard** — white surface, 1px `line` border, 12px radius, 16-32px padding; large
  display number + label + optional trend.
- **Buttons** — primary: `#003dc1` bg, white text, 8px radius, subtle hover; secondary:
  `line` border, `on-surface-variant` text; AI actions use tertiary (purple).

## 6. App shell

- **Sidebar nav** (top -> bottom): logo + "Regulatory Suite"; primary "+ New Submission";
  Dashboard, Technical Documentation, Risk Management, Clinical Evaluation, Post-Market,
  Audit Log; then Settings, Support. Active item: primary text, `primary-wash` background,
  2px primary right border.
- **Topbar**: breadcrumb (e.g. Workspace > Dashboard); "Search technical files..."; a
  context action ("Verify AI" / "Export"); notifications bell; user avatar.
- **Footer**: brand + tagline; Product / Solutions / Compliance / Resources / Privacy /
  Terms links.
- **Marketing shell** (public pages) uses a distinct top nav (logo, Product/Solutions/
  Pricing, Sign in, Book a demo) and a 4-column footer, sharing the same tokens.

## 7. Motion

- Transitions ~0.2s ease. Table rows: hover highlight (subtle). Buttons: active scale ~0.98,
  hover opacity/bg shift. Keep motion minimal and functional.

## 8. Accessibility

- Body text and UI must meet WCAG AA contrast (>= 4.5:1). `ink-muted` (`#8A94A6`) is for
  secondary text only, not for essential small text on white.
- Never encode meaning by color alone: pair status colors with a text label.
- All interactive elements keyboard-focusable with a visible focus ring (2px primary at
  ~30% opacity). Form inputs have associated labels.

## 9. Do / Don't

- Do use tokens; never hardcode ad-hoc hex values in components.
- Do reserve purple (tertiary/ai-wash) exclusively for AI content.
- Do use Geist Mono for every ID/reference.
- Don't add drop shadows where a 1px border suffices.
- Don't mix icon sets; Material Symbols only.
- Don't introduce new fonts or colors without updating this guide first.

## 10. Design assets (needed from the owner)

To keep the product visually cohesive and avoid a generic "AI-made" look, the following
real assets are requested. Until provided, implementation proceeds with clearly-marked
placeholders.

**Handled internally (no owner action):** Geist/Inter/Geist Mono fonts (free, self-hosted),
Material Symbols icons (Iconify), initials-based user avatars, product screenshots (as the
app is built).

**Requested from the owner:**
1. **Logo** — Certra wordmark + icon/monogram, SVG (light/dark) + favicon. (MVP priority)
2. **Marketing imagery** — 3-5 professional photos (medical device / lab / regulatory /
   team); properly licensed stock (Unsplash/Pexels) is fine. (MVP)
3. **Social-proof decision** — are there real customer logos + a testimonial
   (name/title/photo/quote), or should these be clearly labelled as illustrative samples? (MVP)
4. **Trust badges** — ISO 13485 / HIPAA badge art **only if genuinely certified**;
   otherwise render honest text or omit (compliance/accuracy note). (MVP)
5. **Product demo video** — short screen capture. (optional, Phase 1)
6. **Custom module icons / illustrations** — optional; Material Symbols suffice for MVP.
7. **OG / social share image** — optional.

Integrity note: any certification, customer, or testimonial claim that is not real must be
labelled "sample" so the TUBITAK demo is never misleading.

## 11. Microcopy and writing (from taslak.md 1.8)

- Active verbs, sentence case: "Save changes", "Send for approval", "Generate draft".
- One action keeps one name end to end (a `Publish` button -> a `Published` toast).
- Name what the user controls, not the system internals.
- Error messages do not apologize; they say what happened and how to fix it.
- Empty states invite action and suggest one primary next step.
- UI text is English; documentation prose may be Turkish (see project language rule).

## 12. Additional component states (from taslak.md 1.7)

- **Buttons:** Primary (filled), Secondary (border), **Ghost** (transparent, hover
  `surface-alt`), **Danger** (deficiency red, destructive only). Sizes: sm 32 / md 40 / lg 44.
- **Inputs:** 40px height, `line` border, focus = primary border + focus ring; label above
  (caption), optional help text below (small, `ink-muted`); error = red border + red help.
- **Tabs:** underline style; active tab has primary underline + `on-surface` text.
- **Modal:** centered, max ~560px, shadow-md, overlay `rgba(14,27,44,.4)`.
- **Drawer:** slides from the right (detail/review), ~480-640px.
- **Toast:** bottom-right, ~4s, green left bar on success, red on error; copy matches the action.
- **Empty state:** icon + one guiding sentence + one primary action.

Focus ring: `0 0 0 3px rgba(36,86,230,.30)` on every interactive element (keyboard a11y).

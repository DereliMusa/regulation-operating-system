---
name: Certra Narrative
colors:
  surface: '#FFFFFF'
  surface-dim: '#d8dadd'
  surface-bright: '#f7f9fc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f7'
  surface-container: '#eceef1'
  surface-container-high: '#e6e8eb'
  surface-container-highest: '#e0e3e6'
  on-surface: '#191c1e'
  on-surface-variant: '#434655'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f4'
  outline: '#747687'
  outline-variant: '#c4c5d8'
  surface-tint: '#194fe0'
  primary: '#003dc1'
  on-primary: '#ffffff'
  primary-container: '#2456e6'
  on-primary-container: '#dbe0ff'
  inverse-primary: '#b7c4ff'
  secondary: '#535f73'
  on-secondary: '#ffffff'
  secondary-container: '#d6e3fb'
  on-secondary-container: '#596579'
  tertiary: '#482fbf'
  on-tertiary: '#ffffff'
  tertiary-container: '#604cd8'
  on-tertiary-container: '#e3ddff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b7c4ff'
  on-primary-fixed: '#001551'
  on-primary-fixed-variant: '#0039b5'
  secondary-fixed: '#d6e3fb'
  secondary-fixed-dim: '#bac7de'
  on-secondary-fixed: '#0f1c2d'
  on-secondary-fixed-variant: '#3b475a'
  tertiary-fixed: '#e5deff'
  tertiary-fixed-dim: '#c7bfff'
  on-tertiary-fixed: '#180065'
  on-tertiary-fixed-variant: '#4228ba'
  background: '#f7f9fc'
  on-background: '#191c1e'
  surface-variant: '#e0e3e6'
  surface-alt: '#FAFBFC'
  ink-soft: '#55627A'
  ink-muted: '#8A94A6'
  line: '#E4E9F0'
  primary-hover: '#1B45C4'
  primary-wash: '#EAF0FF'
  status-approved: '#1E8E5A'
  status-approved-bg: '#E7F5EE'
  status-review: '#B9770A'
  status-review-bg: '#FBF1DE'
  status-deficiency: '#C43D3D'
  status-deficiency-bg: '#FBE9E9'
  status-draft: '#6B7688'
  status-draft-bg: '#EEF1F5'
  ai-wash: '#F0EDFD'
typography:
  display:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  h1:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  h2:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  h3:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-strong:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 22px
  small:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.04em
  mono:
    fontFamily: Geist Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 20px
  display-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 24px
  container-max: 1280px
---

## Brand & Style

The design system is engineered for the high-stakes environment of MDR/IVDR regulatory compliance. It centers on three core pillars: **Calm, Precision, and Reliability**. The visual language is "Technical/Scientific Professional"—it avoids unnecessary decoration to focus on clarity, auditability, and data integrity.

The chosen style is **Modern Corporate with a Brutalist influence on structure**. It prioritizes "lines over shadows," using hairline borders to define space and hierarchy. This creates a "breathable" but data-dense environment that feels like a precision instrument. A signature "Traceability Thread" (thin connecting lines) visually reinforces the link between risks, requirements, and evidence, ensuring the UI feels as interconnected as the regulations it manages. 

AI-generated content is treated as a distinct "guest" in the UI, marked by a specific purple identity to maintain transparency until human verification occurs.

## Colors

The palette is intentionally "cold and clean," utilizing a narrow range of blues and grays to maintain a professional focus.

- **Primary (Signal Blue):** Reserved for interactive elements, primary CTAs, and active navigation states.
- **Ink (Neutral):** The primary typography color (`#0E1B2C`) provides high contrast against the paper-white surfaces.
- **Functional Status:** These are semantically rigid. **Green** (Approved), **Amber** (Review), and **Red** (Deficiency) must be used exclusively for compliance status and never for decorative purposes.
- **AI Identity:** The **Purple** (`#6D5AE6`) accent is a reserved "Identity" color. Any component or text block suggested by AI must utilize this hue to distinguish it from human-verified data.
- **Surface Hierarchy:** The background uses a cold gray-white (`#F5F7FA`), while primary interactive surfaces (cards/rows) are pure white (`#FFFFFF`) to create a subtle layered effect without relying on heavy shadows.

## Typography

The system employs a tri-font strategy to balance technical precision with readability. 

- **Geist** is used for headings and display elements, providing a modern, geometric, and technical character.
- **Inter** is the workhorse for UI and body text, chosen for its exceptional legibility in data-dense tables and complex forms.
- **Geist Mono** is essential for "Traceability Chips," GSPR/ISO reference codes, and audit trail IDs. This monospaced font signals to the user that they are looking at a unique identifier or a specific regulatory reference.

**Scale & Constraints:**
- Use **Sentence case** for all UI labels, buttons, and headers.
- **Uppercase** is strictly reserved for the `caption` style (table headers and small labels).
- On mobile, `display` titles should scale down to `24px` to ensure readability without excessive wrapping.

## Layout & Spacing

This design system is built on a strict **4px base grid**. All margins, paddings, and component heights must be multiples of 4.

**Grid System:**
- **Desktop:** 12-column fluid grid with 24px gutters and a maximum container width of 1280px. 
- **Navigation:** A fixed left sidebar (240px) is standard for application navigation, allowing the main content area to remain fluid.

**Density Modes:**
The system supports two density modes for data-intensive views:
- **Comfortable:** Row heights of 44px (default).
- **Compact:** Row heights of 36px (for audit matrices and large tables).

**Traceability Thread:**
Vertical and horizontal spacing must accommodate the "Traceability Thread"—1px solid lines (`--line`) that connect related data points across cards or table rows. Elements should align strictly to the 4px grid to ensure these lines connect seamlessly without visual breaks.

## Elevation & Depth

In alignment with the "Precision" principle, hierarchy is primarily conveyed through **Tonal Layers and Borders** rather than shadows.

- **Surface Tiers:**
    - **Level 0 (Background):** `#F5F7FA` - The canvas.
    - **Level 1 (Surface):** `#FFFFFF` - Primary cards and panels.
    - **Level 2 (Active/Alt):** `#FAFBFC` - Used for zebra-striping in tables or secondary panels.
- **Borders:** 1px hairline strokes using `--line` (`#E4E9F0`) are the primary method of separation. 
- **Shadows (Minimal):** 
    - Use `--shadow-sm` for very subtle lift on primary buttons or small popovers.
    - Use `--shadow-md` only for floating elements that sit above the main UI, such as Modals and Dropdown Menus.
- **Focus States:** High-visibility 3px rings in Signal Blue with 30% opacity must surround all interactive elements to ensure accessibility.

## Shapes

The shape language is professional and structured. While the `roundedness` is set to "2" (8px), specific components follow a hierarchy of corner radii to indicate their role:

- **10px (Large):** Cards, Main Panels, and Modals.
- **8px (Standard):** Buttons and Input Fields.
- **6px (Small):** Status Badges and Chips.
- **0px (Sharp):** Bottom borders of active tabs and the "Traceability Thread" connectors.

**Prohibition:** Avoid "Pill-shaped" or excessively rounded buttons/inputs, as they detract from the "Scientific Professional" aesthetic. The only exception is User Avatars, which are circular.

## Components

**Buttons:**
- Primary buttons use Signal Blue with 8px radius.
- Secondary buttons use a 1px `--line` border and `--ink` text.
- No pill shapes; icons should be 20px with 1.5px stroke.

**Traceability Chips:**
- Use `Geist Mono` typography.
- Small 6px radius.
- Backgrounds use `--surface-2` or `--primary-wash`.
- Often connected by 1px lines to other chips to represent a "Thread."

**Input Fields:**
- 8px radius with a 1px `--line` border.
- On focus, apply the Signal Blue focus ring.
- Labels use `Body-strong` for high legibility.

**Status Badges:**
- Use the semantic color palette (Approved, Review, Deficiency, Draft).
- Text color should be the dark "Ink" variant of the status color, while the background is the "Wash" variant (e.g., `#1E8E5A` text on `#E7F5EE` background).

**AI Suggested Panels:**
- Must feature a 1px solid border in `--ai` (Purple).
- The background may use a very light purple wash (`--ai-wash`).
- A "Suggested by AI" badge must be present in the top-right corner.

**Tables:**
- Use `Caption` style for headers (Uppercase).
- Row heights follow the 44px/36px density rules.
- 1px horizontal dividers between rows; no vertical dividers except for the Traceability Thread.
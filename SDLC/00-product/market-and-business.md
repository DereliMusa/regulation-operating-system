# Market & Business Context

Business background captured from the TUBITAK 1812 BiGG application. Figures here are
**application claims to verify** before external use, not settled facts (see
[`../05-references/regulatory-references.md`](../05-references/regulatory-references.md)).

## Project identity

- **Project title:** "LLM-based Medical Regulatory Compliance Assessment and Quality
  Management Platform" (TR: Buyuk Dil Modeli Tabanli Medikal Regulasyona Uygunluk
  Degerlendirme ve Kalite Yonetim Platformu).
- **Program:** TUBITAK 1812 BiGG, CUBE Incubation (Teknopark Istanbul), call BiGG 2026-2.
- **Activity area:** Health and Well-being (Saglik ve Iyi Yasam).
- **Positioning:** An AI-embedded "Compliance Operating System" for MDR/IVDR — not a generic
  ERP/eQMS.

## Team

- **Musa Dereli** — founder / developer (~4 years software experience; full-stack, UI/UX,
  digital marketing, AI-wrapper and AI-assisted decision systems; prior company). Owns
  product development and company management.
- **Dr. Baris Oguz Gurses** — advisor; faculty at Ege University (Mechanical Engineering);
  medical devices and mechatronics; product lifecycle management. Advises on product
  development, PLM, and documentation management.
- **Mehmet Seckin** — advisor; medical-device development/sales/R&D since 2020; founded a
  1512 BiGG company. Advises on applying and structuring MDR/IVDR processes.

## Product framing (5 sub-components, from the application)

1. Electronic form application (data entry + visualization UI).
2. Process & workflow engine (registry/ledger of MDR/IVDR-defined processes).
3. Automation (watches the ledger and auto-creates sub-tasks/documents per MDR/IVDR).
4. Decision-support: an LLM-based assistant **plus a rule-based expert system**; output is
   the technical file. (Note: the "expert system" is a distinct component alongside the LLM.)

The MVP mocks the AI/automation; real LLM + expert-system logic is Phase 1+
(see [`../01-architecture/adr/005-mock-ai-for-mvp.md`](../01-architecture/adr/005-mock-ai-for-mvp.md)).

## Market (claims to verify)

- EU medical-device manufacturers: ~27,000-33,000 (worldwide 50,000+); ~6,000-8,000 actively
  developing new products; ~69% SMEs (<250 staff), ~12% startups.
- Compliance cost has risen up to ~100% vs old directives (MedTech Europe 2024): Class IIa
  ~EUR 40k-60k; Class III up to ~EUR 500k.
- eQMS/regulatory software market: ~USD 3-5B today, ~10-15% CAGR, ~USD 7-10B by 2030.
- Serviceable estimate: ~30,000 EU MDR/IVDR firms x ~EUR 16,900/yr ~= EUR 0.5B/yr.
- Target: first 3 years ~150-300 local/regional SMEs ~= EUR 2.5-5M/yr.

Primary segment: SMEs/startups making higher-risk devices (Class IIb/III, IVDR C/D),
preparing a technical file for the first time or with limited resources.

## Competitive landscape

- **General eQMS/PLM:** MasterControl, Greenlight Guru, Veeva Vault, Arena PLM, Sparta
  Systems, Siemens Teamcenter — large, costly, long to deploy, not MDR/IVDR-file-specific.
- **Closer / medical:** OpenRegulatory Formwork (MDR, template-based eQMS), Qualio AI
  (life-sciences cloud QMS + AI) — not the same end-to-end technical-file capability.
- **Reality today:** most manufacturers use Excel/Word/Drive/SharePoint plus consultants.
- **Gap Certra targets:** no productized, end-to-end MDR/IVDR technical-file platform,
  especially locally/regionally.

## Business model

Three-tier SaaS subscription + AI usage credits + services (setup/migration/training/
validation). Tiers and prices: [`pricing.md`](pricing.md). Reference inspiration for
transparent pricing: SimplerQMS.

## Intellectual property strategy

- No patent/utility model filed yet.
- Primary protection: trade secret, proprietary data/know-how, first-mover advantage.
- Potential future patents to investigate: the **change-impact-analysis engine**, the
  **risk-test-clinical traceability** logic, and the **auditor simulation** method.
- Also: trademark, software copyright, and open-source license compliance.

## Differentiators (summary)

Embedded AI agent (gap detection, GSPR/classification suggestions, CER drafts); auditor
simulation ("what would an auditor ask?"); one platform unifying forms + workflow +
automation + expert system + AI; electronic clinical-data collection; integrated literature
search; live traceability + change-impact; instant readiness score; minimalist UI to reduce
human error. Detail in [`vision.md`](vision.md).

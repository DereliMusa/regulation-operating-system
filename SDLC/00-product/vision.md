# Product Vision

## One-liner

Certra is an **AI-assisted compliance operating system for MDR/IVDR technical
documentation** — it helps medical-device manufacturers build technical files that are
complete, traceable, and ready to pass Notified Body review.

Positioning: not a generic eQMS. Certra is purpose-built around the regulatory artifacts
(technical file, GSPR, risk, clinical evaluation, post-market) and the links between them.

## The problem

Bringing a medical device to the EU market under Regulation (EU) 2017/745 (MDR) or
2017/746 (IVDR) requires a large, interconnected technical file. Today, for most SMEs and
startups:

- Documentation is assembled by hand across Word, Excel, and shared drives, often via
  external consultants.
- A large share of first-time submissions come back significantly incomplete; a single
  missing standard or requirement can cost many months of certification delay.
- There is no reliable **traceability** between requirements and evidence
  (GSPR <-> risk <-> test <-> clinical), so gaps and change impacts are hard to see.
- Revision cycles are long and expensive.

> The specific market figures cited in the TUBITAK application (survey percentages,
> delay estimates, market size) live in `05-references/regulatory-references.md` and
> should be treated as claims to verify, not settled facts.

## Who it is for

Primary: **SMEs and startups** building medical devices / IVDs, especially higher-risk
classes (MDR IIb/III, IVDR C/D) where the compliance burden is greatest. Inside those
companies the daily users are **Regulatory Affairs (RA)** and **Quality Assurance (QA)**.

Secondary: compliance consultants, and (later) Notified Body reviewers.

See [`personas.md`](personas.md).

## Value proposition

"MDR/IVDR technical files, built to pass." One platform for:

- Technical file construction (structured, modular data capture).
- GSPR conformity mapping to evidence.
- ISO 14971 risk management.
- Traceability across requirements, risk, test, and clinical evidence.
- AI drafting of regulatory documents (CER, GSPR rationale, risk report, PSUR/PMCF).
- **Auditor Simulation**: an AI that reviews the file like an auditor and surfaces
  deficiencies before the real audit.
- Change control, approvals, and post-market surveillance.

## The AI stance (important product principle)

AI is a **drafting and review assistant, never an unattended author**. Every AI output is
watermarked ("AI draft") and must be human-reviewed and approved before it becomes part of
the technical file. This "AI draft -> human review -> approved" loop is a core trust and
compliance principle, and it shapes the UI (purple AI panels, confidence scores, explicit
Verify actions).

In the MVP, AI is **mocked** (deterministic rules and templates) so the experience is
demonstrable without external model dependencies. Real model integration lands in Phase 1.
See [`../01-architecture/adr/005-mock-ai-for-mvp.md`](../01-architecture/adr/005-mock-ai-for-mvp.md).

## Differentiators

1. **Traceability-first data model** — the links are first-class, not an afterthought.
2. **Auditor Simulation** — pre-audit gap detection is the headline sales argument.
3. **Regulatory-native**, purpose-built modules rather than a generic document manager.

## What success looks like

- Near term: a working prototype that demonstrates the core story for the TUBITAK 1812
  BiGG evaluation (see [`roadmap.md`](roadmap.md)).
- Medium term: pilots with regional SME manufacturers.
- Long term: a sellable, multi-tenant SaaS, with potential expansion into other
  heavily-regulated industries.

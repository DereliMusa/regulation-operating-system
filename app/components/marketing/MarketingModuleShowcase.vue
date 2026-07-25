<script setup lang="ts">
// Module bento grid (approved mockup). "AI Suggested" content follows the
// AI-panel convention (STYLE_GUIDE: purple reserved for AI-generated content).
</script>

<template>
  <section id="modules" class="scroll-mt-16 bg-canvas py-20">
    <div class="mx-auto max-w-[1280px] px-6">
      <div class="mb-10 max-w-xl">
        <h2 class="mb-2 font-display text-3xl font-semibold text-ink">Modular excellence</h2>
        <p class="text-ink-soft">
          Deep-dive into the modules built to handle the complexity of modern medical device regulations.
        </p>
      </div>

      <div class="grid grid-cols-1 gap-6 md:grid-cols-12">
        <div class="rounded-card border border-line bg-surface p-8 md:col-span-8">
          <span class="mb-2 block font-mono text-xs uppercase text-brand-500">Module 01</span>
          <h3 class="mb-3 text-xl font-semibold text-ink">Technical File Builder</h3>
          <p class="mb-6 max-w-md text-ink-soft">
            Structured GSPR management with automated cross-referencing to standards and clinical data.
          </p>
          <ul class="space-y-2">
            <li class="flex items-center gap-2 text-sm text-ink">
              <UIcon name="i-material-symbols-check-circle" class="size-[18px] text-status-approved" />
              Dynamic technical file structure
            </li>
            <li class="flex items-center gap-2 text-sm text-ink">
              <UIcon name="i-material-symbols-check-circle" class="size-[18px] text-status-approved" />
              Version tracking and readiness scoring
            </li>
          </ul>
        </div>

        <div class="relative rounded-card border border-ai/20 bg-ai-wash p-8 md:col-span-4">
          <span class="absolute right-4 top-4 rounded border border-ai/20 bg-white/50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ai">
            AI Suggested
          </span>
          <span class="mb-2 block font-mono text-xs uppercase text-ai">Module 02</span>
          <h3 class="mb-3 text-xl font-semibold text-ai">AI Document Generation</h3>
          <p class="mb-6 text-ink-soft">Draft CERs and PMCF plans in minutes with a specialized regulatory AI assistant.</p>
          <div class="rounded-btn border border-line bg-white p-4 shadow-sm">
            <div class="mb-2 h-2 w-full overflow-hidden rounded-full bg-surface-2">
              <div class="h-full w-3/4 animate-pulse bg-ai" />
            </div>
            <p class="font-mono text-[11px] italic text-ink-muted">Generating clinical summary...</p>
          </div>
        </div>

        <div class="rounded-card border border-line bg-surface p-8 md:col-span-4">
          <span class="mb-2 block font-mono text-xs uppercase text-brand-500">Module 03</span>
          <h3 class="mb-3 text-lg font-semibold text-ink">Traceability Thread</h3>
          <p class="mb-4 text-ink-soft">Link every risk to a requirement and every requirement to a test result.</p>
          <div class="flex flex-col gap-2 py-2">
            <div class="flex items-center gap-2">
              <div class="h-6 w-24 rounded border border-brand-500/20 bg-primary-wash" />
              <div class="h-px flex-1 bg-line" />
              <div class="h-6 w-24 rounded border border-status-approved/20 bg-status-approved-bg" />
            </div>
            <div class="ml-12 flex items-center gap-2">
              <div class="h-6 w-24 rounded border border-status-review/20 bg-status-review-bg" />
              <div class="h-px flex-1 bg-line" />
              <div class="h-6 w-20 rounded border border-line bg-surface-2" />
            </div>
          </div>
        </div>

        <div class="rounded-card border border-line bg-surface p-8 md:col-span-4">
          <span class="mb-2 block font-mono text-xs uppercase text-brand-500">Module 04 &amp; 05</span>
          <h3 class="mb-3 text-lg font-semibold text-ink">Lifecycle Management</h3>
          <p class="mb-4 text-ink-soft">Real-time impact analysis for design changes and continuous surveillance signal detection.</p>
          <div class="grid grid-cols-2 gap-2">
            <div class="rounded border border-line bg-surface-2 p-2">
              <span class="font-mono text-[10px] text-ink-muted">ACTIVE SIGNALS</span>
              <div class="text-lg font-semibold text-status-deficiency">02</div>
            </div>
            <div class="rounded border border-line bg-surface-2 p-2">
              <span class="font-mono text-[10px] text-ink-muted">OPEN CHANGES</span>
              <div class="text-lg font-semibold text-brand-500">14</div>
            </div>
          </div>
        </div>

        <div class="rounded-card border border-dashed border-line bg-surface p-8 md:col-span-4">
          <span class="mb-2 block font-mono text-xs uppercase text-ink-soft">Module 06</span>
          <h3 class="mb-3 text-lg font-semibold text-ink">Auditor Simulation</h3>
          <p class="mb-4 text-ink-soft">Stress-test your technical file against common Notified Body findings before submission.</p>
          <div class="flex items-center justify-center gap-2 rounded border border-line bg-surface-2 py-2 text-sm font-medium text-ink">
            <UIcon name="i-material-symbols-terminal" class="size-[18px]" />
            Run pre-audit scan
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

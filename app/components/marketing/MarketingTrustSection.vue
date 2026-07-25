<script setup lang="ts">
// "Human-in-the-loop AI" trust section (approved mockup). Reinforces the
// core product principle: AI drafts, a human always reviews and approves
// (see SDLC/00-product/vision.md "The AI stance").
</script>

<template>
  <section class="bg-surface py-24">
    <div class="mx-auto flex max-w-[1280px] flex-col items-center gap-16 px-6 lg:flex-row">
      <div class="lg:w-1/2">
        <h2 class="mb-4 font-display text-4xl font-semibold text-ink">
          Verified precision: the human-in-the-loop AI.
        </h2>
        <p class="mb-8 text-lg text-ink-soft">
          Regulatory compliance cannot be left to a black box. Certra's AI acts as a specialized
          assistant, drafting content and flagging inconsistencies, but every final decision
          remains in the hands of the expert.
        </p>
        <div class="space-y-6">
          <div class="flex gap-4">
            <div class="flex size-12 shrink-0 items-center justify-center rounded-btn bg-primary-wash">
              <UIcon name="i-material-symbols-psychology" class="size-6 text-brand-500" />
            </div>
            <div>
              <h4 class="mb-1 font-semibold text-ink">Specialized regulatory AI</h4>
              <p class="text-sm text-ink-soft">
                Drafts grounded in MDR/IVDR guidance and harmonized standards, always watermarked as AI-generated.
              </p>
            </div>
          </div>
          <div class="flex gap-4">
            <div class="flex size-12 shrink-0 items-center justify-center rounded-btn bg-ai-wash">
              <UIcon name="i-material-symbols-history-edu" class="size-6 text-ai" />
            </div>
            <div>
              <h4 class="mb-1 font-semibold text-ink">Immutable audit trail</h4>
              <p class="text-sm text-ink-soft">
                Every AI suggestion, human review, and approval is timestamped for full auditability.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="relative w-full lg:w-1/2">
        <div class="flex aspect-square items-center justify-center rounded-card border border-line bg-surface-2 p-8">
          <div class="w-full max-w-sm">
            <div class="z-0 -rotate-3 rounded-card border border-ai/20 bg-ai-wash p-6 shadow-lg">
              <div class="mb-4 flex items-center gap-2">
                <span class="size-3 animate-pulse rounded-full bg-ai" />
                <span class="font-mono text-xs text-ai">AI SUGGESTION ENGINE</span>
              </div>
              <div class="space-y-2">
                <div class="h-2 w-full rounded bg-ai/10" />
                <div class="h-2 w-5/6 rounded bg-ai/10" />
                <div class="h-2 w-4/6 rounded bg-ai/10" />
              </div>
            </div>
            <div class="relative z-10 -mt-16 ml-12 rotate-2 rounded-card border border-line bg-surface p-6 shadow-xl">
              <div class="mb-4 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <UIcon name="i-material-symbols-person" class="size-5 text-brand-500" />
                  <span class="font-medium text-ink">Regulatory lead</span>
                </div>
                <span class="rounded bg-status-approved-bg px-2 py-0.5 font-mono text-[10px] text-status-approved">VERIFIED</span>
              </div>
              <div class="flex h-24 items-center justify-center rounded-btn border border-dashed border-line bg-surface-2 text-sm italic text-ink-muted">
                Reviewing AI technical draft...
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

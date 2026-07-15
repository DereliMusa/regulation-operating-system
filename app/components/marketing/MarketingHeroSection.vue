<script setup lang="ts">
// Landing hero (approved mockup: eski-veriler/certa-web-sitesi/certra_product_overview).
// The product-screen preview is a stylized CSS mock, not a real screenshot or
// stock photo — those are still open items from the owner (STYLE_GUIDE section 10).
</script>

<template>
  <section class="bg-surface-2 py-20">
    <div class="mx-auto grid max-w-[1280px] items-center gap-12 px-6 lg:grid-cols-2">
      <div class="max-w-xl">
        <div class="mb-4 inline-flex items-center gap-2 rounded-full border border-ai/20 bg-ai-wash px-3 py-1.5">
          <UIcon name="i-material-symbols-auto-awesome" class="size-4 text-ai" />
          <span class="text-xs font-medium uppercase tracking-wider text-ai">Built for MDR &amp; IVDR excellence</span>
        </div>
        <h1 class="mb-4 font-display text-5xl font-semibold leading-[1.1] tracking-tight text-ink">
          MDR &amp; IVDR technical files, <span class="italic text-brand-500">built to pass.</span>
        </h1>
        <p class="mb-8 text-lg leading-relaxed text-ink-soft">
          Stop wasting months on manual documentation. Certra uses AI-driven traceability to
          generate audit-ready technical files in weeks, not years.
        </p>
        <div class="flex flex-wrap gap-3">
          <UButton to="/book-a-demo" size="lg">
            Book a demo
          </UButton>
          <UButton href="#modules" variant="outline" color="neutral" size="lg">
            See the product
          </UButton>
        </div>
      </div>

      <div class="relative">
        <div class="overflow-hidden rounded-card border border-line bg-surface shadow-xl">
          <div class="flex items-center justify-between border-b border-line bg-surface-2 px-4 py-2.5">
            <div class="flex gap-1.5">
              <span class="size-2.5 rounded-full bg-status-deficiency/40" />
              <span class="size-2.5 rounded-full bg-status-review/40" />
              <span class="size-2.5 rounded-full bg-status-approved/40" />
            </div>
            <span class="font-mono text-xs text-ink-muted">technical_file_v2.4</span>
          </div>
          <div class="space-y-3 p-6">
            <div class="h-3 w-2/3 rounded bg-surface-2" />
            <div class="h-3 w-1/2 rounded bg-surface-2" />
            <div class="mt-4 grid grid-cols-3 gap-2">
              <div class="h-16 rounded-chip border border-line bg-status-approved-bg" />
              <div class="h-16 rounded-chip border border-line bg-status-review-bg" />
              <div class="h-16 rounded-chip border border-line bg-surface-2" />
            </div>
          </div>
        </div>
        <div class="absolute -bottom-6 -left-6 rounded-card border border-line bg-surface p-4 shadow-lg">
          <div class="flex items-center gap-3">
            <div class="flex size-10 items-center justify-center rounded-full bg-status-approved-bg">
              <UIcon name="i-material-symbols-check-circle" class="size-5 text-status-approved" />
            </div>
            <div>
              <div class="font-semibold text-brand-500">100% Traceability</div>
              <div class="text-xs text-ink-muted">Ready for Notified Body review</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

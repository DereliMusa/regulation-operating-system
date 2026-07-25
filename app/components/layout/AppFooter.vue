<script setup lang="ts">
// Slim in-app footer (STYLE_GUIDE 6): brand + copyright + tagline. The full
// marketing link footer lives in MarketingFooter for the public pages.
const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-line bg-surface">
    <div class="mx-auto flex max-w-[1280px] flex-col gap-1 px-4 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-6">
      <div class="flex items-center gap-1.5">
        <UIcon name="i-material-symbols-biotech" class="size-4 text-brand-500" />
        <span class="font-display text-sm font-semibold text-ink">Certra</span>
        <span class="text-[13px] text-ink-muted">Regulatory Suite</span>
      </div>
      <p class="text-[13px] text-ink-muted">
        &copy; {{ year }} Certra. AI-assisted MDR/IVDR compliance.
      </p>
    </div>
  </footer>
</template>

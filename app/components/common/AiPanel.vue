<script setup lang="ts">
// AI-content wrapper (STYLE_GUIDE 5): ai-wash background, 4px tertiary left
// border, filled auto_awesome marker, a label, and an optional confidence
// percentage. Reserved for AI-generated / AI-assisted content only.
withDefaults(defineProps<{
  label?: string
  confidence?: number
}>(), { label: 'AI verification needed' })
</script>

<template>
  <section class="relative overflow-hidden rounded-card border border-ai/20 bg-ai-wash p-4">
    <div class="absolute inset-y-0 left-0 w-1 bg-ai" />
    <header class="mb-3 flex items-center justify-between gap-3 pl-2">
      <div class="flex items-center gap-2">
        <UIcon name="i-material-symbols-auto-awesome" class="size-5 text-ai" />
        <span class="text-[12px] font-medium uppercase tracking-[0.04em] text-ai">{{ label }}</span>
      </div>
      <span
        v-if="confidence !== undefined"
        class="shrink-0 rounded-chip border border-ai/20 bg-white/60 px-2 py-0.5 font-mono text-[11px] text-ai"
      >
        Confidence {{ confidence }}%
      </span>
    </header>
    <div class="pl-2 text-sm text-ink-soft">
      <slot />
    </div>
  </section>
</template>

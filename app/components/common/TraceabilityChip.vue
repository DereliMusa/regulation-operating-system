<script setup lang="ts">
// Traceability reference(s) in Geist Mono. A single ref renders as a primary
// chip; multiple refs render as a linked sequence (e.g. REQ-021 -> TEST-88),
// the first primary, the rest neutral (STYLE_GUIDE 5).
const props = defineProps<{ refs: string | string[] }>()

const items = computed(() => (Array.isArray(props.refs) ? props.refs : [props.refs]))
</script>

<template>
  <div class="flex flex-wrap items-center gap-1">
    <template v-for="(ref, index) in items" :key="ref">
      <UIcon
        v-if="index > 0"
        name="i-material-symbols-arrow-right-alt"
        class="size-3.5 shrink-0 text-ink-muted"
      />
      <span
        class="inline-flex items-center gap-0.5 rounded-chip border px-1.5 py-0.5 font-mono text-[11px]"
        :class="index === 0
          ? 'border-brand-500/20 bg-primary-wash text-brand-500'
          : 'border-line bg-surface-2 text-ink-soft'"
      >
        <UIcon v-if="index === 0" name="i-material-symbols-link" class="size-3" />
        {{ ref }}
      </span>
    </template>
  </div>
</template>

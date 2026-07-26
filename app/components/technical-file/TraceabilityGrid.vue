<script setup lang="ts">
import type { TraceMatrix, TraceNode } from '#shared/types/traceability'
import { nodeTone } from '~/utils/traceability'
import { TONE_SOLID } from '~/utils/badges'
// GSPR (rows) x Risk (cols) coverage grid (FR-TRC-2). Presentational: a check
// marks a traced cell; clicking a header selects that artifact for change-impact,
// and selected/impacted headers are highlighted by the parent's ids.
defineProps<{
  matrix: TraceMatrix
  selectedId: string | null
  impactedIds: Set<string>
}>()
const emit = defineEmits<{ select: [string] }>()

function headerClass(node: TraceNode, selectedId: string | null, impacted: Set<string>): string {
  if (node.id === selectedId) return 'bg-brand-500 text-white ring-2 ring-brand-500'
  if (impacted.has(node.id)) return 'bg-primary-wash text-brand-500'
  return 'bg-surface-2 text-ink-soft hover:bg-primary-wash hover:text-brand-500'
}
</script>

<template>
  <div class="overflow-x-auto rounded-card border border-line">
    <table class="w-full border-collapse text-left">
      <thead>
        <tr class="border-b border-line">
          <th scope="col" class="bg-surface-2 px-3 py-2.5 text-[11px] font-medium uppercase tracking-[0.04em] text-ink-muted">
            GSPR \ Risk
          </th>
          <th
            v-for="col in matrix.cols"
            :key="col.id"
            scope="col"
            class="border-l border-line p-1.5 text-center"
          >
            <button
              type="button"
              :title="col.label"
              class="inline-flex items-center gap-1 rounded-chip px-2 py-1 font-mono text-[11px] transition-colors"
              :class="headerClass(col, selectedId, impactedIds)"
              @click="emit('select', col.id)"
            >
              <span class="size-1.5 rounded-full" :class="TONE_SOLID[nodeTone(col)]" />
              {{ col.ref }}
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="matrix.rows.length === 0 || matrix.cols.length === 0">
          <td :colspan="matrix.cols.length + 1" class="px-4 py-10 text-center text-sm text-ink-muted">
            Not enough linked GSPR and risk records to build a matrix yet.
          </td>
        </tr>
        <tr
          v-for="(row, r) in matrix.rows"
          :key="row.id"
          class="border-b border-line last:border-0"
        >
          <th scope="row" class="p-1.5 text-left">
            <button
              type="button"
              :title="row.label"
              class="inline-flex w-full items-center gap-1.5 rounded-chip px-2 py-1 text-left font-mono text-[11px] transition-colors"
              :class="headerClass(row, selectedId, impactedIds)"
              @click="emit('select', row.id)"
            >
              <span class="size-1.5 shrink-0 rounded-full" :class="TONE_SOLID[nodeTone(row)]" />
              {{ row.ref }}
            </button>
          </th>
          <td
            v-for="(linked, c) in matrix.cells[r]"
            :key="matrix.cols[c]!.id"
            class="border-l border-line text-center align-middle"
            :class="(selectedId === row.id || selectedId === matrix.cols[c]!.id) && linked ? 'bg-primary-wash' : ''"
          >
            <UIcon
              v-if="linked"
              name="i-material-symbols-check"
              class="size-4 text-brand-500"
              :aria-label="`${row.ref} traced to ${matrix.cols[c]!.ref}`"
            />
            <span v-else class="text-ink-muted/40" aria-hidden="true">·</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

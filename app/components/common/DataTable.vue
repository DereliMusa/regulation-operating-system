<script setup lang="ts" generic="T extends Record<string, unknown>">
import type { DataTableColumn } from '~/utils/table'
// Generic data table (STYLE_GUIDE 5): surface-2 header with uppercase captions,
// hairline row dividers, hover highlight, mono IDs in primary. Per-column
// content can be overridden with a slot named after the column key, receiving
// { row, value }.
const props = withDefaults(defineProps<{
  columns: DataTableColumn[]
  rows: T[]
  density?: 'comfortable' | 'compact'
  rowKey?: keyof T
  emptyLabel?: string
}>(), { density: 'comfortable', emptyLabel: 'No records to show.' })

const rowPadding = computed(() => (props.density === 'compact' ? 'py-2' : 'py-3'))

function keyFor(row: T, index: number): string | number {
  return props.rowKey ? (row[props.rowKey] as string | number) : index
}

function alignClass(align?: 'left' | 'right' | 'center'): string {
  if (align === 'right') return 'text-right'
  if (align === 'center') return 'text-center'
  return 'text-left'
}
</script>

<template>
  <div class="overflow-x-auto rounded-card border border-line">
    <table class="w-full border-collapse text-left">
      <thead>
        <tr class="border-b border-line bg-surface-2">
          <th
            v-for="col in columns"
            :key="col.key"
            scope="col"
            class="px-4 py-2.5 text-[12px] font-medium uppercase tracking-[0.04em] text-ink-muted"
            :class="[alignClass(col.align), col.width]"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="rows.length === 0">
          <td :colspan="columns.length" class="px-4 py-10 text-center text-sm text-ink-muted">
            <slot name="empty">{{ emptyLabel }}</slot>
          </td>
        </tr>
        <tr
          v-for="(row, index) in rows"
          :key="keyFor(row, index)"
          class="border-b border-line transition-colors last:border-0 hover:bg-surface-2"
        >
          <td
            v-for="col in columns"
            :key="col.key"
            class="px-4 align-middle text-sm text-ink"
            :class="[rowPadding, alignClass(col.align), col.mono ? 'font-mono text-brand-500' : '']"
          >
            <slot :name="col.key" :row="row" :value="resolveCellValue(row, col.key)">
              {{ resolveCellValue(row, col.key) }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

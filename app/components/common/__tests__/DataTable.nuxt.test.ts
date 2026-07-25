// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import type { DataTableColumn } from '~/utils/table'
import DataTable from '../DataTable.vue'

const columns: DataTableColumn[] = [
  { key: 'riskId', label: 'Risk ID', mono: true },
  { key: 'hazard', label: 'Hazard' },
]

const rows = [
  { riskId: 'RISK-001', hazard: 'Overheating' },
  { riskId: 'RISK-002', hazard: 'Leakage' },
]

describe('DataTable', () => {
  it('renders a header cell per column and a row per record', async () => {
    const wrapper = await mountSuspended(DataTable, { props: { columns, rows } })
    expect(wrapper.findAll('thead th')).toHaveLength(2)
    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
    expect(wrapper.text()).toContain('RISK-001')
    expect(wrapper.text()).toContain('Overheating')
  })

  it('renders the empty state when there are no rows', async () => {
    const wrapper = await mountSuspended(DataTable, {
      props: { columns, rows: [], emptyLabel: 'No entries yet' },
    })
    expect(wrapper.findAll('tbody tr')).toHaveLength(1)
    expect(wrapper.text()).toContain('No entries yet')
  })
})

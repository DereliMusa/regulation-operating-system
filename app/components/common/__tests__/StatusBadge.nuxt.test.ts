// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import StatusBadge from '../StatusBadge.vue'
import SeverityBadge from '../SeverityBadge.vue'

describe('StatusBadge', () => {
  it('renders a humanized label with the matching tone classes', async () => {
    const wrapper = await mountSuspended(StatusBadge, { props: { status: 'in_review' } })
    expect(wrapper.text()).toBe('In review')
    expect(wrapper.html()).toContain('text-status-review')
  })

  it('accepts an explicit label override', async () => {
    const wrapper = await mountSuspended(StatusBadge, { props: { status: 'approved', label: 'Signed off' } })
    expect(wrapper.text()).toBe('Signed off')
    expect(wrapper.html()).toContain('text-status-approved')
  })
})

describe('SeverityBadge', () => {
  it('maps a severity to its tone (STYLE_GUIDE mapping)', async () => {
    const wrapper = await mountSuspended(SeverityBadge, { props: { severity: 'critical' } })
    expect(wrapper.text()).toBe('Critical')
    expect(wrapper.html()).toContain('text-status-deficiency')
  })
})

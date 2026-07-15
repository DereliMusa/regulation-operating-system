<script setup lang="ts">
// Public marketing footer (STYLE_GUIDE section 6). The column items below
// name topics from the approved mockup, but most don't have a real page yet
// (Solutions/Pricing and company/legal pages are Phase 1 — see
// SDLC/00-product/scope.md) so they render as plain labels rather than dead
// links until those pages exist.
const columns = [
  { title: 'Product', items: ['Modules', 'Integrations', 'Security'] },
  { title: 'Solutions', items: ['MDR strategy', 'IVDR migration', 'Class III devices'] },
  { title: 'Compliance', items: ['ISO 13485', 'Part 11', 'GDPR'] },
  { title: 'Resources', items: ['Whitepapers', 'Webinars', 'Help center'] },
]
</script>

<template>
  <footer class="border-t border-line bg-surface">
    <div class="mx-auto max-w-[1280px] px-6 py-12">
      <div class="grid grid-cols-2 gap-8 md:grid-cols-6">
        <div class="col-span-2">
          <span class="mb-3 block font-display text-xl font-semibold text-ink">Certra</span>
          <p class="max-w-xs text-sm text-ink-soft">
            AI-assisted MDR/IVDR technical documentation, built to pass Notified Body review.
          </p>
        </div>
        <div v-for="column in columns" :key="column.title">
          <h5 class="mb-3 font-medium text-ink">{{ column.title }}</h5>
          <ul class="space-y-2">
            <li v-for="item in column.items" :key="item" class="text-sm text-ink-muted">
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
      <div class="mt-10 flex flex-col items-center justify-between gap-4 border-t border-line pt-6 md:flex-row">
        <p class="text-sm text-ink-muted">&copy; 2026 Certra. All rights reserved.</p>
        <UButton to="/book-a-demo" variant="soft" size="sm">
          Book a demo
        </UButton>
      </div>
    </div>
  </footer>
</template>

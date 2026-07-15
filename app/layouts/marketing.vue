<script setup lang="ts">
// Public marketing shell: sticky nav + content + footer (STYLE_GUIDE section 6).
</script>

<template>
  <div class="flex min-h-screen flex-col bg-canvas">
    <MarketingNav />
    <main class="flex-1">
      <slot />
    </main>
    <MarketingFooter />
  </div>
</template>

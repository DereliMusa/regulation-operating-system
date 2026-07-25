<script setup lang="ts">
// Public marketing top nav (STYLE_GUIDE section 6). Solutions and Pricing
// are Phase 1 pages (see SDLC/00-product/scope.md); only "Product" (an
// in-page anchor to the module showcase) is shown until those pages exist.
</script>

<template>
  <header class="sticky top-0 z-50 h-16 border-b border-line bg-surface">
    <div class="mx-auto flex h-full max-w-[1280px] items-center justify-between px-6">
      <div class="flex items-center gap-8">
        <NuxtLink to="/" class="flex items-center gap-1.5">
          <UIcon name="i-material-symbols-biotech" class="size-7 text-brand-500" />
          <span class="font-display text-xl font-semibold tracking-tight text-ink">Certra</span>
        </NuxtLink>
        <nav class="hidden items-center gap-6 md:flex">
          <a href="#modules" class="font-medium text-ink-soft transition-colors hover:text-brand-500">Product</a>
        </nav>
      </div>
      <div class="flex items-center gap-4">
        <UButton to="/login" variant="ghost" color="neutral" class="hidden sm:inline-flex">
          Sign in
        </UButton>
        <UButton to="/book-a-demo">
          Book a demo
        </UButton>
      </div>
    </div>
  </header>
</template>

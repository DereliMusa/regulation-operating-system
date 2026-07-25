<script setup lang="ts">
// Authenticated app shell: fixed sidebar + sticky topbar + content + footer
// (STYLE_GUIDE 6 "App shell"). Applied per page via
// definePageMeta({ layout: 'app' }).
</script>

<template>
  <div class="min-h-screen bg-canvas">
    <AppSidebar />
    <div class="flex min-h-screen flex-col lg:pl-[240px]">
      <AppTopbar />
      <main class="flex-1">
        <div class="mx-auto w-full max-w-[1280px] p-4 lg:p-6">
          <slot />
        </div>
      </main>
      <AppFooter />
    </div>
  </div>
</template>

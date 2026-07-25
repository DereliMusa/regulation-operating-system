<script setup lang="ts">
// Full-screen layout for login/register pages (no sidebar/topbar).
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-canvas px-4">
    <div class="w-full max-w-sm">
      <div class="mb-8 text-center">
        <p class="font-display text-xl font-semibold text-ink">
          Certra
        </p>
        <p class="text-sm text-ink-muted">
          MDR/IVDR technical files, built to pass.
        </p>
      </div>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
// Placeholder public landing for S2 (auth). Replaced with the real
// marketing landing page in S8.
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-canvas px-4">
    <div class="max-w-md text-center">
      <p class="font-display text-2xl font-semibold text-ink">
        Certra
      </p>
      <p class="mb-6 text-ink-soft">
        MDR/IVDR technical files, built to pass.
      </p>
      <div class="flex justify-center gap-3">
        <UButton to="/login" variant="soft">
          Sign in
        </UButton>
        <UButton to="/register">
          Create account
        </UButton>
      </div>
    </div>
  </div>
</template>

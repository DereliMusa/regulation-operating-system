<script setup lang="ts">
// Placeholder guarded route for S2 (auth). Replaced with the real
// dashboard content in S4; the route, guard, and layout wiring stay.
definePageMeta({ middleware: ['auth'] })

const { user, clear } = useUserSession()

async function onSignOut() {
  await $fetch('/api/auth/logout', { method: 'POST' })
  await clear()
  await navigateTo('/login')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-canvas px-4">
    <UCard class="w-full max-w-sm text-center">
      <p class="text-sm text-ink-muted">
        Signed in as
      </p>
      <p class="font-display text-lg font-semibold text-ink">
        {{ user?.name }}
      </p>
      <p class="mb-4 text-sm text-ink-muted">
        {{ user?.email }}
      </p>
      <UButton color="neutral" variant="soft" block @click="onSignOut">
        Sign out
      </UButton>
    </UCard>
  </div>
</template>

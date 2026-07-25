<script setup lang="ts">
// Root component: renders the active layout (auth/app/marketing) and page.
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

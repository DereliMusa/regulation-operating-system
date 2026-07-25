<script setup lang="ts">
// Book a Demo (FR-MKT-2). Layout mirrors the approved mockup:
// eski-veriler/certa-web-sitesi/certra_book_a_demo/code.html.
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({ layout: 'marketing' })

const schema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(200),
  workEmail: z.string().email('Enter a valid work email'),
  company: z.string().max(200).optional(),
  role: z.enum(['ra_qa', 'founder_ceo', 'clinical', 'consultant']).optional(),
  regulationFocus: z.enum(['MDR', 'IVDR', 'both']).optional(),
  message: z.string().max(2000).optional(),
})

const roleOptions = [
  { label: 'RA / QA specialist', value: 'ra_qa' },
  { label: 'Founder / CEO', value: 'founder_ceo' },
  { label: 'Clinical affairs', value: 'clinical' },
  { label: 'Consultant', value: 'consultant' },
]

const regulationOptions = [
  { label: 'MDR', value: 'MDR' },
  { label: 'IVDR', value: 'IVDR' },
  { label: 'Both', value: 'both' },
]

const state = reactive<z.infer<typeof schema>>({
  fullName: '',
  workEmail: '',
})

const pending = ref(false)
const errorMessage = ref('')
const submitted = ref(false)

async function onSubmit(event: FormSubmitEvent<typeof state>) {
  pending.value = true
  errorMessage.value = ''

  try {
    await $fetch('/api/demo-requests', { method: 'POST', body: event.data })
    submitted.value = true
  }
  catch {
    errorMessage.value = 'Something went wrong submitting the form. Please try again.'
  }
  finally {
    pending.value = false
  }
}
</script>

<template>
  <div class="mx-auto grid max-w-[1280px] items-start gap-12 px-6 py-20 lg:grid-cols-12">
    <div class="flex flex-col gap-6 lg:col-span-5">
      <div class="inline-flex w-fit items-center gap-1.5 rounded-btn border border-ai/20 bg-ai-wash px-2.5 py-1 text-ai">
        <UIcon name="i-material-symbols-auto-awesome" class="size-[18px]" />
        <span class="font-mono text-xs">AI-DRIVEN COMPLIANCE</span>
      </div>
      <h1 class="font-display text-4xl font-semibold leading-tight text-ink">
        See Certra in action on your own files.
      </h1>
      <p class="max-w-md text-ink-soft">
        Automate clinical evaluations and auditor gap analysis with precision. Certra turns
        months of regulatory documentation into hours of verified output.
      </p>

      <div class="mt-2 space-y-5">
        <div class="flex gap-4">
          <div class="flex size-10 shrink-0 items-center justify-center rounded-btn border border-brand-500/10 bg-primary-wash text-brand-500">
            <UIcon name="i-material-symbols-description" />
          </div>
          <div>
            <h3 class="font-medium text-ink">Automated CER generation</h3>
            <p class="text-sm text-ink-muted">Clinical Evaluation Reports drafted against MEDDEV 2.7/1 Rev 4, human-reviewed before use.</p>
          </div>
        </div>
        <div class="flex gap-4">
          <div class="flex size-10 shrink-0 items-center justify-center rounded-btn border border-brand-500/10 bg-primary-wash text-brand-500">
            <UIcon name="i-material-symbols-rule" />
          </div>
          <div>
            <h3 class="font-medium text-ink">Auditor Simulation</h3>
            <p class="text-sm text-ink-muted">Stress-test your technical file against MDR/IVDR requirements before the real audit.</p>
          </div>
        </div>
        <div class="flex gap-4">
          <div class="flex size-10 shrink-0 items-center justify-center rounded-btn border border-brand-500/10 bg-primary-wash text-brand-500">
            <UIcon name="i-material-symbols-biotech" />
          </div>
          <div>
            <h3 class="font-medium text-ink">Scientific traceability</h3>
            <p class="text-sm text-ink-muted">Every claim maps back to its source across GSPR, risk, and clinical evidence.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="lg:col-span-7">
      <div class="rounded-card border border-line bg-surface p-8 shadow-sm">
        <template v-if="submitted">
          <div class="flex flex-col items-center py-12 text-center">
            <div class="mb-4 flex size-12 items-center justify-center rounded-full bg-status-approved-bg">
              <UIcon name="i-material-symbols-check-circle" class="size-6 text-status-approved" />
            </div>
            <h2 class="mb-2 text-lg font-semibold text-ink">Request received</h2>
            <p class="max-w-sm text-ink-soft">
              Thanks — we'll respond within 1 business day to schedule your demo.
            </p>
          </div>
        </template>

        <UForm v-else :schema="schema" :state="state" class="space-y-5" @submit="onSubmit">
          <UAlert v-if="errorMessage" color="error" variant="soft" :title="errorMessage" />

          <div class="grid gap-5 sm:grid-cols-2">
            <UFormField label="Full name" name="fullName">
              <UInput v-model="state.fullName" placeholder="Jane Doe" class="w-full" />
            </UFormField>
            <UFormField label="Work email" name="workEmail">
              <UInput v-model="state.workEmail" type="email" placeholder="jane@company.com" class="w-full" />
            </UFormField>
            <UFormField label="Company" name="company">
              <UInput v-model="state.company" placeholder="MedTech Inc." class="w-full" />
            </UFormField>
            <UFormField label="Role" name="role">
              <USelect v-model="state.role" :items="roleOptions" placeholder="Select a role" class="w-full" />
            </UFormField>
          </div>

          <UFormField label="Regulation focus" name="regulationFocus">
            <URadioGroup v-model="state.regulationFocus" :items="regulationOptions" orientation="horizontal" />
          </UFormField>

          <UFormField label="Message" name="message">
            <UTextarea v-model="state.message" :rows="3" placeholder="Tell us about your device or challenge..." class="w-full" />
          </UFormField>

          <UButton type="submit" block size="lg" :loading="pending" trailing-icon="i-material-symbols-arrow-forward">
            Schedule my demo
          </UButton>
        </UForm>

        <div v-if="!submitted" class="mt-6 flex items-center gap-2 border-t border-line pt-5 text-sm font-medium text-status-approved">
          <UIcon name="i-material-symbols-schedule" class="size-5" />
          We'll respond within 1 business day.
        </div>
      </div>
    </div>
  </div>
</template>

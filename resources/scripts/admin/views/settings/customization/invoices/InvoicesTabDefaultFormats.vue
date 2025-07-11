<template>
  <form @submit.prevent="submitForm">
    <h6 class="text-gray-900 dark:text-gray-200 text-lg font-medium">
      {{ $t('settings.customization.invoices.default_formats') }}
    </h6>
    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400 mb-2">
      {{ $t('settings.customization.invoices.default_formats_description') }}
    </p>

    <BaseInputGroup
      :label="$t('settings.customization.invoices.default_invoice_email_body')"
      class="mt-6 mb-4"
    >
      <BaseCustomInput
        v-model="formatSettings.invoice_mail_body"
        :fields="invoiceMailFields"
      />
    </BaseInputGroup>

    <BaseInputGroup
      :label="$t('settings.customization.invoices.company_address_format')"
      class="mt-6 mb-4"
    >
      <BaseCustomInput
        v-model="formatSettings.invoice_company_address_format"
        :fields="companyFields"
      />
    </BaseInputGroup>

    <BaseInputGroup
      :label="$t('settings.customization.invoices.shipping_address_format')"
      class="mt-6 mb-4"
    >
      <BaseCustomInput
        v-model="formatSettings.invoice_shipping_address_format"
        :fields="shippingFields"
      />
    </BaseInputGroup>

    <BaseInputGroup
      :label="$t('settings.customization.invoices.billing_address_format')"
      class="mt-6 mb-4"
    >
      <BaseCustomInput
        v-model="formatSettings.invoice_billing_address_format"
        :fields="billingFields"
      />
    </BaseInputGroup>

    <BaseButton
      :loading="isSaving"
      :disabled="isSaving"
      variant="primary"
      type="submit"
      class="mt-4"
    >
      <template #left="slotProps">
        <BaseIcon v-if="!isSaving" :class="slotProps.class" name="ArrowDownOnSquareIcon" />
      </template>
      {{ $t('settings.customization.save') }}
    </BaseButton>
  </form>
</template>

<script setup>
import { ref, reactive, inject } from 'vue'
import { useCompanyStore } from '@/scripts/admin/stores/company'

const companyStore = useCompanyStore()
const utils = inject('utils')

const invoiceMailFields = ref([
  'customer',
  'customerCustom',
  'invoice',
  'invoiceCustom',
  'company',
])

const billingFields = ref([
  'billing',
  'customer',
  'customerCustom',
  'invoiceCustom',
])

const shippingFields = ref([
  'shipping',
  'customer',
  'customerCustom',
  'invoiceCustom',
])

const companyFields = ref(['company', 'invoiceCustom'])

let isSaving = ref(false)

const formatSettings = reactive({
  invoice_mail_body: null,
  invoice_company_address_format: null,
  invoice_shipping_address_format: null,
  invoice_billing_address_format: null,
})

utils.mergeSettings(formatSettings, {
  ...companyStore.selectedCompanySettings,
})

async function submitForm() {
  isSaving.value = true

  let data = {
    settings: {
      ...formatSettings,
    },
  }

  await companyStore.updateCompanySettings({
    data,
    message: 'settings.customization.invoices.invoice_settings_updated',
  })

  isSaving.value = false

  return true
}
</script>

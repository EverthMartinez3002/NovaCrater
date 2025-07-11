<template>
  <div
    class="pt-6 mt-5 border-t border-solid lg:pt-8 md:pt-4 border-gray-200 dark:border-gray-700"
  >
    <!-- Basic Info -->
    <BaseHeading>
      {{ $t('customers.basic_info') }}
    </BaseHeading>

    <BaseDescriptionList>
      <BaseDescriptionListItem
        v-if="selectedViewCustomer.name"
        :content-loading="contentLoading"
        :label="$t('customers.display_name')"
        :value="selectedViewCustomer?.name"
      />

      <BaseDescriptionListItem
        v-if="selectedViewCustomer.contact_name"
        :content-loading="contentLoading"
        :label="$t('customers.primary_contact_name')"
        :value="selectedViewCustomer?.contact_name"
      />
      <BaseDescriptionListItem
        v-if="selectedViewCustomer.email"
        :content-loading="contentLoading"
        :label="$t('customers.email')"
        :value="selectedViewCustomer?.email"
      />
    </BaseDescriptionList>

    <BaseDescriptionList class="mt-5">
      <BaseDescriptionListItem
        :content-loading="contentLoading"
        :label="$t('wizard.currency')"
        :value="
          selectedViewCustomer?.currency
            ? `${selectedViewCustomer?.currency?.code} (${selectedViewCustomer?.currency?.symbol})`
            : ''
        "
      />

      <BaseDescriptionListItem
        v-if="selectedViewCustomer.phone"
        :content-loading="contentLoading"
        :label="$t('customers.phone_number')"
        :value="selectedViewCustomer?.phone"
      />
      <BaseDescriptionListItem
        v-if="selectedViewCustomer.website"
        :content-loading="contentLoading"
        :label="$t('customers.website')"
        :value="selectedViewCustomer?.website"
      />
    </BaseDescriptionList>

    <!-- Address -->
    <BaseHeading
      v-if="selectedViewCustomer.billing || selectedViewCustomer.shipping"
      class="mt-8"
    >
      {{ $t('customers.address') }}
    </BaseHeading>

    <BaseDescriptionList class="mt-5">
      <BaseDescriptionListItem
        v-if="selectedViewCustomer.billing"
        :content-loading="contentLoading"
        :label="$t('customers.billing_address')"
      >
        <BaseCustomerAddressDisplay :address="selectedViewCustomer.billing" />
      </BaseDescriptionListItem>

      <BaseDescriptionListItem
        v-if="selectedViewCustomer.shipping"
        :content-loading="contentLoading"
        :label="$t('customers.shipping_address')"
      >
        <BaseCustomerAddressDisplay :address="selectedViewCustomer.shipping" />
      </BaseDescriptionListItem>
    </BaseDescriptionList>

    <!-- Custom Fields -->
    <BaseHeading v-if="customerCustomFields.length > 0" class="mt-8">
      {{ $t('settings.custom_fields.title') }}
    </BaseHeading>

    <BaseDescriptionList class="mt-5">
      <BaseDescriptionListItem
        v-for="(field, index) in customerCustomFields"
        :key="index"
        :content-loading="contentLoading"
        :label="field.custom_field.label"
      >
        <p
          v-if="field.type === 'Switch'"
          class="text-sm font-bold leading-5 text-black non-italic dark:text-gray-200"
        >
          <span v-if="field.default_answer === 1"> {{ $t('general.yes') }} </span>
          <span v-else> {{ $t('general.no') }} </span>
        </p>
        <p
          v-else
          class="text-sm font-bold leading-5 text-black non-italic dark:text-gray-200"
        >
          {{ field.default_answer }}
        </p>
      </BaseDescriptionListItem>
    </BaseDescriptionList>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCustomerStore } from '@/scripts/admin/stores/customer'

const customerStore = useCustomerStore()

const selectedViewCustomer = computed(() => customerStore.selectedViewCustomer)

const contentLoading = computed(() => customerStore.isFetchingViewData)

const customerCustomFields = computed(() => {
  if (selectedViewCustomer?.value?.fields) {
    return selectedViewCustomer?.value?.fields
  }
  return []
})
</script>

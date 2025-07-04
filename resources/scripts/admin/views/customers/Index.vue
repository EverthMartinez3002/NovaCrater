<template>
  <BasePage>
    <!-- Page Header Section -->
    <BasePageHeader :title="$t('customers.title')">
      <BaseBreadcrumb>
        <BaseBreadcrumbItem :title="$t('general.home')" to="dashboard" />
        <BaseBreadcrumbItem
          :title="$t('customers.customer', 2)"
          to="#"
          active
        />
      </BaseBreadcrumb>

      <template #actions>
        <div class="flex items-center justify-end space-x-5">
          <BaseButton
            v-show="customerStore.totalCustomers"
            variant="primary-outline"
            @click="toggleFilter"
          >
            {{ $t('general.filter') }}
            <template #right="slotProps">
              <BaseIcon
                v-if="!showFilters"
                name="FunnelIcon"
                :class="slotProps.class"
              />
              <BaseIcon v-else name="XMarkIcon" :class="slotProps.class" />
            </template>
          </BaseButton>

          <BaseButton
            v-if="userStore.hasAbilities(abilities.CREATE_CUSTOMER)"
            @click="$router.push('customers/create')"
          >
            <template #left="slotProps">
              <BaseIcon name="PlusIcon" :class="slotProps.class" />
            </template>
            {{ $t('customers.new_customer') }}
          </BaseButton>
        </div>
      </template>
    </BasePageHeader>

    <BaseFilterWrapper :show="showFilters" class="mt-5" @clear="clearFilter">
      <BaseInputGroup :label="$t('customers.display_name')" class="text-left">
        <BaseInput
          v-model="filters.display_name"
          type="text"
          name="name"
          autocomplete="off"
        />
      </BaseInputGroup>

      <BaseInputGroup :label="$t('customers.contact_name')" class="text-left">
        <BaseInput
          v-model="filters.contact_name"
          type="text"
          name="address_name"
          autocomplete="off"
        />
      </BaseInputGroup>

      <BaseInputGroup :label="$t('customers.phone')" class="text-left">
        <BaseInput
          v-model="filters.phone"
          type="text"
          name="phone"
          autocomplete="off"
        />
      </BaseInputGroup>
    </BaseFilterWrapper>

    <BaseEmptyPlaceholder
      v-show="showEmptyScreen"
      :title="$t('customers.no_customers')"
      :description="$t('customers.list_of_customers')"
    >
      <AstronautIcon class="mt-5 mb-4" />

      <template #actions>
        <BaseButton
          v-if="userStore.hasAbilities(abilities.CREATE_CUSTOMER)"
          variant="primary-outline"
          @click="$router.push('/admin/customers/create')"
        >
          <template #left="slotProps">
            <BaseIcon name="PlusIcon" :class="slotProps.class" />
          </template>
          {{ $t('customers.add_new_customer') }}
        </BaseButton>
      </template>
    </BaseEmptyPlaceholder>

    <!-- Total no of Customers in Table -->
    <div
      v-show="!showEmptyScreen"
      class="relative bg-white rounded-lg dark:bg-gray-700 table-container"
    >
      <div
        v-if="customerStore.selectedCustomers.length"
        class="relative flex items-center justify-end h-5"
      >
        <BaseDropdown>
          <template #activator>
            <span
              class="flex text-sm font-medium cursor-pointer select-none text-primary-400"
            >
              {{ $t('general.actions') }}

              <BaseIcon name="ChevronDownIcon" />
            </span>
          </template>
          <BaseDropdownItem @click="removeMultipleCustomers">
            <BaseIcon
              name="TrashIcon"
              class="mr-3 text-gray-600 dark:text-gray-300"
            />
            {{ $t('general.delete') }}
          </BaseDropdownItem>
        </BaseDropdown>
      </div>

      <!-- Table Section -->
      <BaseTable
        ref="tableComponent"
        class="mt-3"
        :data="fetchData"
        :columns="customerColumns"
      >
        <!-- Select All Checkbox -->
        <template #header>
          <div class="absolute z-10 items-center left-6 top-2.5 select-none">
            <BaseCheckbox
              v-model="selectAllFieldStatus"
              variant="primary"
              @change="customerStore.selectAllCustomers"
            />
          </div>
        </template>

        <template #cell-status="{ row }">
          <div class="relative block">
            <BaseCheckbox
              :id="row.data.id"
              v-model="selectField"
              :value="row.data.id"
              variant="primary"
            />
          </div>
        </template>

        <template #cell-name="{ row }">
          <router-link :to="{ path: `customers/${row.data.id}/view` }">
            <BaseText
              :text="row.data.name"
              tag="span"
              class="flex flex-col font-medium text-primary-500 dark:text-primary-400"
            />
            <BaseText
              :text="row.data.contact_name ? row.data.contact_name : ''"
              tag="span"
              class="text-xs text-gray-400 dark:text-gray-300"
            />
          </router-link>
        </template>

        <template #cell-phone="{ row }">
          <span class="dark:text-gray-300">
            {{ row.data.phone ? row.data.phone : '-' }}
          </span>
        </template>

        <template #cell-due_amount="{ row }">
          <BaseFormatMoney
            :amount="row.data.due_amount || 0"
            :currency="row.data.currency"
          />
        </template>

        <template #cell-created_at="{ row }">
          <span class="dark:text-gray-300">{{
            row.data.formatted_created_at
          }}</span>
        </template>

        <template v-if="hasAtleastOneAbility()" #cell-actions="{ row }">
          <CustomerDropdown
            :row="row.data"
            :table="tableComponent"
            :load-data="refreshTable"
          />
        </template>
      </BaseTable>
    </div>
  </BasePage>
</template>

<script setup>
import { debouncedWatch } from '@vueuse/core'
import moment from 'moment'
import { reactive, ref, inject, computed, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCustomerStore } from '@/scripts/admin/stores/customer'
import { useDialogStore } from '@/scripts/stores/dialog'
import { useCompanyStore } from '@/scripts/admin/stores/company'
import { useUserStore } from '@/scripts/admin/stores/user'

import abilities from '@/scripts/admin/stub/abilities'

import CustomerDropdown from '@/scripts/admin/components/dropdowns/CustomerIndexDropdown.vue'
import AstronautIcon from '@/scripts/components/icons/empty/AstronautIcon.vue'

const companyStore = useCompanyStore()
const dialogStore = useDialogStore()
const customerStore = useCustomerStore()
const userStore = useUserStore()

let tableComponent = ref(null)
let showFilters = ref(false)
let isFetchingInitialData = ref(true)
const { t } = useI18n()

let filters = reactive({
  display_name: '',
  contact_name: '',
  phone: '',
})

const showEmptyScreen = computed(
  () => !customerStore.totalCustomers && !isFetchingInitialData.value
)

const selectField = computed({
  get: () => customerStore.selectedCustomers,
  set: (value) => {
    return customerStore.selectCustomer(value)
  },
})

const selectAllFieldStatus = computed({
  get: () => customerStore.selectAllField,
  set: (value) => {
    return customerStore.setSelectAllState(value)
  },
})

const customerColumns = computed(() => {
  return [
    {
      key: 'status',
      thClass: 'extra w-10 pr-0',
      sortable: false,
      tdClass: 'font-medium text-gray-900 dark:text-gray-200 pr-0',
    },
    {
      key: 'name',
      label: t('customers.display_name'),
      thClass: 'extra',
      tdClass: 'font-medium',
    },
    {
      key: 'phone',
      label: t('customers.phone'),
      sortable: true,
      tdClass: 'text-gray-900 dark:text-gray-200',
    },
    {
      key: 'due_amount',
      label: t('dashboard.top_bar.due_amount'),
      sortable: true,
      tdClass: 'text-gray-900 dark:text-gray-200',
      thClass: 'text-right',
    },
    {
      key: 'created_at',
      label: t('general.created_at'),
      sortable: true,
      tdClass: 'text-gray-900 dark:text-gray-200',
    },
    {
      key: 'actions',
      tdClass: 'text-right text-sm font-medium pl-0',
      thClass: 'pl-0',
      sortable: false,
    },
  ]
})

debouncedWatch(
  filters,
  () => {
    setFilters()
  },
  { debounce: 500 }
)

onUnmounted(() => {
  if (customerStore.selectAllField) {
    customerStore.selectAllCustomers()
  }
})

function refreshTable() {
  tableComponent.value.refresh()
}

function setFilters() {
  refreshTable()
}

function hasAtleastOneAbility() {
  return userStore.hasAbilities([
    abilities.DELETE_CUSTOMER,
    abilities.EDIT_CUSTOMER,
    abilities.VIEW_CUSTOMER,
  ])
}

async function fetchData({ page, filter, sort }) {
  let data = {
    display_name: filters.display_name,
    contact_name: filters.contact_name,
    phone: filters.phone,
    orderByField: sort.fieldName || 'created_at',
    orderBy: sort.order || 'desc',
    page,
  }

  isFetchingInitialData.value = true
  let response = await customerStore.fetchCustomers(data)
  isFetchingInitialData.value = false
  return {
    data: response.data.data,
    pagination: {
      totalPages: response.data.meta.last_page,
      currentPage: page,
      totalCount: response.data.meta.total,
      limit: 10,
    },
  }
}

function clearFilter() {
  filters.display_name = ''
  filters.contact_name = ''
  filters.phone = ''
}

function toggleFilter() {
  if (showFilters.value) {
    clearFilter()
  }

  showFilters.value = !showFilters.value
}

let date = ref(new Date())

date.value = moment(date).format('YYYY-MM-DD')

function removeMultipleCustomers() {
  dialogStore
    .openDialog({
      title: t('general.are_you_sure'),
      message: t('customers.confirm_delete', 2),
      yesLabel: t('general.ok'),
      noLabel: t('general.cancel'),
      variant: 'danger',
      hideNoButton: false,
      size: 'lg',
    })
    .then((res) => {
      if (res) {
        customerStore.deleteMultipleCustomers().then((response) => {
          if (response.data) {
            refreshTable()
          }
        })
      }
    })
}
</script>

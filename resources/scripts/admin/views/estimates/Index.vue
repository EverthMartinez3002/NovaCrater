<template>
  <BasePage>
    <SendEstimateModal />

    <BasePageHeader :title="$t('estimates.title')">
      <BaseBreadcrumb>
        <BaseBreadcrumbItem :title="$t('general.home')" to="dashboard" />

        <BaseBreadcrumbItem
          :title="$t('estimates.estimate', 2)"
          to="#"
          active
        />
      </BaseBreadcrumb>

      <template #actions>
        <BaseButton
          v-show="estimateStore.totalEstimateCount"
          variant="primary-outline"
          @click="toggleFilter"
        >
          {{ $t('general.filter') }}
          <template #right="slotProps">
            <BaseIcon
              v-if="!showFilters"
              :class="slotProps.class"
              name="FunnelIcon"
            />
            <BaseIcon v-else name="XMarkIcon" :class="slotProps.class" />
          </template>
        </BaseButton>

        <router-link
          v-if="userStore.hasAbilities(abilities.CREATE_ESTIMATE)"
          to="estimates/create"
        >
          <BaseButton variant="primary" class="ml-4">
            <template #left="slotProps">
              <BaseIcon name="PlusIcon" :class="slotProps.class" />
            </template>
            {{ $t('estimates.new_estimate') }}
          </BaseButton>
        </router-link>
      </template>
    </BasePageHeader>

    <BaseFilterWrapper
      v-show="showFilters"
      :row-on-xl="true"
      @clear="clearFilter"
    >
      <BaseInputGroup :label="$t('customers.customer', 1)">
        <BaseCustomerSelectInput
          v-model="filters.customer_id"
          :placeholder="$t('customers.type_or_click')"
          value-prop="id"
          label="name"
        />
      </BaseInputGroup>

      <BaseInputGroup :label="$t('estimates.status')">
        <BaseMultiselect
          v-model="filters.status"
          :options="status"
          searchable
          :placeholder="$t('general.select_a_status')"
          @update:modelValue="setActiveTab"
          @remove="clearStatusSearch()"
        />
      </BaseInputGroup>
      <BaseInputGroup :label="$t('general.from')">
        <BaseDatePicker
          v-model="filters.from_date"
          :calendar-button="true"
          calendar-button-icon="calendar"
        />
      </BaseInputGroup>

      <div
        class="hidden w-8 h-0 mx-4 border border-gray-400 border-solid xl:block dark:border-gray-500"
        style="margin-top: 1.5rem"
      />

      <BaseInputGroup :label="$t('general.to')">
        <BaseDatePicker
          v-model="filters.to_date"
          :calendar-button="true"
          calendar-button-icon="calendar"
        />
      </BaseInputGroup>

      <BaseInputGroup :label="$t('estimates.estimate_number')">
        <BaseInput v-model="filters.estimate_number">
          <template #left="slotProps">
            <BaseIcon name="HashtagIcon" :class="slotProps.class" />
          </template>
        </BaseInput>
      </BaseInputGroup>
    </BaseFilterWrapper>

    <BaseEmptyPlaceholder
      v-show="showEmptyScreen"
      :title="$t('estimates.no_estimates')"
      :description="$t('estimates.list_of_estimates')"
    >
      <ObservatoryIcon class="mt-5 mb-4" />

      <template #actions>
        <BaseButton
          v-if="userStore.hasAbilities(abilities.CREATE_ESTIMATE)"
          variant="primary-outline"
          @click="$router.push('/admin/estimates/create')"
        >
          <template #left="slotProps">
            <BaseIcon name="PlusIcon" :class="slotProps.class" />
          </template>
          {{ $t('estimates.add_new_estimate') }}
        </BaseButton>
      </template>
    </BaseEmptyPlaceholder>

    <div
      v-show="!showEmptyScreen"
      class="relative bg-white rounded-lg dark:bg-gray-700 table-container"
    >
      <div
        class="relative flex items-center justify-between h-10 mt-5 list-none border-b-2 border-gray-200 border-solid dark:border-gray-700"
      >
        <!-- Tabs -->
        <BaseTabGroup class="-mb-5" @change="setStatusFilter">
          <BaseTab :title="$t('general.all')" filter="" />
          <BaseTab :title="$t('general.draft')" filter="DRAFT" />
          <BaseTab :title="$t('general.sent')" filter="SENT" />
        </BaseTabGroup>

        <BaseDropdown
          v-if="
            estimateStore.selectedEstimates.length &&
            userStore.hasAbilities(abilities.DELETE_ESTIMATE)
          "
          class="absolute float-right"
        >
          <template #activator>
            <span
              class="flex text-sm font-medium cursor-pointer select-none text-primary-400"
            >
              {{ $t('general.actions') }}
              <BaseIcon name="ChevronDownIcon" />
            </span>
          </template>

          <BaseDropdownItem @click="removeMultipleEstimates">
            <BaseIcon
              name="TrashIcon"
              class="mr-3 text-gray-600 dark:text-gray-300"
            />
            {{ $t('general.delete') }}
          </BaseDropdownItem>
        </BaseDropdown>
      </div>

      <BaseTable
        ref="tableComponent"
        :data="fetchData"
        :columns="estimateColumns"
        :placeholder-count="estimateStore.totalEstimateCount >= 20 ? 10 : 5"
        :key="tableKey"
        class="mt-10"
      >
        <template #header>
          <div class="absolute items-center left-6 top-2.5 select-none">
            <BaseCheckbox
              v-model="estimateStore.selectAllField"
              variant="primary"
              @change="estimateStore.selectAllEstimates"
            />
          </div>
        </template>

        <template #cell-checkbox="{ row }">
          <div class="relative block">
            <BaseCheckbox
              :id="row.id"
              v-model="selectField"
              :value="row.data.id"
            />
          </div>
        </template>

        <!-- Estimate date  -->
        <template #cell-estimate_date="{ row }">
          <span class="dark:text-gray-300">{{
            row.data.formatted_estimate_date
          }}</span>
        </template>

        <template #cell-estimate_number="{ row }">
          <router-link
            :to="{ path: `estimates/${row.data.id}/view` }"
            class="font-medium text-primary-500 dark:text-primary-400"
          >
            {{ row.data.estimate_number }}
          </router-link>
        </template>

        <template #cell-name="{ row }">
          <BaseText :text="row.data.customer.name" class="dark:text-gray-300" />
        </template>

        <template #cell-status="{ row }">
          <BaseEstimateStatusBadge :status="row.data.status" class="px-3 py-1">
            <BaseEstimateStatusLabel :status="row.data.status"/>
          </BaseEstimateStatusBadge>
        </template>

        <template #cell-total="{ row }">
          <BaseFormatMoney
            :amount="row.data.total"
            :currency="row.data.customer.currency"
            class="dark:text-gray-300"
          />
        </template>

        <!-- Actions -->
        <template v-if="hasAtleastOneAbility()" #cell-actions="{ row }">
          <EstimateDropDown :row="row.data" :table="tableComponent" />
        </template>
      </BaseTable>
    </div>
  </BasePage>
</template>

<script setup>
import { computed, onUnmounted, reactive, ref, watch, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useEstimateStore } from '@/scripts/admin/stores/estimate'
import { useDialogStore } from '@/scripts/stores/dialog'
import { useUserStore } from '@/scripts/admin/stores/user'
import { debouncedWatch } from '@vueuse/core'
import abilities from '@/scripts/admin/stub/abilities'

import ObservatoryIcon from '@/scripts/components/icons/empty/ObservatoryIcon.vue'
import EstimateDropDown from '@/scripts/admin/components/dropdowns/EstimateIndexDropdown.vue'
import SendEstimateModal from '@/scripts/admin/components/modal-components/SendEstimateModal.vue'
import BaseEstimateStatusLabel from "@/scripts/components/base/BaseEstimateStatusLabel.vue";

const estimateStore = useEstimateStore()
const dialogStore = useDialogStore()
const userStore = useUserStore()

const tableComponent = ref(null)
const tableKey = ref(0)
const { t } = useI18n()
const showFilters = ref(false)
const status = ref([
  {label: t('estimates.draft'), value: 'DRAFT'},
  {label: t('estimates.sent'), value: 'SENT'},
  {label: t('estimates.viewed'), value: 'VIEWED'},
  {label: t('estimates.expired'), value: 'EXPIRED'},
  {label: t('estimates.accepted'), value: 'ACCEPTED'},
  {label: t('estimates.rejected'), value: 'REJECTED'},
])

const isRequestOngoing = ref(true)
const activeTab = ref('general.draft')
const router = useRouter()

let filters = reactive({
  customer_id: '',
  status: '',
  from_date: '',
  to_date: '',
  estimate_number: '',
})

const showEmptyScreen = computed(
  () => !estimateStore.totalEstimateCount && !isRequestOngoing.value
)

const selectField = computed({
  get: () => estimateStore.selectedEstimates,
  set: (val) => {
    estimateStore.selectEstimate(val)
  },
})

const estimateColumns = computed(() => {
  return [
    {
      key: 'checkbox',
      thClass: 'extra w-10 pr-0',
      sortable: false,
      tdClass: 'font-medium text-gray-900 pr-0',
    },
    {
      key: 'estimate_date',
      label: t('estimates.date'),
      thClass: 'extra',
      tdClass: 'font-medium text-gray-500',
    },
    { key: 'estimate_number', label: t('estimates.number', 2) },
    { key: 'name', label: t('estimates.customer') },
    { key: 'status', label: t('estimates.status') },
    {
      key: 'total',
      label: t('estimates.total'),
      tdClass: 'font-medium text-gray-900',
    },
    {
      key: 'actions',
      tdClass: 'text-right text-sm font-medium pl-0',
      thClass: 'text-right pl-0',
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
  if (estimateStore.selectAllField) {
    estimateStore.selectAllEstimates()
  }
})

function hasAtleastOneAbility() {
  return userStore.hasAbilities([
    abilities.CREATE_ESTIMATE,
    abilities.EDIT_ESTIMATE,
    abilities.VIEW_ESTIMATE,
    abilities.SEND_ESTIMATE,
  ])
}

async function clearStatusSearch(removedOption, id) {
  filters.status = ''
  refreshTable()
}

function refreshTable() {
  tableComponent.value && tableComponent.value.refresh()
}

async function fetchData({ page, filter, sort }) {
  let data = {
    customer_id: filters.customer_id,
    status: filters.status,
    from_date: filters.from_date,
    to_date: filters.to_date,
    estimate_number: filters.estimate_number,
    orderByField: sort.fieldName || 'created_at',
    orderBy: sort.order || 'desc',
    page,
  }

  isRequestOngoing.value = true

  let response = await estimateStore.fetchEstimates(data)

  isRequestOngoing.value = false

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

function setStatusFilter(val) {
  if (activeTab.value == val.title) {
    return true
  }

  activeTab.value = val.title

  switch (val.title) {
    case t('general.draft'):
      filters.status = 'DRAFT'
      break
    case t('general.sent'):
      filters.status = 'SENT'
      break
    default:
      filters.status = ''
      break
  }
}

function setFilters() {
  estimateStore.$patch((state) => {
    state.selectedEstimates = []
    state.selectAllField = false
  })

  tableKey.value += 1

  refreshTable()
}

function clearFilter() {
  filters.customer_id = ''
  filters.status = ''
  filters.from_date = ''
  filters.to_date = ''
  filters.estimate_number = ''

  activeTab.value = t('general.all')
}

function toggleFilter() {
  if (showFilters.value) {
    clearFilter()
  }

  showFilters.value = !showFilters.value
}

async function removeMultipleEstimates() {
  dialogStore
    .openDialog({
      title: t('general.are_you_sure'),
      message: t('estimates.confirm_delete'),
      yesLabel: t('general.ok'),
      noLabel: t('general.cancel'),
      variant: 'danger',
      hideNoButton: false,
      size: 'lg',
    })
    .then((res) => {
      if (res) {
        estimateStore.deleteMultipleEstimates().then((res) => {
          refreshTable()
          if (res.data) {
            estimateStore.$patch((state) => {
              state.selectedEstimates = []
              state.selectAllField = false
            })
          }
        })
      }
    })
}

function setActiveTab(val) {
  switch (val) {
    case 'DRAFT':
      activeTab.value = t('general.draft')
      break
    case 'SENT':
      activeTab.value = t('general.sent')
      break

    case 'VIEWED':
      activeTab.value = t('estimates.viewed')
      break

    case 'EXPIRED':
      activeTab.value = t('estimates.expired')
      break

    case 'ACCEPTED':
      activeTab.value = t('estimates.accepted')
      break

    case 'REJECTED':
      activeTab.value = t('estimates.rejected')
      break

    default:
      activeTab.value = t('general.all')
      break
  }
}
</script>

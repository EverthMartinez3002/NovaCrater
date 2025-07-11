<template>
  <BaseContentPlaceholders v-if="contentLoading">
    <BaseContentPlaceholdersBox
      :rounded="true"
      class="w-full"
      style="min-height: 170px"
    />
  </BaseContentPlaceholders>

  <div v-else class="max-h-[173px]">
    <CustomerModal />
    <!-- <SalesTax :type="type" /> -->

    <div
      v-if="selectedCustomer"
      class="
        flex flex-col
        p-4
        border border-gray-200 border-solid
        rounded-md
        dark:border-gray-600
        min-h-[170px]
      "
      @click.stop
    >
      <div class="flex relative justify-between mb-2">
        <BaseText
          :text="selectedCustomer.name"
          class="flex-1 text-base font-medium text-left text-gray-900 dark:text-gray-200"
        />
        <div class="flex">
          <a
            class="
              relative
              my-0
              ml-6
              text-sm
              font-medium
              cursor-pointer
              text-primary-500
              items-center
              flex
            "
            @click.stop="editCustomer"
          >
            <BaseIcon name="PencilIcon" class="w-4 h-4 mr-1 text-gray-500" />

            {{ $t('general.edit') }}
          </a>
          <a
            class="
              relative
              my-0
              ml-6
              text-sm
              flex
              items-center
              font-medium
              cursor-pointer
              text-primary-500
            "
            @click="resetSelectedCustomer"
          >
            <BaseIcon name="XCircleIcon" class="w-4 h-4 mr-1 text-gray-500" />
            {{ $t('general.deselect') }}
          </a>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-8 mt-2">
        <div v-if="selectedCustomer.billing" class="flex flex-col">
          <label
            class="
              mb-1
              text-sm
              font-medium
              text-left text-gray-400
              uppercase
              whitespace-nowrap
            "
          >
            {{ $t('general.bill_to') }}
          </label>

          <div
            v-if="selectedCustomer.billing"
            class="flex flex-col flex-1 p-0 text-left"
          >
            <label
              v-if="selectedCustomer.billing.name"
              class="relative w-11/12 text-sm truncate dark:text-gray-300"
            >
              {{ selectedCustomer.billing.name }}
            </label>

            <label class="relative w-11/12 text-sm truncate dark:text-gray-300">
              <span v-if="selectedCustomer.billing.city">
                {{ selectedCustomer.billing.city }}
              </span>
              <span
                v-if="
                  selectedCustomer.billing.city &&
                  selectedCustomer.billing.state
                "
              >
                ,
              </span>
              <span v-if="selectedCustomer.billing.state">
                {{ selectedCustomer.billing.state }}
              </span>
            </label>
            <label
              v-if="selectedCustomer.billing.zip"
              class="relative w-11/12 text-sm truncate dark:text-gray-300"
            >
              {{ selectedCustomer.billing.zip }}
            </label>
          </div>
        </div>

        <div v-if="selectedCustomer.shipping" class="flex flex-col">
          <label
            class="
              mb-1
              text-sm
              font-medium
              text-left text-gray-400
              uppercase
              whitespace-nowrap
            "
          >
            {{ $t('general.ship_to') }}
          </label>

          <div
            v-if="selectedCustomer.shipping"
            class="flex flex-col flex-1 p-0 text-left"
          >
            <label
              v-if="selectedCustomer.shipping.name"
              class="relative w-11/12 text-sm truncate dark:text-gray-300"
            >
              {{ selectedCustomer.shipping.name }}
            </label>

            <label class="relative w-11/12 text-sm truncate dark:text-gray-300">
              <span v-if="selectedCustomer.shipping.city">
                {{ selectedCustomer.shipping.city }}
              </span>
              <span
                v-if="
                  selectedCustomer.shipping.city &&
                  selectedCustomer.shipping.state
                "
              >
                ,
              </span>
              <span v-if="selectedCustomer.shipping.state">
                {{ selectedCustomer.shipping.state }}
              </span>
            </label>
            <label
              v-if="selectedCustomer.shipping.zip"
              class="relative w-11/12 text-sm truncate dark:text-gray-300"
            >
              {{ selectedCustomer.shipping.zip }}
            </label>
          </div>
        </div>
      </div>
    </div>

    <Popover v-else v-slot="{ open }" class="relative flex flex-col rounded-md">
      <PopoverButton
        :class="{
          'text-opacity-90': open,
          'border border-solid border-red-500 focus:ring-red-500 rounded':
            valid.$error,
          'focus:ring-2 focus:ring-primary-400': !valid.$error,
        }"
        class="w-full outline-none rounded-md"
      >
        <div
          class="
            relative
            flex
            justify-center
            px-0
            p-0
            py-16
            border border-gray-200 border-solid
            rounded-md
            dark:border-gray-600
            min-h-[170px]
          "
        >
          <BaseIcon
            name="UserIcon"
            class="
              flex
              justify-center
              !w-10
              !h-10
              p-2
              mr-5
              text-sm text-white
              bg-gray-200
              dark:bg-gray-600
              rounded-full
              font-base
            "
          />

          <div class="mt-1">
            <label
              class="text-lg font-medium text-gray-900 dark:text-gray-200"
            >
              {{ $t('customers.new_customer') }}
              <span class="text-red-500"> * </span>
            </label>

            <p
              v-if="valid.$error && valid.$errors[0].$message"
              class="text-red-500 text-sm absolute right-3 bottom-3"
            >
              {{ $t('estimates.errors.required') }}
            </p>
          </div>
        </div>
      </PopoverButton>

      <!-- Customer Select Popup -->
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="translate-y-1 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="translate-y-1 opacity-0"
      >
        <div v-if="open" class="absolute min-w-full z-10">
          <PopoverPanel
            v-slot="{ close }"
            focus
            static
            class="
              overflow-hidden
              rounded-md
              shadow-lg
              ring-1 ring-black ring-opacity-5
              bg-white
            "
          >
            <div class="relative">
              <BaseInput
                v-model="search"
                container-class="m-4"
                :placeholder="$t('general.search')"
                type="text"
                icon="search"
                @update:modelValue="(val) => debounceSearchCustomer(val)"
              />

              <ul
                class="
                  max-h-80
                  flex flex-col
                  overflow-auto
                  list
                  border-t border-gray-200
                "
              >
                <li
                  v-for="(customer, index) in customerStore.customers"
                  :key="index"
                  href="#"
                  class="
                    flex
                    px-6
                    py-2
                    border-b border-gray-200 border-solid
                    cursor-pointer
                    hover:cursor-pointer hover:bg-gray-100
                    focus:outline-none focus:bg-gray-100
                    last:border-b-0
                  "
                  @click="selectNewCustomer(customer.id, close)"
                >
                  <span
                    class="
                      flex
                      items-center
                      content-center
                      justify-center
                      w-10
                      h-10
                      mr-4
                      text-xl
                      font-semibold
                      leading-9
                      text-white
                      bg-gray-300
                      rounded-full
                      avatar
                    "
                  >
                    {{ initGenerator(customer.name) }}
                  </span>

                  <div class="flex flex-col justify-center text-left">
                    <BaseText
                      v-if="customer.name"
                      :text="customer.name"
                      class="
                        m-0
                        text-base
                        font-normal
                        leading-tight
                        cursor-pointer
                      "
                    />
                    <BaseText
                      v-if="customer.contact_name"
                      :text="customer.contact_name"
                      class="
                        m-0
                        text-sm
                        font-medium
                        text-gray-400
                        cursor-pointer
                      "
                    />
                  </div>
                </li>
                <div
                  v-if="customerStore.customers.length === 0"
                  class="flex justify-center p-5 text-gray-400"
                >
                  <label class="text-base text-gray-500 cursor-pointer">
                    {{ $t('customers.no_customers_found') }}
                  </label>
                </div>
              </ul>
            </div>

            <button
              v-if="userStore.hasAbilities(abilities.CREATE_CUSTOMER)"
              type="button"
              class="
                h-10
                flex
                items-center
                justify-center
                w-full
                px-2
                py-3
                bg-gray-200
                border-none
                outline-none
                focus:bg-gray-300
              "
              @click="openCustomerModal"
            >
              <BaseIcon name="UserPlusIcon" class="text-primary-400" />

              <label
                class="
                  m-0
                  ml-3
                  text-sm
                  leading-none
                  cursor-pointer
                  font-base
                  text-primary-400
                "
              >
                {{ $t('customers.add_new_customer') }}
              </label>
            </button>
          </PopoverPanel>
        </div>
      </transition>
    </Popover>
  </div>
</template>

<script setup>
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { useEstimateStore } from '@/scripts/admin/stores/estimate'
import { useInvoiceStore } from '@/scripts/admin/stores/invoice'
import { useRecurringInvoiceStore } from '@/scripts/admin/stores/recurring-invoice'
import { useModalStore } from '@/scripts/stores/modal'
import { useGlobalStore } from '@/scripts/admin/stores/global'
import { useCustomerStore } from '@/scripts/admin/stores/customer'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDebounceFn } from '@vueuse/core'
import { useUserStore } from '@/scripts/admin/stores/user'
import abilities from '@/scripts/admin/stub/abilities'
import { useRoute } from 'vue-router'
import CustomerModal from '@/scripts/admin/components/modal-components/CustomerModal.vue'

const props = defineProps({
  valid: {
    type: Object,
    default: () => {},
  },
  customerId: {
    type: Number,
    default: null,
  },
  type: {
    type: String,
    default: null,
  },
  contentLoading: {
    type: Boolean,
    default: false,
  },
})

const modalStore = useModalStore()
const estimateStore = useEstimateStore()
const customerStore = useCustomerStore()
const globalStore = useGlobalStore()
const invoiceStore = useInvoiceStore()
const recurringInvoiceStore = useRecurringInvoiceStore()
const userStore = useUserStore()
const routes = useRoute()
const { t } = useI18n()
const search = ref(null)
const isSearchingCustomer = ref(false)

const selectedCustomer = computed(() => {
  switch (props.type) {
    case 'estimate':
      return estimateStore.newEstimate.customer
    case 'invoice':
      return invoiceStore.newInvoice.customer
    case 'recurring-invoice':
      return recurringInvoiceStore.newRecurringInvoice.customer
    default:
      return ''
  }
})

function resetSelectedCustomer() {
  if (props.type === 'estimate') {
    estimateStore.resetSelectedCustomer()
  } else if (props.type === 'invoice') {
    invoiceStore.resetSelectedCustomer()
  } else {
    recurringInvoiceStore.resetSelectedCustomer()
  }
}

if (props.customerId && props.type === 'estimate') {
  estimateStore.selectCustomer(props.customerId)
} else if (props.customerId && props.type === 'invoice') {
  invoiceStore.selectCustomer(props.customerId)
} else {
  if (props.customerId) recurringInvoiceStore.selectCustomer(props.customerId)
}

async function editCustomer() {
  await customerStore.fetchCustomer(selectedCustomer.value.id)
  modalStore.openModal({
    title: t('customers.edit_customer'),
    componentName: 'CustomerModal',
  })
}

async function fetchInitialCustomers() {
  await customerStore.fetchCustomers({
    filter: {},
    orderByField: '',
    orderBy: '',
    customer_id: props.customerId,
  })
}

const debounceSearchCustomer = useDebounceFn(() => {
  isSearchingCustomer.value = true

  searchCustomer()
}, 500)

async function searchCustomer() {
  let data = {
    display_name: search.value,
    page: 1,
  }

  customerStore.$reset()
  await customerStore.fetchCustomers(data)
  isSearchingCustomer.value = false
}

function openCustomerModal() {
  modalStore.openModal({
    title: t('customers.add_customer'),
    componentName: 'CustomerModal',
    variant: 'md',
  })
}

function initGenerator(name) {
  if (name) {
    let nameSplit = name.split(' ')
    let initials = nameSplit[0].charAt(0).toUpperCase()
    return initials
  }
}

function selectNewCustomer(id, close) {
  let params = {
    userId: id,
  }
  if (routes.params.id) params.model_id = routes.params.id

  if (props.type === 'estimate') {
    estimateStore.getNextNumber(params, true)
    estimateStore.selectCustomer(id)
  } else if (props.type === 'invoice') {
    invoiceStore.getNextNumber(params, true)
    invoiceStore.selectCustomer(id)
  } else {
    recurringInvoiceStore.selectCustomer(id)
  }
  close()
  search.value = null
}

globalStore.fetchCurrencies()
globalStore.fetchCountries()
fetchInitialCustomers()
</script>

<template>
  <span :class="badgeColorClasses">
    <slot />
  </span>
</template>

<script>
import { computed } from 'vue'

export default {
  props: {
    status: {
      type: String,
      required: false,
      default: '',
    },
  },

  setup(props) {
    const badgeColorClasses = computed(() => {
      switch (props.status) {
        case 'DRAFT':
          return 'bg-yellow-300 bg-opacity-25 px-2 py-1 text-sm text-yellow-800 dark:bg-yellow-900 dark:bg-opacity-25 dark:text-yellow-200 uppercase font-normal text-center'
        case 'SENT':
          return 'bg-yellow-500 bg-opacity-25 px-2 py-1 text-sm text-yellow-900 dark:bg-yellow-900 dark:bg-opacity-25 dark:text-yellow-200 uppercase font-normal text-center'
        case 'VIEWED':
          return 'bg-blue-400 bg-opacity-25 px-2 py-1 text-sm text-blue-900 dark:bg-blue-900 dark:bg-opacity-25 dark:text-blue-200 uppercase font-normal text-center'
        case 'COMPLETED':
          return 'bg-green-500 bg-opacity-25 px-2 py-1 text-sm text-green-900 dark:bg-green-900 dark:bg-opacity-25 dark:text-green-200 uppercase font-normal text-center'
        case 'DUE':
          return 'bg-yellow-500 bg-opacity-25 px-2 py-1 text-sm text-yellow-900 dark:bg-yellow-900 dark:bg-opacity-25 dark:text-yellow-200 uppercase font-normal text-center'
        case 'OVERDUE':
          return 'bg-red-300 bg-opacity-50 px-2 py-1 text-sm text-red-900 dark:bg-red-900 dark:bg-opacity-50 dark:text-red-200 uppercase font-normal text-center'
        case 'UNPAID':
          return 'bg-yellow-500 bg-opacity-25 px-2 py-1 text-sm text-yellow-900 dark:bg-yellow-900 dark:bg-opacity-25 dark:text-yellow-200 uppercase font-normal text-center'
        case 'PARTIALLY_PAID':
          return 'bg-blue-400 bg-opacity-25 px-2 py-1 text-sm text-blue-900 dark:bg-blue-900 dark:bg-opacity-25 dark:text-blue-200 uppercase font-normal text-center'
        case 'PAID':
          return 'bg-green-500 bg-opacity-25 px-2 py-1 text-sm text-green-900 dark:bg-green-900 dark:bg-opacity-25 dark:text-green-200 uppercase font-normal text-center'
        default:
          return 'bg-gray-500 bg-opacity-25 px-2 py-1 text-sm text-gray-900 dark:bg-gray-700 dark:bg-opacity-25 dark:text-gray-200 uppercase font-normal text-center'
      }
    })
    return { badgeColorClasses }
  },
}
</script>

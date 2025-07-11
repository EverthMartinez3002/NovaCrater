<template>
  <div
    v-if="shouldShowPagination"
    class="
      flex
      items-center
      justify-between
      px-4
      py-3
      bg-white
      border-t border-gray-200
      dark:bg-gray-700 dark:border-gray-600
      sm:px-6
    "
  >
    <div class="flex justify-between flex-1 sm:hidden">
      <a
        href="#"
        :class="{
          'disabled cursor-normal pointer-events-none !bg-gray-100 dark:!bg-gray-800 !text-gray-400 dark:!text-gray-500':
            pagination.currentPage === 1,
        }"
        class="
          relative
          inline-flex
          items-center
          px-4
          py-2
          text-sm
          font-medium
          text-gray-700
          bg-white
          border border-gray-300
          dark:bg-gray-700
          dark:border-gray-600
          dark:text-gray-300
          dark:hover:bg-gray-600
          rounded-md
          hover:bg-gray-50
        "
        @click="pageClicked(pagination.currentPage - 1)"
      >
        {{ $t('general.pagination.previous') }}
      </a>
      <a
        href="#"
        :class="{
          'disabled cursor-default pointer-events-none !bg-gray-100 dark:!bg-gray-800 !text-gray-400 dark:!text-gray-500':
            pagination.currentPage === pagination.totalPages,
        }"
        class="
          relative
          inline-flex
          items-center
          px-4
          py-2
          ml-3
          text-sm
          font-medium
          text-gray-700
          bg-white
          border border-gray-300
          dark:bg-gray-700
          dark:border-gray-600
          dark:text-gray-300
          dark:hover:bg-gray-600
          rounded-md
          hover:bg-gray-50
        "
        @click="pageClicked(pagination.currentPage + 1)"
      >
        {{ $t('general.pagination.next') }}
      </a>
    </div>
    <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-700 dark:text-gray-300">
          {{ $t('general.pagination.showing') }}
          {{ ' ' }}
          <span
            v-if="pagination.limit && pagination.currentPage"
            class="font-medium"
          >
            {{
              pagination.currentPage * pagination.limit - (pagination.limit - 1)
            }}
          </span>
          {{ ' ' }}
          {{ $t('general.pagination.to') }}
          {{ ' ' }}
          <span
            v-if="pagination.limit && pagination.currentPage"
            class="font-medium"
          >
            <span
              v-if="
                pagination.currentPage * pagination.limit <=
                pagination.totalCount
              "
            >
              {{ pagination.currentPage * pagination.limit }}
            </span>
            <span v-else>
              {{ pagination.totalCount }}
            </span>
          </span>
          {{ ' ' }}
          {{ $t('general.pagination.of') }}
          {{ ' ' }}
          <span v-if="pagination.totalCount" class="font-medium">
            {{ pagination.totalCount }}
          </span>
          {{ ' ' }}
          {{ $t('general.pagination.results') }}
        </p>
      </div>
      <div>
        <nav
          class="relative z-0 inline-flex -space-x-px rounded-md shadow-sm"
          aria-label="Pagination"
        >
          <a
            href="#"
            :class="{
              'disabled cursor-normal pointer-events-none !bg-gray-100 dark:!bg-gray-800 !text-gray-400 dark:!text-gray-500':
                pagination.currentPage === 1,
            }"
            class="
              relative
              inline-flex
              items-center
              px-2
              py-2
              text-sm
              font-medium
              text-gray-500
              bg-white
              border border-gray-300
              dark:bg-gray-700
              dark:border-gray-600
              dark:text-gray-300
              dark:hover:bg-gray-600
              rounded-l-md
              hover:bg-gray-50
            "
            @click="pageClicked(pagination.currentPage - 1)"
          >
            <span class="sr-only">Previous</span>
            <BaseIcon name="ChevronLeftIcon" />
          </a>
          <a
            v-if="hasFirst"
            href="#"
            aria-current="page"
            :class="[
              'relative inline-flex items-center px-4 py-2 text-sm font-medium border',
              {
                'z-10 bg-primary-50 border-primary-500 text-primary-600 dark:bg-primary-500 dark:border-primary-500 dark:text-white':
                  isActive(1),
                'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600':
                  !isActive(1),
              },
            ]"
            @click="pageClicked(1)"
          >
            1
          </a>

          <span
            v-if="hasFirstEllipsis"
            class="
              relative
              inline-flex
              items-center
              px-4
              py-2
              text-sm
              font-medium
              text-gray-700
              bg-white
              border border-gray-300
              dark:bg-gray-700
              dark:border-gray-600
              dark:text-gray-300
            "
          >
            ...
          </span>
          <a
            v-for="page in pages"
            :key="page"
            href="#"
            :class="[
              'relative items-center hidden px-4 py-2 text-sm font-medium border md:inline-flex',
              {
                'z-10 bg-primary-50 border-primary-500 text-primary-600 dark:bg-primary-500 dark:border-primary-500 dark:text-white':
                  isActive(page),
                'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600':
                  !isActive(page),
                disabled: page === '...',
              },
            ]"
            @click="pageClicked(page)"
          >
            {{ page }}
          </a>

          <span
            v-if="hasLastEllipsis"
            class="
              relative
              inline-flex
              items-center
              px-4
              py-2
              text-sm
              font-medium
              text-gray-700
              bg-white
              border border-gray-300
              dark:bg-gray-700
              dark:border-gray-600
              dark:text-gray-300
            "
          >
            ...
          </span>
          <a
            v-if="hasLast"
            href="#"
            aria-current="page"
            :class="[
              'relative inline-flex items-center px-4 py-2 text-sm font-medium border',
              {
                'z-10 bg-primary-50 border-primary-500 text-primary-600 dark:bg-primary-500 dark:border-primary-500 dark:text-white':
                  isActive(pagination.totalPages),
                'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600':
                  !isActive(pagination.totalPages),
              },
            ]"
            @click="pageClicked(pagination.totalPages)"
          >
            {{ pagination.totalPages }}
          </a>
          <a
            href="#"
            :class="{
              'disabled cursor-normal pointer-events-none !bg-gray-100 dark:!bg-gray-800 !text-gray-400 dark:!text-gray-500':
                pagination.currentPage === pagination.totalPages,
            }"
            class="
              relative
              inline-flex
              items-center
              px-2
              py-2
              text-sm
              font-medium
              text-gray-500
              bg-white
              border border-gray-300
              dark:bg-gray-700
              dark:border-gray-600
              dark:text-gray-300
              dark:hover:bg-gray-600
              rounded-r-md
              hover:bg-gray-50
            "
            @click="pageClicked(pagination.currentPage + 1)"
          >
            <span class="sr-only">Next</span>
            <BaseIcon name="ChevronRightIcon" />
          </a>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
// Todo: Need to convert this to Composition API

export default {
  props: {
    pagination: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    pages() {
      return this.pagination.totalPages === undefined ? [] : this.pageLinks()
    },
    hasFirst() {
      return this.pagination.currentPage >= 4 || this.pagination.totalPages < 10
    },
    hasLast() {
      return (
        this.pagination.currentPage <= this.pagination.totalPages - 3 ||
        this.pagination.totalPages < 10
      )
    },
    hasFirstEllipsis() {
      return (
        this.pagination.currentPage >= 4 && this.pagination.totalPages >= 10
      )
    },
    hasLastEllipsis() {
      return (
        this.pagination.currentPage <= this.pagination.totalPages - 3 &&
        this.pagination.totalPages >= 10
      )
    },
    shouldShowPagination() {
      if (this.pagination.totalPages === undefined) {
        return false
      }
      if (this.pagination.count === 0) {
        return false
      }
      return this.pagination.totalPages > 1
    },
  },
  methods: {
    isActive(page) {
      const currentPage = this.pagination.currentPage || 1
      return currentPage === page
    },
    pageClicked(page) {
      if (
        page === '...' ||
        page === this.pagination.currentPage ||
        page > this.pagination.totalPages ||
        page < 1
      ) {
        return
      }

      this.$emit('pageChange', page)
    },
    pageLinks() {
      const pages = []
      let left = 2
      let right = this.pagination.totalPages - 1
      if (this.pagination.totalPages >= 10) {
        left = Math.max(1, this.pagination.currentPage - 2)
        right = Math.min(
          this.pagination.currentPage + 2,
          this.pagination.totalPages
        )
      }
      for (let i = left; i <= right; i++) {
        pages.push(i)
      }
      return pages
    },
  },
}
</script>

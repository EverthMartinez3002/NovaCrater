<template>
  <BaseCard class="p-0 bg-transparent shadow-none">
    <div class="flex flex-wrap justify-between lg:flex-nowrap mb-5">
      <div>
        <h6 class="font-medium text-lg text-left dark:text-gray-200">
          {{ title }}
        </h6>

        <p
          class="
            mt-2
            text-sm
            leading-snug
            text-left text-gray-500
            dark:text-gray-400
            max-w-[680px]
          "
        >
          {{ description }}
        </p>
      </div>

      <div class="mt-4 lg:mt-0 lg:ml-2">
        <slot name="action" />
      </div>
    </div>

    <slot />
  </BaseCard>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
})
</script>

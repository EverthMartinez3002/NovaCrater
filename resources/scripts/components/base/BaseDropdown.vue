<template>
  <div class="relative" :class="wrapperClass">
    <BaseContentPlaceholders
      v-if="contentLoading"
      class="disabled cursor-normal pointer-events-none"
    >
      <BaseContentPlaceholdersBox
        :rounded="true"
        class="w-14"
        style="height: 42px"
      />
    </BaseContentPlaceholders>
    <Menu v-else>
      <MenuButton ref="trigger" class="focus:outline-none" @click="onClick">
        <slot name="activator" />
      </MenuButton>

      <div ref="container" class="z-10" :class="widthClass">
        <transition
          enter-active-class="transition duration-100 ease-out"
          enter-from-class="scale-95 opacity-0"
          enter-to-class="scale-100 opacity-100"
          leave-active-class="transition duration-75 ease-in"
          leave-from-class="scale-100 opacity-100"
          leave-to-class="scale-95 opacity-0"
        >
          <MenuItems :class="containerClasses">
            <div class="py-1">
              <slot />
            </div>
          </MenuItems>
        </transition>
      </div>
    </Menu>
  </div>
</template>

<script setup>
import { Menu, MenuButton, MenuItems } from '@headlessui/vue'
import { computed, onMounted, ref, onUpdated } from 'vue'
import { usePopper } from '@/scripts/helpers/use-popper'

const props = defineProps({
  containerClass: {
    type: String,
    required: false,
    default: '',
  },
  widthClass: {
    type: String,
    default: 'w-56',
  },
  positionClass: {
    type: String,
    default: 'absolute z-10 right-0',
  },
  position: {
    type: String,
    default: 'bottom-end',
  },
  wrapperClass: {
    type: String,
    default: 'inline-block h-full text-left',
  },
  contentLoading: {
    type: Boolean,
    default: false,
  },
})

const containerClasses = computed(() => {
  const baseClass = `origin-top-right rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 dark:ring-gray-600 dark:ring-opacity-50 divide-y divide-gray-100 dark:divide-gray-700 focus:outline-none`
  return `${baseClass} ${props.containerClass}`
})

let [trigger, container, popper] = usePopper({
  placement: 'bottom-end',
  strategy: 'fixed',
  modifiers: [{ name: 'offset', options: { offset: [0, 10] } }],
})

function onClick() {
  popper.value.update()
}
</script>

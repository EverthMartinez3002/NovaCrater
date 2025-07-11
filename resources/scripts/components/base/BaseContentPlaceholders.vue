<template>
  <div :class="classObject">
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  rounded: {
    type: Boolean,
    default: false,
  },
  centered: {
    type: Boolean,
    default: false,
  },
  animated: {
    type: Boolean,
    default: true,
  },
})

const classObject = computed(() => {
  return {
    'base-content-placeholders': true,
    'base-content-placeholders-is-rounded': props.rounded,
    'base-content-placeholders-is-centered': props.centered,
    'base-content-placeholders-is-animated': props.animated,
  }
})
</script>

<style lang="scss">
@use 'sass:color';

$base-content-placeholders-primary-color: #ccc !default;
$base-content-placeholders-secondary-color: #eee !default;
$base-content-placeholders-border-radius: 6px !default;
$base-content-placeholders-line-height: 15px !default;
$base-content-placeholders-spacing: 10px !default;

@at-root .dark {
  $base-content-placeholders-primary-color: #4a4a4a !default;
  $base-content-placeholders-secondary-color: #383838 !default;

  // Animations
  @keyframes vueContentPlaceholdersAnimation {
    0% {
      transform: translate3d(-30%, 0, 0);
    }

    100% {
      transform: translate3d(100%, 0, 0);
    }
  }
  // Mixins
  @mixin base-content-placeholders {
    position: relative;
    overflow: hidden;
    min-height: $base-content-placeholders-line-height;
    background: $base-content-placeholders-secondary-color;

    .base-content-placeholders-is-rounded & {
      border-radius: $base-content-placeholders-border-radius;
    }

    .base-content-placeholders-is-centered & {
      margin-left: auto;
      margin-right: auto;
    }

    .base-content-placeholders-is-animated &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100vw;
      max-width: 1000px;
      height: 100%;
      background: linear-gradient(
        to right,
        transparent 0%,
        color.adjust(
          $base-content-placeholders-secondary-color,
          $lightness: -5%
        )
          15%,
        transparent 30%
      );
      animation-duration: 1.5s;
      animation-fill-mode: forwards;
      animation-iteration-count: infinite;
      animation-name: vueContentPlaceholdersAnimation;
      animation-timing-function: linear;
    }
  }
}

// Animations
@keyframes vueContentPlaceholdersAnimation {
  0% {
    transform: translate3d(-30%, 0, 0);
  }

  100% {
    transform: translate3d(100%, 0, 0);
  }
}

// Mixins
@mixin base-content-placeholders {
  position: relative;
  overflow: hidden;
  min-height: $base-content-placeholders-line-height;
  background: $base-content-placeholders-secondary-color;

  .base-content-placeholders-is-rounded & {
    border-radius: $base-content-placeholders-border-radius;
  }

  .base-content-placeholders-is-centered & {
    margin-left: auto;
    margin-right: auto;
  }

  .base-content-placeholders-is-animated &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    max-width: 1000px;
    height: 100%;
    background: linear-gradient(
      to right,
      transparent 0%,
      color.adjust($base-content-placeholders-secondary-color, $lightness: -5%) 15%,
      transparent 30%
    );
    animation-duration: 1.5s;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
    animation-name: vueContentPlaceholdersAnimation;
    animation-timing-function: linear;
  }
}

@mixin base-content-placeholders-spacing {
  [class^='base-content-placeholders-'] + & {
    margin-top: 2 * $base-content-placeholders-spacing;
  }
}

// Styles
.base-content-placeholders-heading {
  display: flex;
  @include base-content-placeholders-spacing;

  &__img {
    margin-right: 1.5 * $base-content-placeholders-spacing;
    @include base-content-placeholders;
  }

  &__content {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
  }

  &__title {
    width: 85%;
    margin-bottom: $base-content-placeholders-spacing;
    background: $base-content-placeholders-primary-color;
    @include base-content-placeholders;
  }

  &__subtitle {
    width: 90%;
    @include base-content-placeholders;
  }
}

.base-content-placeholders-text {
  @include base-content-placeholders-spacing;

  &__line {
    width: 100%;
    margin-bottom: $base-content-placeholders-spacing;

    @include base-content-placeholders;

    &:first-child {
      width: 100%;
    }

    &:nth-child(2) {
      width: 90%;
    }

    &:nth-child(3) {
      width: 80%;
    }

    &:nth-child(4) {
      width: 70%;
    }
  }
}

.base-content-placeholders-box {
  position: relative;
  overflow: hidden;
  min-height: $base-content-placeholders-line-height;
  background: $base-content-placeholders-secondary-color;

  .base-content-placeholders-is-animated &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    max-width: 1000px;
    height: 100%;
    background: linear-gradient(
      to right,
      transparent 0%,
      color.adjust($base-content-placeholders-secondary-color, $lightness: -5%) 15%,
      transparent 30%
    );
    animation-duration: 1.5s;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
    animation-name: vueContentPlaceholdersAnimation;
    animation-timing-function: linear;
  }

  // @include base-content-placeholders-spacing;
}

.base-content-circle {
  border-radius: 100%;
}

.base-content-placeholders-is-rounded {
  border-radius: $base-content-placeholders-border-radius;
}
</style>

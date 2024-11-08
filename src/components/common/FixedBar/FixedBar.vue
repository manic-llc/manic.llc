<template>
  <component :is="is" class="fixed-bar"
    :class="{ scroll: scrollToggle, visible, horizontal, vertical, top, right, bottom, left }">
    <slot name="left"></slot>
    <slot name="center"></slot>
    <slot name=right></slot>
  </component>
</template>

<script setup lang=ts>
import { FixedBarProps, FixedBarDefaultProps } from './FixedBar.meta'

withDefaults(defineProps<FixedBarProps>(), FixedBarDefaultProps)
</script>

<style lang="scss" scoped>
.vertical {
  @include flex-column;
  @include position(fixed, null 0 null 0, 10);
  justify-content: v-bind(justify);
  align-items: v-bind(align);
  opacity: 0;
  height: 100%;

  &.right {
    @include position(fixed, 0 0 0 auto);
    transform: translateX(100%);
  }

  &.left {
    @include position(fixed, 0 auto 0 0);
    transform: translateX(-100%);
  }
}

.horizontal {
  @include flex-row;
  @include position(fixed, null 0 null 0, 10);
  justify-content: v-bind(justify);
  align-items: v-bind(align);
  opacity: 0;
  width: 100%;

  &.top {
    @include position(fixed, 0 0 auto 0);
    transform: translateY(-100%);
  }

  &.bottom {
    @include position(fixed, auto 0 0 0);
    transform: translateY(100%);
  }
}

.fixed-bar.visible {
  opacity: 1;
  transform: translateX(0%) translateY(0%);
}
</style>
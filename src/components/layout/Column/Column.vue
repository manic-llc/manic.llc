<template>
  <component is="div" class="column" :class="{ cascade }">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { type LayoutProps } from '../Layout.types'
import { DefaultColumnProps } from './Column.meta'
import { useLayout } from '../../../hooks/useLayout'

const props = withDefaults(defineProps<LayoutProps>(), DefaultColumnProps)

const { gap, margin, padding } = useLayout(props)
</script>

<style lang="scss" scoped>
.column {
  @include flex-column;
  @include size(100%);
  flex: v-bind(flex);
  justify-content: v-bind(justify);
  align-items: v-bind(align);
  gap: v-bind(gap);
  padding: v-bind(padding);
  margin: v-bind(margin);
}

.cascade :deep(> *) {
  @include cascade('fade-up');
}
</style>

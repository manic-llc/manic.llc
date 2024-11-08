<template>
  <component is="div" class="row">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { type LayoutProps } from '../Layout.types'
import { DefaultRowProps } from './Row.meta'
import { useLayout } from '../../../hooks/useLayout'

const props = withDefaults(defineProps<LayoutProps>(), {
  ...(DefaultRowProps as any),
})

const { gap, margin, padding } = useLayout(props)
</script>

<style lang="scss" scoped>
.row {
  @include flex-row;
  @include size(100%);
  flex: v-bind(flex);
  flex-shrink: 0;
  justify-content: v-bind(justify);
  align-items: v-bind(align);
  gap: v-bind(gap);
  padding: v-bind(padding);
  margin: v-bind(margin);
}
</style>

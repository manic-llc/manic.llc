<template>
  <RouterLink v-bind="$attrs" v-if="to" :to="to" @click="$emit('click')">
    <Icon v-if="icon" :name="icon" :size="15" />
    <span>
      <slot></slot>
    </span>
  </RouterLink>

  <button v-bind="$attrs" v-else @click="$emit('click')">
    <Icon v-if="icon" :name="icon" :size="15" />
    <span>
      <slot></slot>
    </span>
  </button>
</template>

<script setup lang="ts">
import { type Icon } from '../Icon/Icon.meta'

defineProps<{
  icon?: Icon
  to?: string
}>()

defineEmits(['click'])
</script>

<style lang="scss" scoped>
button,
a {
  @include flex-row;
  @include box(0.75 1);
  border: 3px solid $white;
  color: $white;
  font-weight: 300;
  border-radius: 100px;
}
</style>

<template>
  <figure class="avatar">
    <img :src="src" :alt="alt">
  </figure>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { AvatarProps, DefaultAvatarProps } from './Avatar.meta';

const props = withDefaults(defineProps<AvatarProps>(), DefaultAvatarProps)
const css = computed(() => props.size + 'px')
</script>

<style lang="scss" scoped>
$border-radius: var(--header-item-size);

.avatar {
  width: v-bind(css);
  height: v-bind(css);
  border-radius: v-bind(css);
  overflow: hidden;
}

img {
  @include size(100%);
  display: flex;
}
</style>
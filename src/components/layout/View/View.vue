<template>
  <main class="view" :class="{ padded, centered, column, row }">

    <slot />

  </main>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { ViewProps, DefaultViewProps } from './View.meta';
import { useViewport } from '../../../store/viewport';

withDefaults(defineProps<ViewProps>(), DefaultViewProps);

const viewport = useViewport();
const container = ref<HTMLElement | null>(null)

function onScroll(e: Event) {
  const { currentTarget: { scrollTop: next } } = e as any
  const prev = viewport.scrollPosition
  viewport.scrollPosition = next
  viewport.scrollDirection = next > prev ? 'DOWN' : 'UP'
}

onMounted(() => {
  if (!container.value) return
  container.value.addEventListener('scroll', onScroll)
})

onBeforeUnmount(() => {
  if (!container.value) return
  container.value.removeEventListener('scroll', onScroll)
})

</script>

<style lang="scss" scoped>
.view {
  @include position(fixed, 0 0 0 0, 5);
  overflow-y: auto;
  padding-left: calc(var(--nav-width));
}

.row {
  @include flex-row(flex-start, flex-start);
}

.column {
  @include flex-column(flex-start, flex-start);
}

.padded {
  @include padding;
  padding-left: calc(var(--nav-width) + var(--base-margin));
}

.centered {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
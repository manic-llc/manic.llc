<template>
  <legend>
    <strong>{{ items.length }} items</strong>
  </legend>
</template>

<script setup lang="ts">
import { Datum } from "../../util/charts"

defineProps<{
  items: Datum[];
  total: number;
}>();
</script>

<style lang="scss" scoped>
legend {
  @include position(absolute, 0 0 null null);
  @include blur(5px);
  text-align: center;
  font-size: 0.5rem;
  padding: 0.5rem;
  margin: 0;
  margin-left: auto;
  display: flex;
}

strong {
  font-weight: 700;
  color: var(--white-100);
}
</style>

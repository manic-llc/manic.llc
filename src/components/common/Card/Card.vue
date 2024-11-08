<template>
  <div class="card">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.card {
  @include box;
  @include flex-column;
  border-radius: var(--card-border-radius);
  overflow: hidden;
}
</style>
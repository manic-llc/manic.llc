<template>
  <img src="/logo.jpg" />
</template>

<style lang="scss" scoped>
img {
  @include position(fixed, 1rem null null 1rem, 20);
  @include size(70px, auto);
  mix-blend-mode: overlay;
  :deep(*) {
    fill: white;
  }
}
</style>

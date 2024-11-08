<template>
  <View>
    <Column align="left" :padding="viewport.mobile ? 1 : 3" :flex="1" :gap="1" cascade>
      <H1>we are <strong>manic</strong></H1>
      <P>a boutique design & engineering firm</P>
    </Column>
  </View>
</template>

<script setup lang="ts">
const viewport = useViewport()
</script>

<style lang="scss" scoped>
h1 {
  color: rgba(255, 255, 255, 0.4);
}
strong {
  color: $white;

  @include mobile {
    display: block;
    font-size: 25vw;
  }
}
</style>

<route lang="yaml">
name: Home
meta:
  protected: false
</route>

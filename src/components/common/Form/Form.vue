<template>
  <form v-bind="$attrs" @submit.prevent="onSubmit" class="form">
    <slot></slot>
    <Button icon="save">{{ submitText }}</Button>
  </form>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    submitText?: string
  }>(),
  {
    submitText: 'Submit',
  }
)

const emits = defineEmits(['submit'])

function onSubmit(e) {
  e.preventDefault()
  const formData = new FormData(e.target)
  const formProps = Object.fromEntries(formData)
  emits('submit', formProps)
}
</script>

<style lang="scss" scoped>
form,
form :deep(label) {
  @include flex-column(flex-start, flex-start);
}

form {
  @include box(1 0, 0.5);
  position: relative;
}
</style>

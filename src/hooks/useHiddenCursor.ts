import { watch, ref, onMounted, onBeforeUnmount } from 'vue'

export function useHiddenCursor(element: HTMLElement) {
  const visible = ref<boolean>(true)
  const timeout = ref<any>(null)

  watch(
    () => visible.value,
    (val) => {
      element.style.cursor = val ? 'default' : 'none'
    }
  )

  function onMouseMove() {
    visible.value = true

    clearTimeout(timeout.value)

    timeout.value = setTimeout(() => {
      visible.value = false
    }, 500)
  }

  onMounted(() => {
    element.addEventListener('mousemove', onMouseMove)
  })

  onBeforeUnmount(() => {
    element.removeEventListener('mousemove', onMouseMove)
  })
}

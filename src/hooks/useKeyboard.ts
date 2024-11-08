import { computed, onMounted, onBeforeUnmount, ComputedRef } from 'vue';

export function useKeyboard(keyMap: Ref | ComputedRef<Record<string, () => unknown>>) {
  const keys = computed(() => {
    return Object.keys(keyMap.value)
  })

  function onKeyDown({ key }) {
    if (keys.value.indexOf(key) !== -1) {
      keyMap.value?.[key]?.()
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', onKeyDown)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKeyDown)
  })
}
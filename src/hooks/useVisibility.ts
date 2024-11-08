import { ref } from 'vue'

export function useVisibility(initialValue: boolean = true) {
  const visible = ref<boolean>(initialValue);

  function show() {
    visible.value = true;
  }

  function hide() {
    visible.value = false;
  }

  function toggle() {
    visible.value = !visible.value;
  }

  return {
    visible,
    show,
    hide,
    toggle,
  };
}

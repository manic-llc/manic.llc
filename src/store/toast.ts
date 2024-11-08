import { defineStore, acceptHMRUpdate } from 'pinia';
import { ref } from 'vue';
import { useVisibility } from '../hooks/useVisibility';

export const useToast = defineStore("toast", () => {
  const { visible, show, hide } = useVisibility(false);
  const text = ref("");
  const duration = ref(2500);
  const timeout = ref<any>(0);

  function message(string: string) {
    text.value = string;
    show();
    clearTimeout(timeout.value);
    timeout.value = setTimeout(() => hide(), duration.value);
  }

  return {
    visible,
    text,
    message,
  };
});

if (import.meta?.hot?.accept && typeof acceptHMRUpdate !== 'undefined') {
  import.meta.hot.accept(acceptHMRUpdate?.(useToast, import.meta.hot));
}
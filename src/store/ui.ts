import { defineStore, acceptHMRUpdate } from 'pinia';
import { ref } from 'vue'

export const useUI = defineStore("ui", () => {
  const hideHeader = ref<boolean>(false);

  return {
    hideHeader
  };
});

if ((import.meta as any)?.hot?.accept && typeof acceptHMRUpdate !== 'undefined') {
  (import.meta as any).hot.accept(acceptHMRUpdate?.(useUI, (import.meta as any).hot));
}
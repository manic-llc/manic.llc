import { ref } from 'vue';
import { TransitionSpeed, TransitionType } from '@/types/transitions';
import { defineStore, acceptHMRUpdate } from 'pinia';

export const useTransition = defineStore('transition', () => {
  const speed = ref<TransitionSpeed>('long')
  const type = ref<TransitionType>('fade')

  return {
    speed,
    type
  }
});

if ((import.meta as any)?.hot?.accept && typeof acceptHMRUpdate !== 'undefined') {
  (import.meta as any).hot.accept(acceptHMRUpdate?.(useTransition, (import.meta as any).hot));
}
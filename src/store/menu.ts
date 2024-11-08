import { defineStore, acceptHMRUpdate } from 'pinia';
import { computed, watch } from 'vue'
import { useNavigation } from '../hooks/useNavigation'
import { useRoute } from 'vue-router'
import { useVisibility } from '../hooks/useVisibility'

export const useMenu = defineStore("menu", () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { visible, show, hide, toggle } = useVisibility(route?.meta?.hideNavigation !== true);
  const meta = computed(() => route.meta);

  watch(route, (val) => {
    if (val?.meta?.hideNavigation === true) {
      if (visible.value) hide();
    } else {
      if (!visible.value) show();
    }
  });

  return {
    visible,
    show,
    hide,
    toggle,
    navigation,
    meta,
    route,
  };
});

if (import.meta?.hot?.accept && typeof acceptHMRUpdate !== 'undefined') {
  import.meta.hot.accept(acceptHMRUpdate?.(useMenu, import.meta.hot));
}
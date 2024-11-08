import { computed } from 'vue';
import { type Artboard } from "../types/artboard";

export function useCanvas(props: Artboard) {
  const size = computed(() => [props.width, props.height, props.dpr]);

  const artboard = computed(() => {
    return {
      width: props.width * (props.dpr || 1),
      height: props.height * (props.dpr || 1),
    };
  });

  const css = computed(() => ({
    width: `${size.value[0]}px`,
    height: `${size.value[1]}px`,
  }));

  return {
    size,
    css,
    artboard,
  };
}

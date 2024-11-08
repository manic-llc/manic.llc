import { SpacingProps } from './../types/box';
import { computed, reactive } from "vue";

export function useSpacing(props: SpacingProps) {
  const padding = computed(() => {
    if (Array.isArray(props.padding))
      return props.padding.reduce((acc, rule) => {
        acc += `calc(${rule} * 1rem) `;
        return acc;
      }, "");

    return `calc(${props.padding} * 1rem)`;
  });

  const margin = computed(() => {
    if (Array.isArray(props.margin))
      return props.margin.reduce((acc, rule) => {
        acc += `calc(${rule} * 1rem) `;
        return acc;
      }, "");

    return `calc(${props.margin} * 1rem)`;
  });

  const gap = computed(() => {
    if (Array.isArray(props.gap))
      return props.gap.reduce((acc, rule) => {
        acc += `calc(${rule} * 1rem) `;
        return acc;
      }, "");

    return `calc(${props.gap} * 1rem)`;
  });

  return reactive({ padding, margin, gap })
}

import { computed } from "vue";
import { ensureCSSUnit } from '../util/css';
import { useSpacing } from '../hooks/useSpacing';
import { SpacingProps } from "@/types/box";

export function useLayout(props: SpacingProps) {
  const gap = computed(() => ensureCSSUnit(props.gap || 0));
  const { margin, padding } = useSpacing(props);
  const flex = computed(() => props.flex)

  return {
    gap,
    margin,
    padding,
    flex
  }
}
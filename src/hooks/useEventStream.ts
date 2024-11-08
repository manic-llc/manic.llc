import { ArtBoardWithDomains } from "../types/artboard";
import { zoomIdentity } from "d3-zoom";

export function useEventStream(props: ArtBoardWithDomains) {
  const mapping = useTimeScale(props);
  const canvas = useCanvas(props);
  const transform = ref(zoomIdentity);
  const rangeX = computed(() => mapping.rangeX.value);
  const rangeY = computed(() => mapping.rangeY.value);
  const domainX = computed(() => mapping.domainX.value);
  const domainY = computed(() => mapping.domainY.value);
  const scaleX = computed(() => mapping.scaleX.value);
  const scaleY = computed(() => mapping.scaleY.value);
  const size = computed(() => canvas.size.value);
  const artboard = computed(() => canvas.artboard.value);
  const css = computed(() => canvas.css.value);

  return {
    rangeX,
    rangeY,
    domainX,
    domainY,
    scaleX,
    scaleY,
    size,
    artboard,
    css,
    transform,
  };
}

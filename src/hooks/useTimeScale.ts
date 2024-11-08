import { computed } from 'vue';
import { ArtBoardWithDomains } from "./../types/artboard";
import { scaleTime, scaleLinear } from "d3-scale";
import subSeconds from "date-fns/subSeconds";

function buildDomain(props: ArtBoardWithDomains, domain) {
  return typeof props.seconds === "number"
    ? [new Date(), subSeconds(new Date(), props.seconds)]
    : Array.isArray(props[domain])
      ? props[domain]
      : null;
}

export function useTimeScale(props: ArtBoardWithDomains) {
  const rangeX = computed(() => [0, props.width as number]);
  const rangeY = computed(() => [0, props.height as number]);
  const domainX = computed(() => buildDomain(props, "domainX"));
  const domainY = computed(() => buildDomain(props, "domainY"));
  const scaleX = computed(() => {
    return scaleTime(domainX.value as Date[], rangeX.value);
  });
  const scaleY = computed(() => {
    return scaleLinear(domainY?.value || [0 - 1], rangeY.value);
  });

  return {
    rangeX,
    rangeY,
    domainX,
    domainY,
    scaleX,
    scaleY,
  };
}

<template>
  <svg ref="svg" :width="typeof width === 'number' ? width + padding : 0" :height="padding">
    <g ref="g" :transform="`translate(${padding}, 0)`"></g>
  </svg>
</template>

<script setup lang="ts">
import { TimeSeriesProps } from "../../util/charts"
import { select } from "d3-selection";
import { axisBottom } from "d3-axis";
import { scaleLinear } from "d3-scale";

const props = defineProps<TimeSeriesProps>();
const padding = 20;
const svg: Ref<SVGElement | null> = ref(null);
const g: Ref<SVGGElement | null> = ref(null);
const initialized = ref(false);
const tickRange = [320, 480, 600, 720, 1440, 1920];
const tickDomain = [4, 5, 6, 7, 8, 12];
const ticks = computed(() => scaleLinear(tickRange, tickDomain)(props.width));
const xAxis = computed(() => axisBottom(props.scale).ticks(ticks.value));

function update() {
  select(g.value).call(xAxis.value as any);
}
function init() {
  update();
  initialized.value = true;
}

watch(
  () => [props.transform, props.scale, props.width],
  () => {
    if (initialized.value) update();
  },
);

onMounted(() => {
  init();
});
</script>

<style lang="scss" scoped>
svg {
  @include position(absolute, 100% 0 null 0);
  transform: translateY(-100%);
}
</style>

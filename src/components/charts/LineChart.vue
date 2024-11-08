<template>
  <D3 class="line-chart" ref="wrapper" v-bind="$props">
    <slot></slot>
  </D3>
</template>

<script setup lang="ts">
import { BarChartProps, BaseBarChartProps } from "../../util/charts"
import { line, area, curveBasisOpen as curve } from 'd3-shape'

const props = withDefaults(defineProps<BarChartProps>(), BaseBarChartProps as any);
const wrapper = ref();
const ctx: Ref<CanvasRenderingContext2D | null> = ref(null);
const gradient = ref();

const emit = defineEmits(['domain'])

watch(
  () => [props.width, props.height, props.dpr, props.lineWidth, props.strokeStyle],
  async () => {
    if (!ctx.value) return;
    initCTX()
  },
);

watch(
  () => wrapper.value?.transform,
  () => {
    emit('domain', wrapper.value.scales.x.domain())
    tick()
  },
);

async function initCTX() {
  if (!ctx.value) return
  await nextTick();
  ctx.value.scale(props.dpr, props.dpr)
  if (props.gradient) {
    gradient.value = ctx.value.createLinearGradient(0, 0, 0, props.height)
    gradient.value.addColorStop(0, props.gradient[0])
    gradient.value.addColorStop(1, props.gradient[1])
  }
  ctx.value?.resetTransform();
  ctx.value?.scale(props.dpr, props.dpr);
  ctx.value.strokeStyle = props.stroke ? props.gradient ? gradient.value : props.strokeStyle : 'transparent';
  ctx.value.fillStyle = props.fill ? props.gradient ? gradient.value : props.fillStyle : 'transparent'
  ctx.value.lineJoin = props.lineJoin;
  ctx.value.lineCap = props.lineCap;
  tick();
}

function tick() {
  if (!ctx.value) return
  const { width, height, dataset }: any = props;
  const { x, y } = wrapper.value.scales
  const data = dataset.map((coords: number[]) => [x(coords[0]), y(coords[1])])
  ctx.value.lineWidth = Math.max(wrapper.value.transform.k, .25) * props.lineWidth
  ctx.value.clearRect(0, 0, width, height);
  ctx.value.beginPath()
  const path = area().y0(height + props.lineWidth).curve(curve).context(ctx.value)
  path(data)
  // ctx.value.closePath()
  props.fill && ctx.value.fill()
  props.stroke && ctx.value.stroke()
}

onMounted(async () => {
  ctx.value = wrapper.value.canvas.getContext("2d") || null;
  if (!ctx.value) return
  initCTX()
});
</script>

<style lang="scss">
.line-chart * {
  @include chart-type;
}
</style>

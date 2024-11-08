<template>
  <D3 class="bar-chart" ref="wrapper" v-bind="$props">
    <slot></slot>
  </D3>
</template>

<script setup lang="ts">
import { BarChartProps, BaseBarChartProps, Datum } from "../../util/charts";

const props = withDefaults(defineProps<BarChartProps>(), BaseBarChartProps as any);

const wrapper = ref();
const ctx: Ref<CanvasRenderingContext2D | null> = ref(null);
const gradient = ref()

const fillStyle = computed(() => {
  if (Array.isArray(props.fillStyle)) {
    const [r, g, b] = props.fillStyle
    return [`rgba(${r}, ${g}, ${b}, 0)`, `rgba(${r}, ${g}, ${b}, 1)`, `rgba(${r}, ${g}, ${b}, 0)`]
  } else {
    return ['transparent', props.fillStyle, 'transparent']
  }

})

watch(
  () => [props.width, props.height, props.dpr],
  async (size) => {
    if (!ctx.value) return;
    await nextTick();
    ctx.value?.resetTransform();
    ctx.value?.scale(size[2], size[2]);
    ctx.value.lineWidth = props.lineWidth;
    ctx.value.fillStyle = gradient.value
    ctx.value.strokeStyle = props.strokeStyle;
    createGradient()
    tick();
  },
);

defineExpose({
  selectRange: ([from, to]: [Date, Date]) => {
    return wrapper.value.selectRange([from, to]);
  },
});

watch(
  () => [props.dataset, props.scales, wrapper.value?.transform],
  () => tick(),
);



function createGradient() {
  if (!ctx.value) return
  gradient.value = ctx.value.createLinearGradient(0, 0, props.width, props.height);
  gradient.value.addColorStop(0, fillStyle.value[0]);
  // gradient.value.addColorStop(0.25, props.strokeStyle);
  gradient.value.addColorStop(0.5, fillStyle.value[1]);
  // gradient.value.addColorStop(0.75, props.strokeStyle);
  gradient.value.addColorStop(1, fillStyle.value[2]);
}

function tick() {
  const { width, height, lineWidth, dataset } = props;
  const xScale = wrapper.value.scales.x as any;
  const yScale = wrapper.value.scales.y as any;

  let started = true;
  let finished = false;

  const queue = [() => ctx.value?.clearRect(0, 0, width, height)]
  const path = new Path2D();
  const visible: Datum[] = [];

  const adjustedLineWidth = () => Math.min(width / visible.length / 2, 10);

  (dataset as any[])?.forEach?.((values: any) => {
    if (finished) return;

    const x = xScale?.(values[0]) || null;

    if (x >= 0) {
      if (!started) started = true;
    } else {
      return;
    }

    if (x > width) {
      finished = true;
      return;
    }

    const y = yScale?.(values[1]);

    queue.push(() => path?.[props.rounded ? 'roundRect' : 'rect'](x - adjustedLineWidth() / 2, y, adjustedLineWidth(), height - y, adjustedLineWidth()))

    visible.push(values);
  });

  wrapper.value.setVisibility(visible);

  if (!ctx.value) return

  queue.push(() => ctx.value?.fill(path))

  queue.forEach(q => q())
}

onMounted(async () => {
  await nextTick();
  ctx.value = wrapper.value.canvas.getContext("2d") || null;
  if (!ctx.value) return
  ctx.value.scale(props.dpr, props.dpr)
  createGradient()
  ctx.value.fillStyle = gradient.value
  tick();
});

onUnmounted(() => { });
</script>

<style lang="scss">
.bar-chart * {
  @include chart-type;
}
</style>

<template>
  <D3 class="bar-chart stream" ref="wrapper" v-bind="$props">
    <slot></slot>
  </D3>
</template>

<script setup lang="ts">
import { BarChartProps, Datum } from "../../util/charts"

const type = "LINE";
const props = withDefaults(defineProps<BarChartProps>(), {} as any);

const wrapper = ref();
const ctx: Ref<CanvasRenderingContext2D | null> = ref(null);

watch(
  () => [props.width, props.height, props.dpr, props.strokeStyle, props.lineWidth],
  async ([width, height, dpr]) => {
    if (!ctx.value) return;
    await nextTick();
    ctx.value?.resetTransform();
    ctx.value?.scale(dpr, dpr);
    tick();
  },
);

defineExpose({
  selectRange: ([from, to]: [Date, Date]) => {
    return wrapper.value.selectRange([from, to]);
  },
});

watch(
  () => [props.domainX, props.domainY],
  () => {
    tick();
  },
);

function tick() {
  if (type === "LINE") {
    props.dataset?.length && lineTick(props.dataset);
    return;
  }

  // return barTick();
}

function lineTick(dataset) {
  const { width, height }: any = props;
  const xScale = wrapper.value.scales.x as any;
  const yScale = wrapper.value.scales.y as any;

  let initializing = false;
  let initialized = false;
  let finalized = false;

  const path = new Path2D();

  let total = 0;

  dataset.forEach?.((coords: [number, number], i: number) => {
    if (finalized) return;

    const x = xScale?.(coords[0]) || null;
    const y = yScale?.(coords[1]) || null;

    if (x <= 0) return;

    if (x >= width) {
      path.lineTo(x, y);
      finalized = true;
      return;
    } else if (!initialized) {
      const x = xScale?.(dataset[i - 2 < 0 ? 0 : i - 2][0]) || null;
      const y = yScale?.(dataset[i - 2 < 0 ? 0 : i - 2][1]) || null;
      path.moveTo(x, y);
      total++;
      initializing = true;
    }

    if (initializing) {
      path.lineTo(x, y);
      initializing = false;
      initialized = true;
    } else {
      path.lineTo(x, y);
    }
  });

  if (!ctx.value) return;

  ctx.value?.clearRect(0, 0, width, height);

  ctx.value.lineJoin = props.lineJoin;
  ctx.value.lineCap = props.lineCap;
  ctx.value.lineWidth = props.lineWidth;
  ctx.value.strokeStyle = props.color;
  ctx.value?.stroke(path);
}

function barTick(now = window.performance.now()) {
  const { width, height, lineWidth, dataset } = props;
  const xScale = wrapper.value.scales.x as any;
  const yScale = wrapper.value.scales.y as any;

  let started = true;
  let finished = false;

  ctx.value?.clearRect(0, 0, width, height);

  const path = new Path2D();

  const visible: Datum[] = [];

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

    path?.rect(x - lineWidth / 2, y, lineWidth, height - y);

    visible.push(values);
  });

  wrapper.value.setVisibility(visible);

  ctx.value.fillStyle = props.fillStyle;
  ctx.value?.fill(path);
}

onMounted(async () => {
  await nextTick();
  ctx.value = wrapper.value.canvas.getContext("2d") || null;
  if (!ctx.value) return;
  ctx.value.scale(props.dpr, props.dpr);
  tick();
});

onUnmounted(() => { });
</script>

<style lang="scss">
.bar-chart * {
  @include chart-type;
}
</style>

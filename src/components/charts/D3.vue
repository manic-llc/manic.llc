<template>
  <figure ref="container" :style="styles">
    <slot></slot>
    <AxisX v-if="props.showXAxis" />
    <AxisY v-if="props.showYAxis" />
    <!-- <Selection ref="cursor" @select-start="initTween" @select-end="selectRange" /> -->
    <BaseCanvas name="canvas" ref="canvas" />
    <!-- <Legend :items="visible" :total="visible.length"></Legend> -->
  </figure>
</template>

<script setup lang="ts">
import { type Ref, ref, inject, watch } from "vue";
import { ZoomBehavior, zoomIdentity, ZoomTransform } from "d3-zoom";
import { type ScaleRecord, type BaseProps, DefaultProps, BarChartProps, Datum } from "../../util/charts";
import { select } from "d3-selection";
import { interpolateNumber } from "d3-interpolate";
import { v4 } from "uuid";

const register = inject("register") || (null as any);
const updateTransform = inject("update:transform") || (null as any);
const visible = ref<Datum[]>([]);

register?.(setTransform);

const props = withDefaults(defineProps<BaseProps | BarChartProps>(), DefaultProps as any);

const id = ref(v4());
const canvas = ref();
const cursor = ref();
const raf = useRAF();
const container: Ref<HTMLElement | null> = ref(null);
const zoomInstance: Ref<ZoomBehavior<Element, unknown> | null> = ref(null);
const zoomRef: Ref<any> = ref();
const transform: Ref<ZoomTransform> = ref(zoomIdentity);
const padding: ComputedRef<number> = computed(() => props.padding);
const tweening: Ref<boolean> = ref(false);
const paddedWidth: ComputedRef<number> = computed(() => props.width - (props.showYAxis ? props.padding : 0));
const paddedHeight: ComputedRef<number> = computed(() => props.height);
const scales: Ref<ScaleRecord> = ref(buildScales(props as any));

const referenceScales: Ref<ScaleRecord> = ref(
  Object.freeze({
    x: scales.value.x?.copy(),
    y: scales.value.y?.copy(),
  }),
);

const styles = computed(() => ({
  "padding-left": props.showYAxis ? padding.value + "px" : "initial",
  "padding-bottom": "initial",
}));

watch(
  () => [props.width, props.height],
  async () => {
    scales.value = buildScales(props as any);
    referenceScales.value = Object.freeze({
      x: scales.value.x?.copy(),
      y: scales.value.y?.copy(),
    });
    applyZoom();
  },
);

watch(
  () => [props.dataset, props.domainX],
  (val) => {
    if (props.stream) return;
    if (val.length === 0) return;
    scales.value = buildScales(props as any);
    transform.value = zoomIdentity;
  },
  { deep: true },
);

let loop = false;

watch(
  () => transform.value,
  (val, old = zoomIdentity) => {
    if (props.stream) return;

    if (val?.x === old?.x && val?.y === old?.y && val?.k === old?.k) return;

    if (props.zoomX) scales.value.x = val.rescaleX(referenceScales.value.x);
    if (props.zoomY) scales.value.y = val.rescaleY(referenceScales.value.y);

    const { x, y, k } = val;
    const $el = select(canvas?.value?.$el());
    zoomInstance.value?.translateTo($el, x, y);
    zoomInstance.value?.scaleTo($el, k);
    (container.value as any).__zoom = zoomIdentity.translate(x, y).scale(k)

    if (loop === true) {
      loop = false;
      return;
    }

    updateTransform?.(val);
  },
);

function setTransform(value: ZoomTransform) {
  loop = true;
  transform.value = value;
}

function _setTransform(value: ZoomTransform) {
  loop = false;
  transform.value = value;
}

function initTween() {
  tweening.value = true;
}

function buildTransformInterpolator(raw: [Date, Date]) {
  const range = raw
    .map((date: Date) => date.valueOf())
    .sort((a, b) => (a > b ? 1 : -1))
    .map((d) => new Date(d));

  const delta = scales.value.x(range[1]) - scales.value.x(range[0]);
  const scale = paddedWidth.value / delta;
  const translate = -scales.value.x(range[0]);
  const t = zoomIdentity.scale(scale).translate(translate, 0);

  const iX = interpolateNumber(transform.value.x, t.x);
  const iY = interpolateNumber(transform.value.y, t.y);
  const iK = interpolateNumber(transform.value.k, t.k);

  return (progress: number) => zoomIdentity.translate(iX(progress), iY(progress)).scale(iK(progress));
}

let _stop: Function | null = null;

async function selectRange(raw: [Date, Date]) {
  const $element = select(cursor.value.$el());
  const zoom = zoomInstance.value?.transform as any;
  const iZoom = buildTransformInterpolator(raw);
  if (_stop !== null) _stop();

  raf.remove(id.value);

  raf.add(
    {
      duration: 500,
      tick({ progress }) {
        const transform = iZoom(progress);
        $element.call(zoom, transform);
        _setTransform(transform);

        if (progress === 1) {
          tweening.value = false;
        }
      },
    },
    id.value,
  );
}

function applyZoom() {
  zoomRef.value?.();

  zoomRef.value = initZoom({
    setTransform: _setTransform,
    zoomInstance,
    element: container.value as any,
    scales,
    tweening,
  });
}

provide("props", toRefs(props));
provide("scales", scales);
provide("transform", transform);
provide("width", paddedWidth);
provide("height", paddedHeight);
provide("padding", padding);

defineExpose({
  scales,
  canvas,
  transform,
  setTransform,
  visible,
  initTween,
  selectRange,
  setVisibility(items: Datum[]) {
    visible.value = items;
  },
});

onMounted(async () => {
  if (!props.zoomX && !props.zoomY) return;
  await nextTick();
  applyZoom();
});
</script>

<style lang="scss" scoped>
figure {
  position: relative;
}

.selection {
  @include position(absolute, 0 0 null null);
}

legend {
  position: absolute;
}
</style>

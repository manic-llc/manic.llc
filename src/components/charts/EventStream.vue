<template>
  <RAF ref="raf" :tick="tick" class="event-stream">
    <div flex-row>
      <canvas ref="canvas" v-bind="{ ...references.artboard, style: references.css }" />
    </div>
  </RAF>
</template>

<script setup lang="ts">
import { scaleLinear, scaleTime } from "d3-scale";
import { useEventStream } from "../../hooks/useEventStream";
import { subSeconds } from "date-fns";
import isWithinInterval from "date-fns/isWithinInterval";

export interface EventStreamProps {
  width: number;
  height: number;
  dpr?: number;
  domainX?: (Date | number)[];
  domainY?: (Date | number)[];
  seconds?: number;
  lineWidth: number;
}

const colors = [
  [10, 182, 255],
  [143, 79, 199],
  [255, 77, 136],
  [255, 153, 20],
  [7, 192, 158],
];


const raf = ref();
const props = defineProps<EventStreamProps>();
const events = useEventStream(props)
const references = reactive(events);
const stream = useMockEventStream();
const canvas = ref();
const ctx = ref();
const datasets = Object.keys(stream.models).reduce((acc: any, key: any) => {
  acc.push({
    key,
    colors: stream.models[key].colors,
    items: stream.models[key].events,
    lineWidth: props.lineWidth,
  });
  return acc;
}, []);
const gradient = ref();

watch(
  () => [props.width, props.height, props.dpr, events, stream],
  async () => {
    await nextTick();
    ctx.value.resetTransform();
    ctx.value.scale(props.dpr, props.dpr);
    createGradient()
  },
  { deep: true },
);

let queue = [() => ctx.value.clearRect(0, 0, props.width, props.height)];

function createGradient() {
  gradient.value = ctx.value.createLinearGradient(0, props.height / 2, props.width, props.height / 2);
  let color = colors[0];
  gradient.value.addColorStop(0, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0)`);
  color = colors[1];
  gradient.value.addColorStop(0.2, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0)`);
  color = colors[2];
  gradient.value.addColorStop(0.5, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 1)`);
  color = colors[0];
  gradient.value.addColorStop(0.8, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0)`);
  color = colors[1];
  gradient.value.addColorStop(1, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0)`);
}
function tick() {
  datasets.forEach((dataset) => line(dataset));
  queue.forEach((m) => m());
  queue = [() => ctx.value.clearRect(0, 0, props.width, props.height)];
}

function paint({ key, color, items: dataset }) {
  const domainX = [new Date(), subSeconds(new Date(), props.seconds * 200)];

  const {
    size: [width, height],
  } = references;
  const scaleX = scaleTime([domainX[1], domainX[0]] as Date[], [0, width]);
  const scaleY = scaleLinear([0, 100], [height, 0]);
  const visible: Datum[] = dataset.filter((datum) =>
    isWithinInterval(datum[0], { start: domainX[1], end: domainX[0] }),
  );

  visible.forEach(([_x, _y]) => {
    const x = scaleX(_x);
    const y = scaleY(_y);
    ctx.value.fillStyle = color;
    ctx.value.fillRect(x - lineWidth / 2, y, lineWidth, height - y);
  });
}

function line({ key, colors, items: dataset, lineWidth }) {
  queue.push(() => {
    ctx.value.strokeStyle = `rgb(${colors[0]}, ${colors[1]}, ${colors[2]})`;
    ctx.value.lineWidth = lineWidth;
  });

  const domainX = [new Date(), subSeconds(new Date(), props.seconds)];

  const {
    size: [width, height],
  } = references;
  const scaleX = scaleTime([domainX[1], domainX[0]] as Date[], [0, width]);
  const scaleY = scaleLinear([0, 100], [height, 0]);
  const visible: Datum[] = dataset.filter((datum) =>
    isWithinInterval(datum[0], { start: domainX[1], end: domainX[0] }),
  );

  queue.push(() => ctx.value.beginPath());

  visible.forEach?.((coords: [number, number], i: number) => {
    const x = scaleX?.(coords[0]) || null;
    const y = scaleY?.(coords[1]) || null;

    queue.push(() => (i === 0 ? ctx.value.moveTo(x, y) : ctx.value.lineTo(x, y)));
  });

  queue.push(() => {
    ctx.value.save();
    ctx.value.globalCompositeOperation = "soft-light";
    ctx.value.strokeStyle = gradient.value;
    ctx.value?.stroke();
    ctx.value.restore();
  });
}

onMounted(() => {
  ctx.value = canvas.value.getContext("2d");
  ctx.value.resetTransform();
  ctx.value.scale(props.dpr, props.dpr);
  createGradient()
});
</script>

<template>
  <div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { v4 } from "uuid";

export interface RAFProps {
  tick: any;
  autoStart?: boolean;
}

const props = withDefaults(defineProps<RAFProps>(), { autoStart: true });
const raf = useRAF();
const id = ref(v4());
const active = ref(false);

function start() {
  raf.add(
    {
      tick({ now }: { now: DOMHighResTimeStamp }) {
        props.tick?.(now);
      },
    },
    id.value,
  );
  active.value = true;
}

function stop() {
  raf.remove(id.value);
  active.value = false;
}

defineExpose({
  start,
  stop,
  active,
});

onMounted(() => {
  if (props.autoStart) start();
});

onBeforeUnmount(() => {
  stop();
});
</script>

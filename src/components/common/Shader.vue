<template>
  <div class="shader" ref="container" @click="$emit('click')" />
</template>

<script setup lang="ts">
import { type ShallowRef } from "vue";
import { Shader, type ShaderConfig } from "@shaderpad/core";
import { v4 } from "uuid";

defineEmits(["click"]);

const props = withDefaults(defineProps<ShaderConfig>(), {
  width: window.innerWidth,
  height: window.innerHeight,
  dpr: window.devicePixelRatio,
  shader: `void main () { gl_FragColor = vec4(.8, .2, .6, 1.); }`,
  animate: false,
  fillViewport: true,
  variant: 0,
  stream: 0,
  volume: 1,
});

const raf = useRAF();
const instance: ShallowRef<Shader | null> = shallowRef(null);
const container: Ref<HTMLElement | undefined> = ref(props.parent);
const id: Ref<string> = ref(v4());
const totalUniforms: ComputedRef<number> = computed(() => props.uniforms?.length || 0);

defineExpose({ instance });

watch(
  () => [props.shader, totalUniforms.value],
  () => {
    if (!instance.value) return;
    instance.value?.rebuild({ shader: props.shader, uniforms: props.uniforms });
  },
);

watch(
  () => [props.volume, props.stream],
  ([volume, stream]) => {
    if (!instance.value) return;
    instance.value.volume = volume;
    instance.value.stream = stream;
  },
);

watch(
  () => [props.width, props.height, props.dpr],
  ([width, height, dpr]) => {
    if (!instance.value) return;
    instance.value.size = { width, height, dpr: 1 };
  },
);

watch(
  () => props.animate,
  (val) => {
    if (val) {
      raf.add(
        {
          tick: ({ now }: { now: DOMHighResTimeStamp }) => {
            instance.value?.tick?.(now);
          },
        },
        id.value,
      );
    } else {
      raf.remove(id.value);
    }
  },
  { immediate: true },
);

onMounted(() => {
  if (!container.value) return;

  instance.value = new Shader({
    ...props,
    parent: container.value,
  });
});

onBeforeUnmount(() => {
  instance.value?.destroy?.();
  raf.remove(id.value);
});
</script>

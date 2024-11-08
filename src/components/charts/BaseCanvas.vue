<template>
  <canvas ref="canvas" :class="name" :width="artboard.width" :height="artboard.height" :style="css" />
</template>

<script setup lang="ts">
import { type Ref, ref, inject, watch } from "vue";
import { useCanvas } from "../../hooks/useCanvas";

defineProps<{ name: string | undefined }>();

const paddedWidth = inject("width") as Ref<number>;
const paddedHeight = inject("height") as Ref<number>;

const canvas: Ref<HTMLCanvasElement | null> = ref(null);
const { artboard, css } = reactive(useCanvas({ width: paddedWidth.value, height: paddedHeight.value, dpr: window.devicePixelRatio }))

defineExpose({
  getContext: function (type: "2d" | "webgl" | "webgl2"): RenderingContext | null {
    const ctx = canvas.value?.getContext(type) || null;
    if (ctx instanceof CanvasRenderingContext2D) ctx.imageSmoothingEnabled = false;
    return ctx;
  },
  $el: () => canvas.value || null,
});
</script>

<style lang="scss" scoped>
canvas {
  display: block;
}
</style>

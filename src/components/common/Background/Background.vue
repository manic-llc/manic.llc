<template>
  <div class="background" ref="container"></div>
</template>

<script setup lang="ts">
import Shader from '@/classes/Shader'
import { shader, uniforms } from './shader.json'
import { interpolateNumberArray } from 'd3-interpolate'
import { selectVariant } from '@/util/webgl'
import { v4 } from 'uuid'

const container = ref()
const instance = ref()
const raf = useRAF()
const id = ref(v4())
const variant = ref(3)

async function tweenToVariant(i, duration = 2500) {
  const from = selectVariant(uniforms, variant.value).map((v) => v[2])
  const to = selectVariant(uniforms, i).map((v) => v[2])
  const iVariant = interpolateNumberArray(clone(from), clone(to))
  const cloned = clone(uniforms)

  await raf.add({
    duration,
    tick({ progress }) {
      const values = iVariant(progress)
      cloned.forEach((val, i) => {
        val[2] = values[i]
        instance.value.uniform = val
      })
    },
  })

  variant.value = i
}

onMounted(async () => {
  instance.value = new Shader({
    parent: container.value,
    fragmentShader: shader,
    dpr: 1,
    uniforms: selectVariant(uniforms, variant.value),
  })

  raf.add(
    {
      tick({ now }) {
        instance.value.tick(now)
      },
    },
    id.value
  )

  tweenToVariant(0)
})
</script>

<style lang="scss" scoped>
.background {
  @include size(100vw, 100vh);
  @include position(fixed, 0 0 0 0, -1);

  &:before {
    @include position(absolute, 0 0 0 0, 0);
    background: linear-gradient(to bottom right, rgba($purple, 0.9), rgba($pink, 0.8));
    content: '';
  }
}
</style>

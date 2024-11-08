import { BASE_EASING } from '../constants/transitions'
import { defineStore, acceptHMRUpdate } from 'pinia'
import { clamp } from '../util/numbers'
import { ref, computed, type Ref, type ComputedRef, watch } from 'vue'
import { Animation, GlobalAnimation } from '../types/animation'
import { v4 } from 'uuid'

export const useRAF = defineStore('raf', () => {
  const queue: Animation[] = []
  const map: Record<string, Animation | GlobalAnimation> = {}
  let mapKeys: string[] = []
  const raf: Ref<number> = ref(0)
  const last: Ref<number | null> = ref(null)
  const frames: Ref<number[]> = ref([])
  const totalFrames: ComputedRef<number> = computed(() => frames.value.length)
  const frameTick = ref(false)
  const frameRate: ComputedRef<number | null> = computed(() => {
    const len = totalFrames.value
    if (!len) return null
    let sum = 0
    for (let i = 0; i < len; i++) sum += frames.value[i]
    return sum / len
  })
  const promises = ref({})

  watch(
    () => totalFrames.value,
    (val) => {
      const boundary = 30
      const arr = frames.value
      if (val < boundary) return
      const diff = val - boundary
      for (let i = 0; i < diff; i++) arr.shift()
    }
  )

  function add(animation: Animation | GlobalAnimation, id: string | null = null) {
    const spread: Animation | GlobalAnimation = {
      easing: BASE_EASING,
      start: window.performance.now(),
      ...animation,
    }

    if (typeof id === 'string') {
      map[id] = spread
      mapKeys = Object.keys(map)
      return new Promise((resolve) => {
        promises.value[id] = resolve
      })
    } else {
      return new Promise((resolve) => {
        spread._id = v4()
        promises.value[spread._id] = resolve
        queue.push(Object.freeze(spread))
      })
    }
  }

  function remove(id: string) {
    delete map[id]
    mapKeys = Object.keys(map)
  }

  function start() {
    raf.value = window.requestAnimationFrame(tick)
  }

  function stop() {
    cancelAnimationFrame(raf.value)
  }

  function tick(now: DOMHighResTimeStamp) {
    queue.forEach((animation: Animation, i: number) => {
      const elapsed = now - (animation?.start || 0)
      const progress = clamp(BASE_EASING(elapsed / (animation.duration || 1)))
      animation.tick?.({ now, progress })
      if (progress === 1) {
        promises.value[animation._id]?.()
        delete promises.value[animation._id]
        queue.splice(i, 1)
      }
    })

    mapKeys.forEach((key: string) => {
      const animation = map[key]
      let progress = 0

      if (typeof animation.duration === 'number') {
        const elapsed = now - (animation?.start || 0)
        progress = clamp(BASE_EASING(elapsed / (animation.duration || 1)))
      }

      animation.tick?.({ now, progress })

      if (progress === 1) {
        promises.value?.[key]?.()
        delete map[key]
        delete promises.value[key]
        mapKeys = Object.keys(map)
      }
    })

    if (last.value === null) {
      last.value = now
      frameTick.value = true
    } else {
      if (frameTick.value === false) {
        frames.value.push(1000 / (now - last.value))
      } else {
        frameTick.value = false
      }

      last.value = now
    }

    raf.value = window.requestAnimationFrame(tick)
  }

  start()

  return {
    add,
    remove,
    start,
    stop,
    raf,
    map,
    queue,
    frameRate,
    $reset() {
      stop()
      frames.value = []
      last.value = window.performance.now()
    },
  }
})

if (import.meta?.hot?.accept && typeof acceptHMRUpdate !== 'undefined') {
  import.meta.hot.accept(acceptHMRUpdate?.(useRAF, import.meta.hot))
}

import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref, computed } from 'vue'
import { setCSSVars } from '../util/css'

const STANDALONE = window.matchMedia('(display-mode: standalone)').matches

const STANDALONE_PADDING = STANDALONE ? 20 : 0

export const useViewport = defineStore('viewport', () => {
  const width = ref<number>(window.innerWidth)
  const height = ref<number>(window.innerHeight + STANDALONE_PADDING)
  const dpr = ref(window.devicePixelRatio)
  const scrollDirection = ref<'UP' | 'DOWN'>('DOWN')
  const scrollPosition = ref<number>(0)
  const mouse = ref<[number, number]>([0, 0])
  const viewWidth = ref<number>(window.innerWidth)
  const mobile = computed<boolean>(() => {
    return (width.value < 1024 && height.value < 768) || (width.value < 768 && height.value < 1024)
  })

  const tablet = computed<boolean>(() => {
    if (mobile.value) return false
    const portrait = width.value < 1366 && height.value < 1024
    const landscape = width.value < 1024 && height.value < 1366
    return portrait || landscape
  })

  const desktop = computed<boolean>(() => !mobile.value && !tablet.value)

  const orientation = computed(() => {
    if (width.value > height.value) return 'LANDSCAPE'
    return 'PORTRAIT'
  })

  function update() {
    width.value = window.innerWidth
    height.value = window.innerHeight + STANDALONE_PADDING
    dpr.value = window.devicePixelRatio
    setCSSVars({
      '--viewport-width': `${width.value}px`,
      '--viewport-height': `${height.value}px`,
    })
  }

  function onPointerMove(e) {
    mouse.value = [e.pageX, e.pageY]
  }
  update()

  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('resize', update)

  return {
    width,
    height,
    dpr,
    mobile,
    tablet,
    desktop,
    orientation,
    mouse,
    scrollDirection,
    scrollPosition,
    viewWidth,
    $reset() {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('resize', update)
    },
  }
})

if ((import.meta as any)?.hot?.accept && typeof acceptHMRUpdate !== 'undefined') {
  ;(import.meta as any).hot.accept(acceptHMRUpdate?.(useViewport, (import.meta as any).hot))
}

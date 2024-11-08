export function useViewportSize() {
  const viewport = reactive(useViewport());
  const width = computed(() => viewport.width);
  const height = computed(() => viewport.height);
  const dpr = computed(() => viewport.dpr);

  return toRaw({
    width,
    height,
    dpr,
  });
}

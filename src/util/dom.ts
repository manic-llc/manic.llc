export function createCanvas({
  parent,
  dpr,
}: {
  parent: HTMLElement;
  dpr: number;
}): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const { width, height } = parent.getBoundingClientRect();
  sizeCanvas(canvas, { width, height, dpr });
  parent.appendChild(canvas);
  return canvas;
}

export function sizeCanvas(
  canvas: HTMLCanvasElement,
  { width, height, dpr }: { width: number; height: number; dpr: number }
) {
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
}

export function createResizeObserver(
  element: HTMLElement,
  callback: ({ width, height }: { width: number; height: number }) => unknown
) {
  const observer = new ResizeObserver(([entry]) => {
    const { width, height } = entry.contentRect;
    callback({ width, height });
  });

  observer.observe(element);

  return observer;
}

type Easing = (progress: number) => number

export interface Animation {
  start?: DOMHighResTimeStamp;
  duration?: number;
  easing?: Easing;
  tick?: Function;
}

export interface GlobalAnimation extends Animation {
  id?: string;
}
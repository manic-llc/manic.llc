import { scaleLinear, scaleTime, type ScaleLinear, type ScaleTime } from 'd3-scale'
import { min, max } from 'd3-array'
import { zoom, zoomTransform, ZoomBehavior, zoomIdentity } from 'd3-zoom'
import { select, pointer } from 'd3-selection'
import { subDays } from 'date-fns'

export type BaseProps = {
  width?: number
  height?: number
  dpr?: number
  padding?: number
  dataset?: Readonly<Datum | any[]> | null
  zoomX?: boolean
  zoomY?: boolean
  domainY?: [Date, Date] | [number, number] | null
  domainX?: [Date, Date] | [number, number] | null
  showXAxis?: boolean
  showYAxis?: boolean
  transform?: typeof zoomIdentity
  fade?: string | null
  onTick?: Function
  map?: () => Datum
  stream?: boolean
  legend?: boolean
  datasets?: Readonly<Datum | any[]>[] | null
}

export type BasePropRefs = {
  width: Ref<number>
  height: Ref<number>
  dpr: Ref<number>
  padding: Ref<number>
  dataset: Ref<Readonly<null | Datum | any[]>>
  datasets?: Ref<Readonly<null | Datum | any[]>[]>
  zoomX: Ref<boolean>
  zoomY: Ref<boolean>
  showXAxis?: Ref<boolean>
  showYAxis?: Ref<boolean>
  domainY: Ref<[Date, Date] | [number, number] | null>
  domainX: Ref<[Date, Date] | [number, number] | null>
  transform: Ref<typeof zoomIdentity>
  fade?: Ref<string | null>
  onTick: Function
  map: (a) => a
  stream: false
  legend: false
}

export type PropKey = keyof BaseProps

export const DefaultProps: BaseProps = {
  width: window.innerWidth,
  height: window.innerHeight,
  dpr: window.devicePixelRatio,
  padding: 60,
  dataset: null,
  datasets: null,
  zoomX: true,
  zoomY: false,
  domainY: null,
  domainX: null,
  showXAxis: true,
  showYAxis: true,
  fade: null,
  transform: zoomIdentity,
  onTick: () => {},
}

type ZoomOptions = {
  setTransform: Function
  zoomInstance: Ref<ZoomBehavior<Element, unknown> | null>
  element: HTMLElement
  scales: Ref<ScaleRecord>
  tweening: Ref<boolean>
}

export type AxisDataType = 'date' | 'number'

export type ScaleArray = [ScaleLinear<any, any, any> | null, ScaleTime<any, any, any> | null]

export type ScaleRecord = Record<'x' | 'y', any>

export type Datum = [number, number] | [number, Date] | [Date, number]
export interface BarChartProps extends BaseProps {
  lineWidth?: number
  lineCap?: string
  lineJoin?: string
  fillStyle?: string | number[]
  strokeStyle?: string | number[]
  fluid?: boolean
  rounded?: boolean
  gradient?: [string, string] | null
  fill?: boolean
  stroke?: boolean
}

export const BaseBarChartProps: BarChartProps = {
  ...DefaultProps,
  lineWidth: 1,
  lineCap: 'round',
  lineJoin: 'round',
  fillStyle: '#E80040',
  gradient: null,
  fluid: false,
  rounded: false,
  fill: true,
  stroke: true,
}

export function generateMockData(totalDays: number = 50000, max = 10) {
  const datum = () => {
    const value = Math.random() * max
    return value
  }

  const today = new Date()

  const collection: any = [[today, datum()]]

  let i = 1

  for (; i < totalDays - 1; i++) {
    collection.push([subDays(today, i), datum()])
  }

  return Object.freeze(collection.reverse())
}

export function generateTimeseriesDomains(ranges: number[]) {
  return ranges.reduce((acc: Record<string, Date[]>, number) => {
    acc[`${number}`] = [subDays(new Date(), number), new Date()]
    return acc
  }, {})
}

export function buildScales(p: BaseProps & BarChartProps): ScaleRecord {
  const props = {
    ...p,
    dataset: p.dataset || p.datasets?.[0] || [],
  }
  if (typeof props.map === 'function') {
    props.dataset = props.dataset?.map(props.map)
  }

  let domainX = props.domainX
  let domainY = props.domainY

  if (domainX === null) {
    if (props.dataset?.[0][0] instanceof Date) {
      domainX = [props.dataset?.[0][0], props.dataset?.[props.dataset?.length - 1][0]]
    } else {
      domainX = [min(props.dataset?.map((v) => v[0]) || [0]), max(props.dataset?.map((v) => v[0]) || [0])]
    }
  }

  if (domainY === null) {
    if (props.dataset?.[0][1] instanceof Date) {
      domainY = [props.dataset?.[0][1], props.dataset?.[props.dataset?.length - 1][1]]
    } else {
      domainY = [max((props.dataset as any[])?.map?.((v: any) => v?.[1])), min((props.dataset as any[])?.map?.((v: any) => v?.[1]))]
    }
  }

  const xType = domainX?.[0] instanceof Date ? 'date' : 'number'
  const yType = domainY?.[0] instanceof Date ? 'date' : 'number'
  const xAxisDataType: AxisDataType = xType
  const yAxisDataType: AxisDataType = yType
  const xMethod = (xAxisDataType === 'date' ? scaleTime : scaleLinear) as any
  const xScale = xMethod(domainX, [0, props.width])
  const yMethod = (yAxisDataType === 'date' ? scaleTime : scaleLinear) as any
  const yScale = yMethod(domainY, [props.height, 0])
  return { x: xScale, y: yScale }
}

export function initZoom({ setTransform, zoomInstance, element, scales, tweening }: ZoomOptions) {
  zoomInstance.value = zoom().scaleExtent([0, 2])
  zoomInstance.value?.touchable()

  let raf = 0

  function onZoom(e: any) {
    const self: any = this as any
    cancelAnimationFrame(raf)
    if (tweening.value) return
    raf = requestAnimationFrame(zoomed.bind(self, e))
  }

  zoomInstance.value?.on('zoom', onZoom)

  const $element = select(element)
    .on('wheel', (e: WheelEvent) => e.preventDefault())
    .call(zoomInstance.value as any) as any

  function zoomed(event: any) {
    const self: any = this as any

    if (tweening.value || !zoomInstance.value || !event?.sourceEvent || !(event?.sourceEvent instanceof WheelEvent))
      return event.sourceEvent && setTransform(event.transform)

    const { transform: t, sourceEvent } = event
    const dx = Math.abs(sourceEvent.deltaX)
    const dy = Math.abs(sourceEvent.deltaY)

    if (dx > dy) {
      zoomInstance.value?.translateBy($element, -sourceEvent.deltaX / 3 / t.k, 0)
      setTransform(zoomTransform(self))
      return sourceEvent.preventDefault()
    }

    if (dx < dy) {
      const delta = -sourceEvent.deltaY * (sourceEvent.deltaMode ? 120 : 1)
      const k = t.k * Math.pow(2, delta / 500)
      zoomInstance.value.scaleTo($element, k)
      const t2 = zoomTransform(self) // reaccess the transform so that the zoom's extents apply
      const p = pointer(event, event.sourceEvent.target) // We're going to shift by a point
      const w = scales.value.x.range()[1] // My scales reference
      const dw = w / t2.k - w / t.k // The change in width
      const x = dw / 2 - dw * (p[0] / w)
      zoomInstance.value.translateBy($element, -x, 0)
      setTransform(zoomTransform(self))
      return sourceEvent.preventDefault()
    }
  }

  return () => {
    $element.on('wheel', null)
    zoomInstance.value?.on('zoom', null)
    zoomInstance.value = null
  }
}

type Pair = [Date, Date] | [number, number]

export type Domain = Pair
export type Range = Pair

export interface TimeSeriesProps {
  width: number
  height: number
  dpr: number
  transform: [number, number, number]
  rangeX: Range
  rangeY: Range
  domainX: Domain
  domainY: Domain
  scaleX: any
  scaleY: any
  seconds?: number
}

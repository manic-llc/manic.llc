import { reactive, ref, onMounted } from 'vue'
import { parse, isValid, format } from 'date-fns'
import { scaleTime, scaleLinear } from 'd3-scale'
import { min, max } from 'd3-array'

type Axis = Date | string | number | null
type Datum = Axis[]
type Dataset = Datum[]

function isDate(date) {
  return !isNaN(new Date(date).valueOf())
}

function inferScales([[[x, y]]]: Dataset) {
  const scales: Record<'x' | 'y', any> = {
    x: null,
    y: null,
  }

  if (typeof x === 'number') {
    scales.x = scaleLinear
  } else if (isDate(x)) {
    scales.x = new Date(x)
  }

  if (typeof y === 'number' || !isNaN(Number(y))) {
    scales.y = Number(y)
  } else if (isDate(y)) {
    scales.y = new Date(y)
  }

  return [values.x, values.y]
}

export function useDataVisualization({ canvas, data }: { canvas: Ref<HTMLCanvasElement | null>; data: Dataset }) {
  const validated = ref<boolean>(false)
  const schema = ref<Axis[] | null>(null)

  function initialize() {
    schema.value = infer(data)

    // console.log(schema.value)
  }

  onMounted(() => {
    initialize()
  })

  return {
    validated: validated.value,
  }
}

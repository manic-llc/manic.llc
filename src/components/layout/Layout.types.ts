export type FlexValues = 'start' | 'end' | 'center' | 'flex-start' | 'flex-end' | 'space-between' | 'space-evenly'

export type LayoutProps = {
  padding?: number | [number, number, number, number]
  margin?: number | [number, number, number, number]
  gap?: number
  align?: FlexValues
  justify?: FlexValues
  is?: string
  flex?: number
  row?: boolean
  column?: boolean
  cascade?: boolean
}

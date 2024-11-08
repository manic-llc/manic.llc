export function clone(value: any): any {
  if (value instanceof Date) return new Date(value)

  if (Array.isArray(value)) return value.map((v) => clone(v))

  if (value && typeof value === 'object') {
    try {
      return Object.keys(value).reduce((acc, key) => {
        acc[key] = clone(value[key])
        return acc
      }, {} as any)
    } catch (e) {
      return value
    }
  }

  return value
}

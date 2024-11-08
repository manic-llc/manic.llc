import { useRoute } from 'vue-router'

export function useRouteParam(param: string) {
  const route = useRoute()

  return (route.params as any)?.[param]
}

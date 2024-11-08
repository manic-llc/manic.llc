import { routes } from "vue-router/auto/routes";
import { type RouteRecordRaw } from "vue-router";

export function useNavigation() {
  const parsed: Ref<RouteRecordRaw[]> = ref(
    routes
      .reduce((acc, route) => {
        if (!route.children?.length) {
          if (route?.meta?.navigation === true) {
            return [...acc, route];
          } else {
            return acc;
          }
        }

        route.children.forEach((child) => {
          if (child?.meta?.navigation === true) {
            acc.push({
              ...child,
              path: route.path + child.path,
            });
          }
        });

        return acc;
      }, [] as RouteRecordRaw[])
      .sort((a: any, b: any) => (a?.meta?.ordinal < b?.meta?.ordinal ? -1 : 1)),
  );

  return parsed;
}

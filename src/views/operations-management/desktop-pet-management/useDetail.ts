import { isEmpty } from "@pureadmin/utils";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { useRouter, useRoute, type RouteParamsRaw } from "vue-router";

export function useDetail() {
  const route = useRoute();
  const router = useRouter();
  const getParameter = isEmpty(route.params) ? route.query : route.params;

  function toDetail(parameter: RouteParamsRaw, title: string) {
    const id = parameter.id?.toString() || "";

    useMultiTagsStoreHook().handleTags("push", {
      path: `/operations-management/desktop-pet-detail/:id`,
      name: "DesktopPetDetail",
      params: { id },
      meta: {
        title: `${title} - 详情`
      }
    });

    router.push({ name: "DesktopPetDetail", params: { id } });
  }

  const initToDetail = () => {
    if (getParameter?.id) {
      const id = getParameter.id.toString();
      useMultiTagsStoreHook().handleTags("push", {
        path: `/operations-management/desktop-pet-detail/:id`,
        name: "DesktopPetDetail",
        params: { id },
        meta: {
          title: `桌宠详情`
        }
      });
    }
  };

  return { toDetail, initToDetail, getParameter, router };
}

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
      path: `/operations-management/announcement-detail/:id`,
      name: "AnnouncementDetail",
      params: { id },
      meta: {
        title: `${title} - 详情`
      }
    });

    router.push({ name: "AnnouncementDetail", params: { id } });
  }

  const initToDetail = () => {
    if (getParameter?.id) {
      const id = getParameter.id.toString();
      useMultiTagsStoreHook().handleTags("push", {
        path: `/operations-management/announcement-detail/:id`,
        name: "AnnouncementDetail",
        params: { id },
        meta: {
          title: `公告详情`
        }
      });
    }
  };

  return { toDetail, initToDetail, getParameter, router };
}

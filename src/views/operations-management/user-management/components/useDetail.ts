import { useRouter } from "vue-router";

export function useDetail() {
  const router = useRouter();

  const toDetail = (query: Record<string, any>) => {
    router.push({
      path: "/operations-management/user-management/detail",
      query
    });
  };

  return {
    toDetail
  };
}

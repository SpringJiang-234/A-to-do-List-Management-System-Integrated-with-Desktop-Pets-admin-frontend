export default {
  path: "/system-management",
  redirect: "/system-management/about",
  meta: {
    icon: "carbon:cloud-service-management",
    title: "系统管理",
    rank: 2
  },
  children: [
    {
      path: "/system-management/about",
      name: "About",
      component: () => import("@/views/system-management/about.vue"),
      meta: {
        title: "关于我们"
      }
    },
    {
      path: "/system-management/audit-logs",
      name: "AuditLogs",
      component: () => import("@/views/system-management/audit-logs.vue"),
      meta: {
        title: "审计日志"
      }
    }
  ]
} satisfies RouteConfigsTable;

export default {
  path: "/operations-management",
  redirect: "/operations-management/announcement-management",
  meta: {
    icon: "material-symbols:manage-accounts-outline-rounded",
    title: "运营管理",
    rank: 1
  },
  children: [
    {
      path: "/operations-management/announcement-management",
      name: "AnnouncementManagement",
      component: () =>
        import(
          "@/views/operations-management/announcement-management/index.vue"
        ),
      meta: {
        title: "公告管理",
        keepAlive: true
      }
    },
    {
      path: "/operations-management/feedback-management",
      name: "FeedbackManagement",
      component: () =>
        import("@/views/operations-management/feedback-management/index.vue"),
      meta: {
        title: "反馈管理"
      }
    },
    {
      path: "/operations-management/user-management",
      name: "UserManagement",
      component: () =>
        import("@/views/operations-management/user-management/index.vue"),
      meta: {
        title: "用户管理"
      }
    },
    {
      path: "/operations-management/desktop-pet-management",
      name: "DesktopPetManagement",
      component: () =>
        import(
          "@/views/operations-management/desktop-pet-management/index.vue"
        ),
      meta: {
        title: "桌宠管理",
        keepAlive: true
      }
    }
  ]
} satisfies RouteConfigsTable;

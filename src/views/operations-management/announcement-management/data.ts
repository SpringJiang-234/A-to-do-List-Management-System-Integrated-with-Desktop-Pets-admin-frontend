import dayjs from "dayjs";
import { clone } from "@pureadmin/utils";

const now = dayjs(new Date());

const tableData = [
  {
    title: "系统维护通知",
    content: "系统将于本周六凌晨2点进行例行维护，预计耗时2小时",
    isTop: "2",
    createTime: now.subtract(2, "day").format("YYYY-MM-DD HH:mm:ss"),
    updateTime: now.subtract(2, "day").format("YYYY-MM-DD HH:mm:ss")
  },
  {
    title: "新功能上线公告",
    content: "新增数据导出功能，支持Excel和PDF格式",
    isTop: "1",
    createTime: now.subtract(5, "day").format("YYYY-MM-DD HH:mm:ss"),
    updateTime: now.subtract(5, "day").format("YYYY-MM-DD HH:mm:ss")
  },
  {
    title: "安全更新提醒",
    content: "请所有用户及时更新密码，保障账户安全",
    isTop: "2",
    createTime: now.subtract(7, "day").format("YYYY-MM-DD HH:mm:ss"),
    updateTime: now.subtract(7, "day").format("YYYY-MM-DD HH:mm:ss")
  },
  {
    title: "节假日放假通知",
    content: "五一劳动节放假安排：5月1日至5月5日放假调休",
    isTop: "1",
    createTime: now.subtract(10, "day").format("YYYY-MM-DD HH:mm:ss"),
    updateTime: now.subtract(10, "day").format("YYYY-MM-DD HH:mm:ss")
  },
  {
    title: "服务器升级完成",
    content: "服务器升级工作已完成，系统性能得到显著提升",
    isTop: "1",
    createTime: now.subtract(15, "day").format("YYYY-MM-DD HH:mm:ss"),
    updateTime: now.subtract(15, "day").format("YYYY-MM-DD HH:mm:ss")
  },
  {
    title: "用户反馈征集",
    content: "欢迎用户提出宝贵意见和建议，我们将持续改进产品",
    isTop: "1",
    createTime: now.subtract(20, "day").format("YYYY-MM-DD HH:mm:ss"),
    updateTime: now.subtract(20, "day").format("YYYY-MM-DD HH:mm:ss")
  },
  {
    title: "版本更新说明",
    content: "V2.0版本正式发布，新增多项功能优化",
    isTop: "1",
    createTime: now.subtract(25, "day").format("YYYY-MM-DD HH:mm:ss"),
    updateTime: now.subtract(25, "day").format("YYYY-MM-DD HH:mm:ss")
  },
  {
    title: "数据备份提醒",
    content: "请定期备份重要数据，避免数据丢失",
    isTop: "1",
    createTime: now.subtract(30, "day").format("YYYY-MM-DD HH:mm:ss"),
    updateTime: now.subtract(30, "day").format("YYYY-MM-DD HH:mm:ss")
  },
  {
    title: "培训课程通知",
    content: "下周将举办系统使用培训，请相关人员准时参加",
    isTop: "1",
    createTime: now.subtract(35, "day").format("YYYY-MM-DD HH:mm:ss"),
    updateTime: now.subtract(35, "day").format("YYYY-MM-DD HH:mm:ss")
  },
  {
    title: "年度总结报告",
    content: "2024年度工作总结报告已发布，请查阅",
    isTop: "1",
    createTime: now.subtract(40, "day").format("YYYY-MM-DD HH:mm:ss"),
    updateTime: now.subtract(40, "day").format("YYYY-MM-DD HH:mm:ss")
  }
];

const tableDataMore = clone(tableData, true).map(item =>
  Object.assign(item, {
    publisher: "系统管理员",
    department: "技术部",
    status: "已发布"
  })
);

const tableDataImage = clone(tableData, true).map((item, index) =>
  Object.assign(item, {
    image: `https://pure-admin.github.io/pure-admin-table/imgs/${index + 1}.jpg`
  })
);

const tableDataSortable = clone(tableData, true);

const tableDataDrag = clone(tableData, true).map((item, index) => {
  return Object.assign(item, {
    id: index + 1
  });
});

const tableDataEdit = clone(tableData, true).map((item, index) => {
  return Object.assign(item, {
    id: index + 1
  });
});

export {
  tableData,
  tableDataDrag,
  tableDataMore,
  tableDataEdit,
  tableDataImage,
  tableDataSortable
};

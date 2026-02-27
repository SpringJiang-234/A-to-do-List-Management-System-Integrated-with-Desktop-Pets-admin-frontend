import type { ColumnsType } from "antd/es/table";
import type { AuditLogVO } from "@/api/audit-logs";

const columns: ColumnsType<AuditLogVO> = [
  {
    title: "操作人ID",
    dataIndex: "userId",
    key: "userId",
    width: 100
  },
  {
    title: "操作人",
    dataIndex: "username",
    key: "username",
    width: 120
  },
  {
    title: "操作内容",
    dataIndex: "operation",
    key: "operation",
    ellipsis: true
  },
  {
    title: "操作模块",
    dataIndex: "module",
    key: "module",
    width: 150
  },
  {
    title: "IP地址",
    dataIndex: "ipAddress",
    key: "ipAddress",
    width: 150
  }
];

export default columns;

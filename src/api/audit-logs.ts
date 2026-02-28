import { http } from "@/utils/http";

// 返回结果类型
export type AuditLogResult = {
  code: number;
  msg: string;
  data: any;
};

// 请求参数类型
export type AuditLogDTO = {
  id?: number;
  userId?: number;
  username?: string;
  operation?: string;
  module?: string;
  ipAddress?: string;
};

// 查询参数类型
export type AuditLogQuery = {
  userId?: number;
  username?: string;
  operation?: string;
  module?: string;
  ipAddress?: string;
  createTime?: {
    start: string;
    end: string;
  };
  updateTime?: {
    start: string;
    end: string;
  };
  pageNum?: number;
  pageSize?: number;
};

// 响应数据类型
export type AuditLogVO = {
  id: number;
  userId?: number;
  username?: string;
  operation?: string;
  module?: string;
  ipAddress?: string;
  createTime?: string;
};

// 详情数据类型
export type AuditLogDetails = {
  id: number;
  userId?: number;
  username?: string;
  operation?: string;
  module?: string;
  ipAddress?: string;
  createTime: string;
  updateTime: string;
};

// 分页结果类型
export type PageResult<T> = {
  records: T[];
  total: number;
  current: number;
  size: number;
};

// 获取审计日志分页列表
export const getAuditLogPage = (data: AuditLogQuery) => {
  return http.request<AuditLogResult>("post", "/api/auditLog/page", {
    data
  });
};

// 获取审计日志详情：暂时没用
export const exportAuditLog = (data: AuditLogQuery) => {
  return http.request<Blob>("post", "/api/auditLog/export", {
    data,
    responseType: "blob"
  });
};

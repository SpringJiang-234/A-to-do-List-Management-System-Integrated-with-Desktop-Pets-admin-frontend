import { http } from "@/utils/http";

export type AuditLogResult = {
  code: number;
  msg: string;
  data: any;
};

export type AuditLogDTO = {
  id?: number;
  userId?: number;
  username?: string;
  operation?: string;
  module?: string;
  ipAddress?: string;
};

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

export type AuditLogVO = {
  id: number;
  userId?: number;
  username?: string;
  operation?: string;
  module?: string;
  ipAddress?: string;
  createTime?: string;
};

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

export type PageResult<T> = {
  records: T[];
  total: number;
  current: number;
  size: number;
};

export const getAuditLogPage = (data: AuditLogQuery) => {
  return http.request<AuditLogResult>("post", "/api/auditLog/page", {
    data
  });
};

export const exportAuditLog = (data: AuditLogQuery) => {
  return http.request<Blob>("post", "/api/auditLog/export", {
    data,
    responseType: "blob"
  });
};

import { http } from "@/utils/http";

// 返回结果类型
export type AnnouncementResult = {
  code: number;
  msg: string;
  data: any;
};

// 请求参数类型
export type AnnouncementDTO = {
  id?: number;
  title?: string;
  content?: string;
  isTop?: number;
  createTime?: string;
  updateTime?: string;
};

// 查询参数类型
export type AnnouncementQuery = {
  title?: string;
  content?: string;
  isTop?: string;
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
export type AnnouncementVO = {
  id: number;
  title: string;
  content: string;
  isTop: string;
  createTime: string;
  updateTime: string;
};

// 详情数据类型
export type AnnouncementDetails = {
  id: number;
  title: string;
  content: string;
  isTop: string;
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

// 新增公告
export const insertAnnouncement = (data: AnnouncementDTO) => {
  return http.request<AnnouncementResult>("post", "/api/announcement/insert", {
    data
  });
};

// 更新公告
export const updateAnnouncement = (data: AnnouncementDTO) => {
  return http.request<AnnouncementResult>("post", "/api/announcement/update", {
    data
  });
};

// 删除公告
export const deleteAnnouncement = (id: number) => {
  return http.request<AnnouncementResult>(
    "get",
    `/api/announcement/delete/${id}`
  );
};

// 批量删除公告
export const batchDeleteAnnouncement = (ids: string) => {
  return http.request<AnnouncementResult>(
    "get",
    `/api/announcement/batchDelete/${ids}`
  );
};

// 获取公告分页列表
export const getAnnouncementPage = (data: AnnouncementQuery) => {
  return http.request<AnnouncementResult>("post", "/api/announcement/page", {
    data
  });
};

// 获取公告详情
export const getAnnouncementDetails = (id: number) => {
  return http.request<AnnouncementResult>(
    "get",
    `/api/announcement/details/${id}`
  );
};

// 导出公告
export const exportAnnouncement = (data: AnnouncementQuery) => {
  return http.request<Blob>("post", "/api/announcement/export", {
    data,
    responseType: "blob"
  });
};

// 导入公告
export const importAnnouncement = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return http.request<AnnouncementResult>("post", "/api/announcement/import", {
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

// 下载公告导入模板
export const downloadTemplate = () => {
  return http.request<Blob>("get", "/api/announcement/downloadTemplate", {
    responseType: "blob"
  });
};

import { http } from "@/utils/http";

export type AnnouncementResult = {
  success: boolean;
  message: string;
  data: any;
};

export type AnnouncementDTO = {
  title?: string;
  content?: string;
  isTop?: string;
  createTime?: string;
  updateTime?: string;
};

export type AnnouncementQuery = {
  title?: string;
  content?: string;
  isTop?: string;
  createTime?: string[];
  updateTime?: string[];
  current?: number;
  size?: number;
};

export type AnnouncementVO = {
  id: number;
  title: string;
  content: string;
  isTop: string;
  createTime: string;
  updateTime: string;
};

export type PageResult<T> = {
  records: T[];
  total: number;
  current: number;
  size: number;
};

export const insertAnnouncement = (data: AnnouncementDTO) => {
  return http.request<AnnouncementResult>("post", "/announcement/insert", {
    data
  });
};

export const updateAnnouncement = (data: AnnouncementDTO) => {
  return http.request<AnnouncementResult>("post", "/announcement/update", {
    data
  });
};

export const deleteAnnouncement = (id: number) => {
  return http.request<AnnouncementResult>("get", `/announcement/delete/${id}`);
};

export const batchDeleteAnnouncement = (ids: string) => {
  return http.request<AnnouncementResult>(
    "get",
    `/announcement/batchDelete/${ids}`
  );
};

export const getAnnouncementPage = (data: AnnouncementQuery) => {
  return http.request<AnnouncementResult>("post", "/announcement/page", {
    data
  });
};

export const getAnnouncementDetails = (id: number) => {
  return http.request<AnnouncementResult>("get", `/announcement/details/${id}`);
};

export const exportAnnouncement = (data: AnnouncementQuery) => {
  return http.request("post", "/announcement/export", { data });
};

export const importAnnouncement = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return http.request<AnnouncementResult>("post", "/announcement/import", {
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

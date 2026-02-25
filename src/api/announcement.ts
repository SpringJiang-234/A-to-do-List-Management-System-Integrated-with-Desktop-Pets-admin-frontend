import { http } from "@/utils/http";

export type AnnouncementResult = {
  code: number;
  msg: string;
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
  return http.request<AnnouncementResult>("post", "/api/announcement/insert", {
    data
  });
};

export const updateAnnouncement = (data: AnnouncementDTO) => {
  return http.request<AnnouncementResult>("post", "/api/announcement/update", {
    data
  });
};

export const deleteAnnouncement = (id: number) => {
  return http.request<AnnouncementResult>(
    "get",
    `/api/announcement/delete/${id}`
  );
};

export const batchDeleteAnnouncement = (ids: string) => {
  return http.request<AnnouncementResult>(
    "get",
    `/api/announcement/batchDelete/${ids}`
  );
};

export const getAnnouncementPage = (data: AnnouncementQuery) => {
  return http.request<AnnouncementResult>("post", "/api/announcement/page", {
    data
  });
};

export const getAnnouncementDetails = (id: number) => {
  return http.request<AnnouncementResult>(
    "get",
    `/api/announcement/details/${id}`
  );
};

export const exportAnnouncement = (data: AnnouncementQuery) => {
  return http.request<Blob>("post", "/api/announcement/export", {
    data,
    responseType: "blob"
  });
};

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

export const downloadTemplate = () => {
  return http.request<Blob>("get", "/api/announcement/downloadTemplate", {
    responseType: "blob"
  });
};

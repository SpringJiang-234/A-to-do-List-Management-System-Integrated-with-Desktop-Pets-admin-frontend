import { http } from "@/utils/http";

export type DesktopPetResult = {
  code: number;
  msg: string;
  data: any;
};

export type DesktopPetDTO = {
  id?: number;
  userId?: number;
  nickname?: string;
  energy?: number;
  mood?: number;
  intimacy?: number;
  exp?: number;
  level?: number;
};

export type DesktopPetQuery = {
  userId?: number;
  nickname?: string;
  level?: {
    start: number;
    end: number;
  };
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

export type DesktopPetVO = {
  id: number;
  userId?: number;
  nickname?: string;
  level?: number;
};

export type DesktopPetDetails = {
  id: number;
  userId?: number;
  nickname?: string;
  energy?: number;
  mood?: number;
  intimacy?: number;
  exp?: number;
  level?: number;
  createTime: string;
  updateTime: string;
};

export type PageResult<T> = {
  records: T[];
  total: number;
  current: number;
  size: number;
};

export const insertDesktopPet = (data: DesktopPetDTO) => {
  return http.request<DesktopPetResult>("post", "/api/desktopPet/insert", {
    data
  });
};

export const updateDesktopPet = (data: DesktopPetDTO) => {
  return http.request<DesktopPetResult>("post", "/api/desktopPet/update", {
    data
  });
};

export const deleteDesktopPet = (id: number) => {
  return http.request<DesktopPetResult>("get", `/api/desktopPet/delete/${id}`);
};

export const batchDeleteDesktopPet = (ids: string) => {
  return http.request<DesktopPetResult>(
    "get",
    `/api/desktopPet/batchDelete/${ids}`
  );
};

export const getDesktopPetPage = (data: DesktopPetQuery) => {
  return http.request<DesktopPetResult>("post", "/api/desktopPet/page", {
    data
  });
};

export const getDesktopPetDetails = (id: number) => {
  return http.request<DesktopPetResult>("get", `/api/desktopPet/details/${id}`);
};

export const exportDesktopPet = (data: DesktopPetQuery) => {
  return http.request<Blob>("post", "/api/desktopPet/export", {
    data,
    responseType: "blob"
  });
};

export const importDesktopPet = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return http.request<DesktopPetResult>("post", "/api/desktopPet/import", {
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

export const downloadTemplate = () => {
  return http.request<Blob>("get", "/api/desktopPet/downloadTemplate", {
    responseType: "blob"
  });
};

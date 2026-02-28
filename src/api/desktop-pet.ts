import { http } from "@/utils/http";

// 返回结果类型
export type DesktopPetResult = {
  code: number;
  msg: string;
  data: any;
};

// 请求参数类型
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

// 查询参数类型
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

// 响应数据类型
export type DesktopPetVO = {
  id: number;
  userId?: number;
  nickname?: string;
  level?: number;
};

// 详情数据类型
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

// 分页结果类型
export type PageResult<T> = {
  records: T[];
  total: number;
  current: number;
  size: number;
};

// 新增桌面宠物：暂时没用
export const insertDesktopPet = (data: DesktopPetDTO) => {
  return http.request<DesktopPetResult>("post", "/api/desktopPet/insert", {
    data
  });
};

// 更新桌面宠物：暂时没用
export const updateDesktopPet = (data: DesktopPetDTO) => {
  return http.request<DesktopPetResult>("post", "/api/desktopPet/update", {
    data
  });
};

// 删除桌面宠物：暂时没用
export const deleteDesktopPet = (id: number) => {
  return http.request<DesktopPetResult>("get", `/api/desktopPet/delete/${id}`);
};

// 批量删除桌面宠物：暂时没用
export const batchDeleteDesktopPet = (ids: string) => {
  return http.request<DesktopPetResult>(
    "get",
    `/api/desktopPet/batchDelete/${ids}`
  );
};

// 获取桌面宠物分页列表
export const getDesktopPetPage = (data: DesktopPetQuery) => {
  return http.request<DesktopPetResult>("post", "/api/desktopPet/page", {
    data
  });
};

// 获取桌面宠物详情：要用
export const getDesktopPetDetails = (id: number) => {
  return http.request<DesktopPetResult>("get", `/api/desktopPet/details/${id}`);
};

// 导出桌面宠物
export const exportDesktopPet = (data: DesktopPetQuery) => {
  return http.request<Blob>("post", "/api/desktopPet/export", {
    data,
    responseType: "blob"
  });
};

// 导入桌面宠物：暂时没用
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

// 下载桌面宠物导入模板：暂时没用
export const downloadTemplate = () => {
  return http.request<Blob>("get", "/api/desktopPet/downloadTemplate", {
    responseType: "blob"
  });
};

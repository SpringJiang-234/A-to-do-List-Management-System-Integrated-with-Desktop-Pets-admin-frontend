import { http } from "@/utils/http";

export type UserResult = {
  code: number;
  msg: string;
  data: any;
  success?: boolean;
};

export type RefreshTokenResult = {
  code: number;
  msg: string;
  data: {
    accessToken: string;
    refreshToken: string;
    expires: string;
  };
};

export type UserDTO = {
  id?: number;
  account?: string;
  passwordHash?: string;
  nickname?: string;
  avatar?: string;
  gender?: number; // 1-男 2-女 3-未知
  birth?: string;
  status?: number; // 1-正常 2-已注销
  type?: number; // 1-管理员 2-普通用户
};

export type UserQuery = {
  account?: string;
  nickname?: string;
  gender?: number;
  birth?: {
    start: string;
    end: string;
  };
  status?: number;
  type?: number;
  pageNum?: number;
  pageSize?: number;
};

export type UserVO = {
  id: number;
  account?: string;
  passwordHash?: string;
  nickname?: string;
  avatar?: string;
  gender?: string; // 男/女/未知
  birth?: string;
  status?: string; // 正常/已注销
  type?: string; // 管理员/普通用户
};

export type UserDetails = {
  id: number;
  account?: string;
  passwordHash?: string;
  nickname?: string;
  avatar?: string;
  gender?: string; // 男/女/未知
  birth?: string;
  status?: string; // 正常/已注销
  type?: string; // 管理员/普通用户
  createTime: string;
  updateTime: string;
};

export type PageResult<T> = {
  records: T[];
  total: number;
  current: number;
  size: number;
};

// 登录相关API
export const getLogin = (data: { account: string; password: string }) => {
  return http.request<UserResult>("post", "/api/login", {
    data
  });
};

export const refreshTokenApi = (data: { refreshToken: string }) => {
  return http.request<RefreshTokenResult>("post", "/api/refreshToken", {
    data
  });
};

// 用户管理API
export const insertUser = (data: UserDTO) => {
  return http.request<UserResult>("post", "/api/user/insert", {
    data
  });
};

export const updateUser = (data: UserDTO) => {
  return http.request<UserResult>("post", "/api/user/update", {
    data
  });
};

export const deleteUser = (id: number) => {
  return http.request<UserResult>("get", `/api/user/delete/${id}`);
};

export const batchDeleteUser = (ids: string) => {
  return http.request<UserResult>("get", `/api/user/batchDelete/${ids}`);
};

export const getUserPage = (data: UserQuery) => {
  return http.request<UserResult>("post", "/api/user/page", {
    data
  });
};

export const getUserDetails = (id: number) => {
  return http.request<UserResult>("get", `/api/user/details/${id}`);
};

export const exportUser = (data: UserQuery) => {
  return http.request<Blob>("post", "/api/user/export", {
    data,
    responseType: "blob"
  });
};

export const importUser = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return http.request<UserResult>("post", "/api/user/import", {
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

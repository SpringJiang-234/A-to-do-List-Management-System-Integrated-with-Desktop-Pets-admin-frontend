import { http } from "@/utils/http";

// 返回结果类型
export type UserResult = {
  code: number;
  msg: string;
  data: any;
  success?: boolean;
};

// 刷新Token结果类型
export type RefreshTokenResult = {
  code: number;
  msg: string;
  data: {
    accessToken: string;
    refreshToken: string;
    expires: string;
  };
};

// 请求参数类型
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

// 查询参数类型
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

// 响应数据类型
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

// 详情数据类型
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

// 分页结果类型
export type PageResult<T> = {
  records: T[];
  total: number;
  current: number;
  size: number;
};

/* 登录相关API */

// 登录
export const getLogin = (data: { account: string; password: string }) => {
  return http.request<UserResult>("post", "/api/security/login", {
    data
  });
};

// 刷新Token
export const refreshTokenApi = (data: { refreshToken: string }) => {
  return http.request<RefreshTokenResult>("post", "/api/refreshToken", {
    data
  });
};

/* 用户管理API */

// 新增用户
export const insertUser = (data: UserDTO) => {
  return http.request<UserResult>("post", "/api/user/insert", {
    data
  });
};

// 更新用户
export const updateUser = (data: UserDTO) => {
  return http.request<UserResult>("post", "/api/user/update", {
    data
  });
};

// 删除用户
export const deleteUser = (id: number) => {
  return http.request<UserResult>("get", `/api/user/delete/${id}`);
};

// 批量删除用户
export const batchDeleteUser = (ids: string) => {
  return http.request<UserResult>("get", `/api/user/batchDelete/${ids}`);
};

// 获取用户分页列表
export const getUserPage = (data: UserQuery) => {
  return http.request<UserResult>("post", "/api/user/page", {
    data
  });
};

// 获取用户详情：要用
export const getUserDetails = (id: number) => {
  return http.request<UserResult>("get", `/api/user/details/${id}`);
};

// 导出用户
export const exportUser = (data: UserQuery) => {
  return http.request<Blob>("post", "/api/user/export", {
    data,
    responseType: "blob"
  });
};

// 导入用户
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

// 下载用户导入模板
export const downloadTemplate = () => {
  return http.request<Blob>("get", "/api/user/downloadTemplate", {
    responseType: "blob"
  });
};

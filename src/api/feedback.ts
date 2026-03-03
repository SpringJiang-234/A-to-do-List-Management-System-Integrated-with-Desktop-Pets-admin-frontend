import { http } from "@/utils/http";

// 返回结果类型
export type FeedbackResult = {
  code: number;
  msg: string;
  data: any;
};

// 请求参数类型
export type FeedbackDTO = {
  id?: number;
  userId?: number;
  title?: string;
  content?: string;
  status?: number;
  replyContent?: string;
};

// 查询参数类型
export type FeedbackQuery = {
  userId?: number;
  title?: string;
  content?: string;
  status?: number;
  replyContent?: string;
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
export type FeedbackVO = {
  id: number;
  userId: number;
  title: string;
  content: string;
  status: string;
  createTime: string;
  updateTime: string;
};

// 详情数据类型
export type FeedbackDetails = {
  id: number;
  userId: number;
  title: string;
  content: string;
  status: string;
  replyContent: string;
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

// 新增反馈
export const insertFeedback = (data: FeedbackDTO) => {
  return http.request<FeedbackResult>("post", "/api/feedback/insert", {
    data
  });
};

// 更新反馈
export const updateFeedback = (data: FeedbackDTO) => {
  return http.request<FeedbackResult>("post", "/api/feedback/update", {
    data
  });
};

// 删除反馈
export const deleteFeedback = (id: number) => {
  return http.request<FeedbackResult>("get", `/api/feedback/delete/${id}`);
};

// 批量删除反馈
export const batchDeleteFeedback = (ids: string) => {
  return http.request<FeedbackResult>(
    "get",
    `/api/feedback/batchDelete/${ids}`
  );
};

// 获取反馈分页列表
export const getFeedbackPage = (data: FeedbackQuery) => {
  return http.request<FeedbackResult>("post", "/api/feedback/page", {
    data
  });
};

// 获取反馈详情
export const getFeedbackDetails = (id: number) => {
  return http.request<FeedbackResult>("get", `/api/feedback/details/${id}`);
};

// 导出反馈
export const exportFeedback = (data: FeedbackQuery) => {
  return http.request<Blob>("post", "/api/feedback/export", {
    data,
    responseType: "blob"
  });
};

// 导入反馈
export const importFeedback = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return http.request<FeedbackResult>("post", "/api/feedback/import", {
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

// 下载反馈导入模板
export const downloadTemplate = () => {
  return http.request<Blob>("get", "/api/feedback/downloadTemplate", {
    responseType: "blob"
  });
};

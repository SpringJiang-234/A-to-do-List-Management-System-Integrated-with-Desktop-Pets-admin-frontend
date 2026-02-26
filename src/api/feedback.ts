import { http } from "@/utils/http";

export type FeedbackResult = {
  code: number;
  msg: string;
  data: any;
};

export type FeedbackDTO = {
  id?: number;
  userId?: number;
  title?: string;
  content?: string;
  status?: number;
  replyContent?: string;
};

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

export type FeedbackVO = {
  id: number;
  userId: number;
  title: string;
  content: string;
  status: string;
  createTime: string;
  updateTime: string;
};

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

export type PageResult<T> = {
  records: T[];
  total: number;
  current: number;
  size: number;
};

export const insertFeedback = (data: FeedbackDTO) => {
  return http.request<FeedbackResult>("post", "/api/feedback/insert", {
    data
  });
};

export const updateFeedback = (data: FeedbackDTO) => {
  return http.request<FeedbackResult>("post", "/api/feedback/update", {
    data
  });
};

export const deleteFeedback = (id: number) => {
  return http.request<FeedbackResult>("get", `/api/feedback/delete/${id}`);
};

export const batchDeleteFeedback = (ids: string) => {
  return http.request<FeedbackResult>(
    "get",
    `/api/feedback/batchDelete/${ids}`
  );
};

export const getFeedbackPage = (data: FeedbackQuery) => {
  return http.request<FeedbackResult>("post", "/api/feedback/page", {
    data
  });
};

export const getFeedbackDetails = (id: number) => {
  return http.request<FeedbackResult>("get", `/api/feedback/details/${id}`);
};

export const exportFeedback = (data: FeedbackQuery) => {
  return http.request<Blob>("post", "/api/feedback/export", {
    data,
    responseType: "blob"
  });
};

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

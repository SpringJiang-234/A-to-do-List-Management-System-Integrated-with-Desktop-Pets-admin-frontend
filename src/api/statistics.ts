import { http } from "@/utils/http";

// 返回结果类型
export type StatisticsResult = {
  code: number;
  msg: string;
  data: any;
  success?: boolean;
};

/* 用户分析相关API */

// 获取用户总数
export const getTotalUsers = () => {
  return http.request<StatisticsResult>("get", "/api/statistics/user/total");
};

// 获取指定日期新增用户数
export const getNewUsersByDate = (date: string) => {
  return http.request<StatisticsResult>(
    "get",
    `/api/statistics/user/new-by-date?date=${date}`
  );
};

// 获取用户状态分布
export const getUserStatusDistribution = () => {
  return http.request<StatisticsResult>(
    "get",
    "/api/statistics/user/status-distribution"
  );
};

// 获取用户性别分布
export const getUserGenderDistribution = () => {
  return http.request<StatisticsResult>(
    "get",
    "/api/statistics/user/gender-distribution"
  );
};

// 获取用户生日月份分布
export const getUserBirthMonthDistribution = () => {
  return http.request<StatisticsResult>(
    "get",
    "/api/statistics/user/birth-month-distribution"
  );
};

// 获取用户注册热力图数据
export const getUserRegistrationHeatmap = (
  startDate: string,
  endDate: string
) => {
  return http.request<StatisticsResult>(
    "get",
    `/api/statistics/user/registration-heatmap?startDate=${startDate}&endDate=${endDate}`
  );
};

// 获取每日新增用户趋势
export const getDailyNewUsers = (startDate: string, endDate: string) => {
  return http.request<StatisticsResult>(
    "get",
    `/api/statistics/user/daily-new?startDate=${startDate}&endDate=${endDate}`
  );
};

// 获取每日总用户趋势
export const getDailyTotalUsers = (startDate: string, endDate: string) => {
  return http.request<StatisticsResult>(
    "get",
    `/api/statistics/user/daily-total?startDate=${startDate}&endDate=${endDate}`
  );
};

/* 待办事项分析相关API */

// 获取待办总数
export const getTotalTodos = () => {
  return http.request<StatisticsResult>("get", "/api/statistics/todo/total");
};

// 获取指定日期新增待办数
export const getNewTodosByDate = (date: string) => {
  return http.request<StatisticsResult>(
    "get",
    `/api/statistics/todo/new-by-date?date=${date}`
  );
};

// 获取待办状态分布
export const getTodoStatusDistribution = () => {
  return http.request<StatisticsResult>(
    "get",
    "/api/statistics/todo/status-distribution"
  );
};

// 获取待办优先级分布
export const getTodoPriorityDistribution = () => {
  return http.request<StatisticsResult>(
    "get",
    "/api/statistics/todo/priority-distribution"
  );
};

// 获取每日新增待办趋势
export const getDailyNewTodos = (startDate: string, endDate: string) => {
  return http.request<StatisticsResult>(
    "get",
    `/api/statistics/todo/daily-new?startDate=${startDate}&endDate=${endDate}`
  );
};

// 获取待办截止时间预警
export const getTodoDeadlineWarning = (days: number) => {
  return http.request<StatisticsResult>(
    "get",
    `/api/statistics/todo/deadline-warning?days=${days}`
  );
};

// 获取待办类别分布
export const getTodoCategoryDistribution = () => {
  return http.request<StatisticsResult>(
    "get",
    "/api/statistics/todo/category-distribution"
  );
};

// 获取待办标签频率
export const getTodoTagFrequency = () => {
  return http.request<StatisticsResult>(
    "get",
    "/api/statistics/todo/tag-frequency"
  );
};

// 获取待办完成率趋势
export const getTodoCompletionRateTrend = (
  startDate: string,
  endDate: string
) => {
  return http.request<StatisticsResult>(
    "get",
    `/api/statistics/todo/completion-rate-trend?startDate=${startDate}&endDate=${endDate}`
  );
};

/* 桌面宠物分析相关API */

// 获取宠物等级分布
export const getPetLevelDistribution = () => {
  return http.request<StatisticsResult>(
    "get",
    "/api/statistics/pet/level-distribution"
  );
};

// 获取宠物活力值分布
export const getPetEnergyDistribution = () => {
  return http.request<StatisticsResult>(
    "get",
    "/api/statistics/pet/energy-distribution"
  );
};

// 获取宠物心情值分布
export const getPetMoodDistribution = () => {
  return http.request<StatisticsResult>(
    "get",
    "/api/statistics/pet/mood-distribution"
  );
};

// 获取宠物亲密度分布
export const getPetIntimacyDistribution = () => {
  return http.request<StatisticsResult>(
    "get",
    "/api/statistics/pet/intimacy-distribution"
  );
};

// 获取最高等级宠物排行
export const getTopLevelPets = (limit: number = 10) => {
  return http.request<StatisticsResult>(
    "get",
    `/api/statistics/pet/top-level?limit=${limit}`
  );
};

/* 反馈分析相关API */

// 获取反馈状态分布
export const getFeedbackStatusDistribution = () => {
  return http.request<StatisticsResult>(
    "get",
    "/api/statistics/feedback/status-distribution"
  );
};

// 获取每日反馈提交量
export const getDailyFeedbackSubmission = (
  startDate: string,
  endDate: string
) => {
  return http.request<StatisticsResult>(
    "get",
    `/api/statistics/feedback/daily-submission?startDate=${startDate}&endDate=${endDate}`
  );
};

/* 公告分析相关API */

// 获取公告置顶比例
export const getAnnouncementTopRatio = () => {
  return http.request<StatisticsResult>(
    "get",
    "/api/statistics/announcement/top-ratio"
  );
};

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import LineChart from "./components/LineChart.vue";
import PieChart from "./components/PieChart.vue";
import CalendarHeatmap from "./components/CalendarHeatmap.vue";

import {
  getTotalUsers,
  getNewUsersByDate,
  getUserStatusDistribution,
  getUserGenderDistribution,
  getUserBirthMonthDistribution,
  getUserRegistrationHeatmap,
  getDailyNewUsers,
  getDailyTotalUsers,
  getTotalTodos,
  getNewTodosByDate,
  getTodoStatusDistribution,
  getTodoPriorityDistribution,
  getDailyNewTodos,
  getTodoDeadlineWarning,
  getTodoCategoryDistribution,
  getTodoTagFrequency,
  getTodoCompletionRateTrend,
  getPetLevelDistribution,
  getPetEnergyDistribution,
  getPetMoodDistribution,
  getPetIntimacyDistribution,
  getTopLevelPets,
  getFeedbackStatusDistribution,
  getDailyFeedbackSubmission,
  getAnnouncementTopRatio
} from "@/api/statistics";

const loading = ref(false);

const totalUsers = ref(0);
const newUsersByDate = ref(0);
const userStatusDistribution = ref([]);
const userGenderDistribution = ref([]);
const userBirthMonthDistribution = ref([]);
const userRegistrationHeatmap = ref([]);
const dailyNewUsers = ref([]);
const dailyTotalUsers = ref([]);
const dailyNewUsersDate = ref([]);
const dailyTotalUsersDate = ref([]);

const totalTodos = ref(0);
const newTodosByDate = ref(0);
const todoStatusDistribution = ref([]);
const todoPriorityDistribution = ref([]);
const dailyNewTodos = ref([]);
const todoDeadlineWarning = ref([]);
const todoCategoryDistribution = ref([]);
const todoTagFrequency = ref([]);
const todoCompletionRateTrend = ref([]);

const petLevelDistribution = ref([]);
const petEnergyDistribution = ref([]);
const petMoodDistribution = ref([]);
const petIntimacyDistribution = ref([]);
const topLevelPets = ref([]);

const feedbackStatusDistribution = ref([]);
const dailyFeedbackSubmission = ref([]);
const announcementTopRatio = ref([]);

const fetchAllData = async () => {
  loading.value = true;
  try {
    const today = new Date().toISOString().split("T")[0];
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    const totalUsersRes = await getTotalUsers();
    const newUsersRes = await getNewUsersByDate(today);
    const userStatusRes = await getUserStatusDistribution();
    const userGenderRes = await getUserGenderDistribution();
    const userBirthMonthRes = await getUserBirthMonthDistribution();
    const userHeatmapRes = await getUserRegistrationHeatmap(
      thirtyDaysAgo,
      today
    );
    const dailyNewUsersRes = await getDailyNewUsers(thirtyDaysAgo, today);
    const dailyTotalUsersRes = await getDailyTotalUsers(thirtyDaysAgo, today);
    const totalTodosRes = await getTotalTodos();
    const newTodosRes = await getNewTodosByDate(today);
    const todoStatusRes = await getTodoStatusDistribution();
    const todoPriorityRes = await getTodoPriorityDistribution();
    const dailyNewTodosRes = await getDailyNewTodos(thirtyDaysAgo, today);
    const todoDeadlineRes = await getTodoDeadlineWarning(7);
    const todoCategoryRes = await getTodoCategoryDistribution();
    const todoTagRes = await getTodoTagFrequency();
    const todoCompletionRes = await getTodoCompletionRateTrend(
      thirtyDaysAgo,
      today
    );
    const petLevelRes = await getPetLevelDistribution();
    const petEnergyRes = await getPetEnergyDistribution();
    const petMoodRes = await getPetMoodDistribution();
    const petIntimacyRes = await getPetIntimacyDistribution();
    const topPetsRes = await getTopLevelPets(10);
    const feedbackStatusRes = await getFeedbackStatusDistribution();
    const dailyFeedbackRes = await getDailyFeedbackSubmission(
      thirtyDaysAgo,
      today
    );
    const announcementRes = await getAnnouncementTopRatio();

    totalUsers.value = totalUsersRes.data;
    newUsersByDate.value = newUsersRes.data;
    userStatusDistribution.value = userStatusRes.data;
    userGenderDistribution.value = userGenderRes.data;
    userBirthMonthDistribution.value = userBirthMonthRes.data;
    userRegistrationHeatmap.value = userHeatmapRes.data;
    dailyNewUsers.value = dailyNewUsersRes.data;
    dailyTotalUsers.value = dailyTotalUsersRes.data;

    dailyNewUsersDate.value = dailyNewUsersRes.data.map(
      (item: any) => item.date
    );
    dailyTotalUsersDate.value = dailyTotalUsersRes.data.map(
      (item: any) => item.date
    );

    totalTodos.value = totalTodosRes.data;
    newTodosByDate.value = newTodosRes.data;
    todoStatusDistribution.value = todoStatusRes.data;
    todoPriorityDistribution.value = todoPriorityRes.data;
    dailyNewTodos.value = dailyNewTodosRes.data;
    todoDeadlineWarning.value = todoDeadlineRes.data;
    todoCategoryDistribution.value = todoCategoryRes.data;
    todoTagFrequency.value = todoTagRes.data;
    todoCompletionRateTrend.value = todoCompletionRes.data;

    petLevelDistribution.value = petLevelRes.data;
    petEnergyDistribution.value = petEnergyRes.data;
    petMoodDistribution.value = petMoodRes.data;
    petIntimacyDistribution.value = petIntimacyRes.data;
    topLevelPets.value = topPetsRes.data;

    feedbackStatusDistribution.value = feedbackStatusRes.data;
    dailyFeedbackSubmission.value = dailyFeedbackRes.data;
    announcementTopRatio.value = announcementRes.data;
  } catch (error) {
    console.error("获取统计数据失败:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchAllData();
});

const userTrendData = computed(() => {
  const xAxisData = dailyNewUsersDate.value;
  const series = [
    {
      name: "新增用户",
      data: dailyNewUsers.value.map((item: any) => item.count)
    },
    {
      name: "用户总数",
      data: dailyTotalUsers.value.map((item: any) => item.total)
    }
  ];
  return { xAxisData, series };
});

const userStatusChartData = computed(() => {
  const statusMap: Record<number, string> = {
    1: "正常",
    2: "已注销"
  };
  return userStatusDistribution.value.map((item: any) => ({
    name: statusMap[item.status],
    value: item.count
  }));
});

const userGenderChartData = computed(() => {
  const genderMap: Record<number, string> = {
    1: "男",
    2: "女",
    3: "未知"
  };
  return userGenderDistribution.value.map((item: any) => ({
    name: genderMap[item.gender],
    value: item.count
  }));
});

const userBirthMonthChartData = computed(() => {
  return userBirthMonthDistribution.value.map((item: any) => ({
    name: `${item.month}月`,
    value: item.count
  }));
});

const userRegistrationHeatmapData = computed(() => {
  const currentYear = new Date().getFullYear();
  const startDate = new Date(currentYear, 0, 1);
  const endDate = new Date(currentYear, 11, 31);

  const dataMap = new Map<string, number>();
  userRegistrationHeatmap.value.forEach((item: any) => {
    dataMap.set(item.date, item.count);
  });

  const result: [string, number][] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split("T")[0];
    result.push([dateStr, dataMap.get(dateStr) || 0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return result;
});
</script>

<template>
  <div>
    <el-card shadow="never">
      <template #header>
        <span>用户统计</span>
      </template>
      <LineChart
        :xAxisData="userTrendData.xAxisData"
        :series="userTrendData.series"
        title="用户总数与新用户趋势"
        height="400px"
      />
      <PieChart
        :data="userStatusChartData"
        title="用户状态分布"
        height="400px"
      />
      <PieChart
        :data="userGenderChartData"
        title="用户性别分布"
        height="400px"
      />
      <PieChart
        :data="userBirthMonthChartData"
        title="用户生日月份分布"
        height="400px"
      />
      <CalendarHeatmap
        :data="userRegistrationHeatmapData"
        title="用户注册时间热力图"
        height="400px"
        backgroundColor="transparent"
      />
    </el-card>
  </div>
</template>

<style scoped>
.el-card {
  margin-bottom: 20px;
}
</style>

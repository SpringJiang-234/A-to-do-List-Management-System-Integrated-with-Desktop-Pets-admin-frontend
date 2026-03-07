<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import LineChart from "./components/LineChart.vue";
import PieChart from "./components/PieChart.vue";
import CalendarHeatmap from "./components/CalendarHeatmap.vue";
import WordcloudChart from "./components/WordcloudChart.vue";
import BarChart from "./components/BarChart.vue";
import BarChartHorizontal from "./components/BarChartHorizontal.vue";
import BoxplotChart from "./components/BoxplotChart.vue";

import {
  getUserStatusDistribution,
  getUserGenderDistribution,
  getUserBirthMonthDistribution,
  getUserRegistrationHeatmap,
  getDailyNewUsers,
  getDailyTotalUsers,
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

const userStatusDistribution = ref([]);
const userGenderDistribution = ref([]);
const userBirthMonthDistribution = ref([]);
const userRegistrationHeatmap = ref([]);
const dailyNewUsers = ref([]);
const dailyTotalUsers = ref([]);
const dailyNewUsersDate = ref([]);
const dailyTotalUsersDate = ref([]);

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

    const userStatusRes = await getUserStatusDistribution();
    const userGenderRes = await getUserGenderDistribution();
    const userBirthMonthRes = await getUserBirthMonthDistribution();
    const userHeatmapRes = await getUserRegistrationHeatmap(
      thirtyDaysAgo,
      today
    );
    const dailyNewUsersRes = await getDailyNewUsers(thirtyDaysAgo, today);
    const dailyTotalUsersRes = await getDailyTotalUsers(thirtyDaysAgo, today);
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

const todoStatusChartData = computed(() => {
  const statusMap: Record<number, string> = {
    0: "未开始",
    1: "进行中",
    2: "已完成",
    3: "已取消"
  };
  return todoStatusDistribution.value.map((item: any) => ({
    name: statusMap[item.status] || item.status,
    value: item.count
  }));
});

const todoPriorityChartData = computed(() => {
  const priorityMap: Record<number, string> = {
    0: "无优先级",
    1: "低",
    2: "中",
    3: "高"
  };
  return todoPriorityDistribution.value.map((item: any) => ({
    name: priorityMap[item.priority] || item.priority,
    value: item.count
  }));
});

const todoTrendData = computed(() => {
  const xAxisData = dailyNewTodos.value.map((item: any) => item.date);
  const series = [
    {
      name: "每日新增待办",
      data: dailyNewTodos.value.map((item: any) => item.count)
    }
  ];
  return { xAxisData, series };
});

const todoCompletionRateData = computed(() => {
  const xAxisData = todoCompletionRateTrend.value.map((item: any) => item.date);
  const series = [
    {
      name: "完成率",
      data: todoCompletionRateTrend.value.map(
        (item: any) => item.completionRate
      )
    }
  ];
  return { xAxisData, series };
});

const todoTagCloudData = computed(() => {
  return todoTagFrequency.value.map((item: any) => ({
    name: item.tagName,
    value: item.frequency
  }));
});

const petLevelChartData = computed(() => {
  return petLevelDistribution.value.map((item: any) => ({
    category: `${item.levelRangeStart}-${item.levelRangeEnd}级`,
    value: item.count
  }));
});

const petEnergyChartData = computed(() => {
  return petEnergyDistribution.value.map((item: any) => ({
    category: item.energy.toString(),
    value: item.count
  }));
});

const petMoodChartData = computed(() => {
  return petMoodDistribution.value.map((item: any) => ({
    category: item.mood.toString(),
    value: item.count
  }));
});

const petIntimacyChartData = computed(() => {
  return petIntimacyDistribution.value.map((item: any) => ({
    category: item.intimacy.toString(),
    value: item.count
  }));
});

const topLevelPetsData = computed(() => {
  return topLevelPets.value.map((item: any) => ({
    category: item.petNickname,
    value: item.petLevel
  }));
});
</script>

<template>
  <div>
    <el-card shadow="never">
      <template #header>
        <h3>用户统计</h3>
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

    <el-card shadow="never">
      <template #header>
        <h3>桌宠统计</h3>
      </template>
      <BarChart :data="petLevelChartData" title="桌宠等级分布" height="400px" />
      <BarChart
        :data="petEnergyChartData"
        title="桌宠活力值分布"
        height="400px"
      />
      <BarChart
        :data="petMoodChartData"
        title="桌宠心情值分布"
        height="400px"
      />
      <BarChart
        :data="petIntimacyChartData"
        title="桌宠亲密度分布"
        height="400px"
      />
      <BarChartHorizontal
        :data="topLevelPetsData"
        title="桌宠最高等级排行"
        height="400px"
      />
    </el-card>

    <el-card shadow="never">
      <template #header>
        <h3>待办事项统计</h3>
      </template>
      <PieChart
        :data="todoStatusChartData"
        title="待办事项状态分布"
        height="400px"
      />
      <PieChart
        :data="todoPriorityChartData"
        title="待办事项优先级分布"
        height="400px"
      />
      <LineChart
        :xAxisData="todoTrendData.xAxisData"
        :series="todoTrendData.series"
        title="新增待办事项趋势"
        height="400px"
      />
      <LineChart
        :xAxisData="todoCompletionRateData.xAxisData"
        :series="todoCompletionRateData.series"
        title="待办事项完成率趋势"
        height="400px"
      />
      <!-- TODO: 待办事项标签分布 -->
      <WordcloudChart
        :data="todoTagCloudData"
        title="待办事项标签分布"
        height="400px"
      />
    </el-card>
  </div>
</template>

<style scoped>
.el-card {
  margin-bottom: 20px;
}
</style>

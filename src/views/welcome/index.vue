<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  getTotalUsers,
  getNewUsersByDate,
  getUserTypeDistribution,
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
const userTypeDistribution = ref([]);
const userStatusDistribution = ref([]);
const userGenderDistribution = ref([]);
const userBirthMonthDistribution = ref([]);
const userRegistrationHeatmap = ref([]);
const dailyNewUsers = ref([]);
const dailyTotalUsers = ref([]);

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
    const userTypeRes = await getUserTypeDistribution();
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
    userTypeDistribution.value = userTypeRes.data;
    userStatusDistribution.value = userStatusRes.data;
    userGenderDistribution.value = userGenderRes.data;
    userBirthMonthDistribution.value = userBirthMonthRes.data;
    userRegistrationHeatmap.value = userHeatmapRes.data;
    dailyNewUsers.value = dailyNewUsersRes.data;
    dailyTotalUsers.value = dailyTotalUsersRes.data;

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
</script>

<template>
  <div>
    <el-card>
      <template #header>
        <span>用户统计</span>
      </template>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-statistic title="用户总数" :value="totalUsers" />
        </el-col>
        <el-col :span="8">
          <el-statistic title="今日新增" :value="newUsersByDate" />
        </el-col>
        <el-col :span="8">
          <el-statistic title="待办总数" :value="totalTodos" />
        </el-col>
      </el-row>
    </el-card>

    <el-card style="margin-top: 20px">
      <template #header>
        <span>用户类型分布</span>
      </template>
      <div
        v-for="(item, index) in userTypeDistribution"
        :key="index"
        style="margin-bottom: 10px"
      >
        类型: {{ item.type }} - 数量: {{ item.count }}
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <template #header>
        <span>用户状态分布</span>
      </template>
      <div
        v-for="(item, index) in userStatusDistribution"
        :key="index"
        style="margin-bottom: 10px"
      >
        状态: {{ item.status }} - 数量: {{ item.count }}
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <template #header>
        <span>用户性别分布</span>
      </template>
      <div
        v-for="(item, index) in userGenderDistribution"
        :key="index"
        style="margin-bottom: 10px"
      >
        性别: {{ item.gender }} - 数量: {{ item.count }}
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <template #header>
        <span>用户生日月份分布</span>
      </template>
      <div
        v-for="(item, index) in userBirthMonthDistribution"
        :key="index"
        style="margin-bottom: 10px"
      >
        月份: {{ item.month }} - 数量: {{ item.count }}
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <template #header>
        <span>用户注册热力图数据</span>
      </template>
      <div
        v-for="(item, index) in userRegistrationHeatmap"
        :key="index"
        style="margin-bottom: 10px"
      >
        日期: {{ item.date }} - 数量: {{ item.count }}
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <template #header>
        <span>每日新增用户趋势</span>
      </template>
      <div
        v-for="(item, index) in dailyNewUsers"
        :key="index"
        style="margin-bottom: 10px"
      >
        日期: {{ item.date }} - 新增: {{ item.count }}
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <template #header>
        <span>每日总用户趋势</span>
      </template>
      <div
        v-for="(item, index) in dailyTotalUsers"
        :key="index"
        style="margin-bottom: 10px"
      >
        日期: {{ item.date }} - 总数: {{ item.total }}
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <template #header>
        <span>待办事项统计</span>
      </template>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-statistic title="待办总数" :value="totalTodos" />
        </el-col>
        <el-col :span="12">
          <el-statistic title="今日新增" :value="newTodosByDate" />
        </el-col>
      </el-row>
    </el-card>

    <el-card style="margin-top: 20px">
      <template #header>
        <span>待办状态分布</span>
      </template>
      <div
        v-for="(item, index) in todoStatusDistribution"
        :key="index"
        style="margin-bottom: 10px"
      >
        状态: {{ item.status }} - 数量: {{ item.count }}
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <template #header>
        <span>待办优先级分布</span>
      </template>
      <div
        v-for="(item, index) in todoPriorityDistribution"
        :key="index"
        style="margin-bottom: 10px"
      >
        优先级: {{ item.priority }} - 数量: {{ item.count }}
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <template #header>
        <span>每日新增待办趋势</span>
      </template>
      <div
        v-for="(item, index) in dailyNewTodos"
        :key="index"
        style="margin-bottom: 10px"
      >
        日期: {{ item.date }} - 新增: {{ item.count }}
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <template #header>
        <span>待办截止时间预警</span>
      </template>
      <div
        v-for="(item, index) in todoDeadlineWarning"
        :key="index"
        style="margin-bottom: 10px"
      >
        待办ID: {{ item.todoId }} - 截止时间: {{ item.deadline }}
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <template #header>
        <span>待办类别分布</span>
      </template>
      <div
        v-for="(item, index) in todoCategoryDistribution"
        :key="index"
        style="margin-bottom: 10px"
      >
        类别: {{ item.category }} - 数量: {{ item.count }}
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <template #header>
        <span>待办标签频率</span>
      </template>
      <div
        v-for="(item, index) in todoTagFrequency"
        :key="index"
        style="margin-bottom: 10px"
      >
        标签: {{ item.tag }} - 频率: {{ item.frequency }}
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <template #header>
        <span>待办完成率趋势</span>
      </template>
      <div
        v-for="(item, index) in todoCompletionRateTrend"
        :key="index"
        style="margin-bottom: 10px"
      >
        日期: {{ item.date }} - 完成率: {{ item.completionRate }}%
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <template #header>
        <span>宠物等级分布</span>
      </template>
      <div
        v-for="(item, index) in petLevelDistribution"
        :key="index"
        style="margin-bottom: 10px"
      >
        等级: {{ item.level }} - 数量: {{ item.count }}
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <template #header>
        <span>宠物活力值分布</span>
      </template>
      <div
        v-for="(item, index) in petEnergyDistribution"
        :key="index"
        style="margin-bottom: 10px"
      >
        活力值: {{ item.energy }} - 数量: {{ item.count }}
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <template #header>
        <span>宠物心情值分布</span>
      </template>
      <div
        v-for="(item, index) in petMoodDistribution"
        :key="index"
        style="margin-bottom: 10px"
      >
        心情值: {{ item.mood }} - 数量: {{ item.count }}
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <template #header>
        <span>宠物亲密度分布</span>
      </template>
      <div
        v-for="(item, index) in petIntimacyDistribution"
        :key="index"
        style="margin-bottom: 10px"
      >
        亲密度: {{ item.intimacy }} - 数量: {{ item.count }}
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <template #header>
        <span>最高等级宠物排行</span>
      </template>
      <div
        v-for="(item, index) in topLevelPets"
        :key="index"
        style="margin-bottom: 10px"
      >
        排名: {{ index + 1 }} - 宠物ID: {{ item.petId }} - 等级:
        {{ item.level }}
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <template #header>
        <span>反馈状态分布</span>
      </template>
      <div
        v-for="(item, index) in feedbackStatusDistribution"
        :key="index"
        style="margin-bottom: 10px"
      >
        状态: {{ item.status }} - 数量: {{ item.count }}
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <template #header>
        <span>每日反馈提交量</span>
      </template>
      <div
        v-for="(item, index) in dailyFeedbackSubmission"
        :key="index"
        style="margin-bottom: 10px"
      >
        日期: {{ item.date }} - 提交量: {{ item.count }}
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <template #header>
        <span>公告置顶比例</span>
      </template>
      <div
        v-for="(item, index) in announcementTopRatio"
        :key="index"
        style="margin-bottom: 10px"
      >
        置顶: {{ item.isTop }} - 数量: {{ item.count }}
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.el-card {
  margin-bottom: 20px;
}
</style>

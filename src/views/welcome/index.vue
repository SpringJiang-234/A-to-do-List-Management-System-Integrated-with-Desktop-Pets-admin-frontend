<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import echarts from "@/plugins/echarts";
import dayjs from "dayjs";
import * as statisticsApi from "@/api/statistics";

defineOptions({
  name: "Welcome"
});

// 时间范围
const dateRange = ref({
  startDate: dayjs().subtract(6, "day").format("YYYY-MM-DD"),
  endDate: dayjs().format("YYYY-MM-DD")
});

// 数据
const totalUsers = ref(0);
const totalTodos = ref(0);
const userTypeDistribution = ref<any[]>([]);
const userStatusDistribution = ref<any[]>([]);
const userGenderDistribution = ref<any[]>([]);
const todoStatusDistribution = ref<any[]>([]);
const todoPriorityDistribution = ref<any[]>([]);
const dailyNewUsers = ref<any[]>([]);
const dailyNewTodos = ref<any[]>([]);
const petLevelDistribution = ref<any[]>([]);
const petEnergyDistribution = ref<any[]>([]);
const petMoodDistribution = ref<any[]>([]);
const petIntimacyDistribution = ref<any[]>([]);
const feedbackStatusDistribution = ref<any[]>([]);
const announcementTopRatio = ref<any[]>([]);

// 图表实例
const userTypeChart = ref<echarts.ECharts | null>(null);
const userStatusChart = ref<echarts.ECharts | null>(null);
const userGenderChart = ref<echarts.ECharts | null>(null);
const todoStatusChart = ref<echarts.ECharts | null>(null);
const todoPriorityChart = ref<echarts.ECharts | null>(null);
const dailyNewUsersChart = ref<echarts.ECharts | null>(null);
const dailyNewTodosChart = ref<echarts.ECharts | null>(null);
const petLevelChart = ref<echarts.ECharts | null>(null);
const petEnergyChart = ref<echarts.ECharts | null>(null);
const petMoodChart = ref<echarts.ECharts | null>(null);
const petIntimacyChart = ref<echarts.ECharts | null>(null);
const feedbackStatusChart = ref<echarts.ECharts | null>(null);
const announcementTopChart = ref<echarts.ECharts | null>(null);

// 初始化图表
const initCharts = () => {
  // 用户类型分布
  userTypeChart.value = echarts.init(document.getElementById("userTypeChart")!);
  // 用户状态分布
  userStatusChart.value = echarts.init(
    document.getElementById("userStatusChart")!
  );
  // 用户性别分布
  userGenderChart.value = echarts.init(
    document.getElementById("userGenderChart")!
  );
  // 待办状态分布
  todoStatusChart.value = echarts.init(
    document.getElementById("todoStatusChart")!
  );
  // 待办优先级分布
  todoPriorityChart.value = echarts.init(
    document.getElementById("todoPriorityChart")!
  );
  // 每日新增用户
  dailyNewUsersChart.value = echarts.init(
    document.getElementById("dailyNewUsersChart")!
  );
  // 每日新增待办
  dailyNewTodosChart.value = echarts.init(
    document.getElementById("dailyNewTodosChart")!
  );
  // 宠物等级分布
  petLevelChart.value = echarts.init(document.getElementById("petLevelChart")!);
  // 宠物活力值分布
  petEnergyChart.value = echarts.init(
    document.getElementById("petEnergyChart")!
  );
  // 宠物心情值分布
  petMoodChart.value = echarts.init(document.getElementById("petMoodChart")!);
  // 宠物亲密度分布
  petIntimacyChart.value = echarts.init(
    document.getElementById("petIntimacyChart")!
  );
  // 反馈状态分布
  feedbackStatusChart.value = echarts.init(
    document.getElementById("feedbackStatusChart")!
  );
  // 公告置顶比例
  announcementTopChart.value = echarts.init(
    document.getElementById("announcementTopChart")!
  );
};

// 更新图表数据
const updateCharts = () => {
  // 用户类型分布
  userTypeChart.value?.setOption({
    title: { text: "用户类型分布", left: "center" },
    tooltip: { trigger: "item" },
    series: [
      {
        type: "pie",
        radius: "60%",
        data: userTypeDistribution.value,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)"
          }
        }
      }
    ]
  });

  // 用户状态分布
  userStatusChart.value?.setOption({
    title: { text: "用户状态分布", left: "center" },
    tooltip: { trigger: "item" },
    series: [
      {
        type: "pie",
        radius: "60%",
        data: userStatusDistribution.value,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)"
          }
        }
      }
    ]
  });

  // 用户性别分布
  userGenderChart.value?.setOption({
    title: { text: "用户性别分布", left: "center" },
    tooltip: { trigger: "item" },
    series: [
      {
        type: "pie",
        radius: "60%",
        data: userGenderDistribution.value,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)"
          }
        }
      }
    ]
  });

  // 待办状态分布
  todoStatusChart.value?.setOption({
    title: { text: "待办状态分布", left: "center" },
    tooltip: { trigger: "item" },
    series: [
      {
        type: "pie",
        radius: "60%",
        data: todoStatusDistribution.value,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)"
          }
        }
      }
    ]
  });

  // 待办优先级分布
  todoPriorityChart.value?.setOption({
    title: { text: "待办优先级分布", left: "center" },
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    xAxis: {
      type: "category",
      data: todoPriorityDistribution.value.map(item => item.name)
    },
    yAxis: { type: "value" },
    series: [
      {
        data: todoPriorityDistribution.value.map(item => item.value),
        type: "bar",
        showBackground: true,
        backgroundStyle: { color: "rgba(180, 180, 180, 0.2)" }
      }
    ]
  });

  // 每日新增用户
  dailyNewUsersChart.value?.setOption({
    title: { text: "每日新增用户", left: "center" },
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: dailyNewUsers.value.map(item => item.date)
    },
    yAxis: { type: "value" },
    series: [
      {
        data: dailyNewUsers.value.map(item => item.count),
        type: "line",
        smooth: true
      }
    ]
  });

  // 每日新增待办
  dailyNewTodosChart.value?.setOption({
    title: { text: "每日新增待办", left: "center" },
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: dailyNewTodos.value.map(item => item.date)
    },
    yAxis: { type: "value" },
    series: [
      {
        data: dailyNewTodos.value.map(item => item.count),
        type: "line",
        smooth: true
      }
    ]
  });

  // 宠物等级分布
  petLevelChart.value?.setOption({
    title: { text: "宠物等级分布", left: "center" },
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    xAxis: {
      type: "category",
      data: petLevelDistribution.value.map(
        item => `${item.levelRangeStart}-${item.levelRangeEnd}`
      )
    },
    yAxis: { type: "value" },
    series: [
      {
        data: petLevelDistribution.value.map(item => item.count),
        type: "bar",
        showBackground: true,
        backgroundStyle: { color: "rgba(180, 180, 180, 0.2)" }
      }
    ]
  });

  // 宠物活力值分布
  petEnergyChart.value?.setOption({
    title: { text: "宠物活力值分布", left: "center" },
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    xAxis: {
      type: "category",
      data: petEnergyDistribution.value.map(item => item.energy)
    },
    yAxis: { type: "value" },
    series: [
      {
        data: petEnergyDistribution.value.map(item => item.count),
        type: "bar",
        showBackground: true,
        backgroundStyle: { color: "rgba(180, 180, 180, 0.2)" }
      }
    ]
  });

  // 宠物心情值分布
  petMoodChart.value?.setOption({
    title: { text: "宠物心情值分布", left: "center" },
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    xAxis: {
      type: "category",
      data: petMoodDistribution.value.map(item => item.mood)
    },
    yAxis: { type: "value" },
    series: [
      {
        data: petMoodDistribution.value.map(item => item.count),
        type: "bar",
        showBackground: true,
        backgroundStyle: { color: "rgba(180, 180, 180, 0.2)" }
      }
    ]
  });

  // 宠物亲密度分布
  petIntimacyChart.value?.setOption({
    title: { text: "宠物亲密度分布", left: "center" },
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    xAxis: {
      type: "category",
      data: petIntimacyDistribution.value.map(item => item.intimacy)
    },
    yAxis: { type: "value" },
    series: [
      {
        data: petIntimacyDistribution.value.map(item => item.count),
        type: "bar",
        showBackground: true,
        backgroundStyle: { color: "rgba(180, 180, 180, 0.2)" }
      }
    ]
  });

  // 反馈状态分布
  feedbackStatusChart.value?.setOption({
    title: { text: "反馈状态分布", left: "center" },
    tooltip: { trigger: "item" },
    series: [
      {
        type: "pie",
        radius: "60%",
        data: feedbackStatusDistribution.value,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)"
          }
        }
      }
    ]
  });

  // 公告置顶比例
  announcementTopChart.value?.setOption({
    title: { text: "公告置顶比例", left: "center" },
    tooltip: { trigger: "item" },
    series: [
      {
        type: "pie",
        radius: "60%",
        data: announcementTopRatio.value,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)"
          }
        }
      }
    ]
  });
};

// 加载数据
const loadData = async () => {
  try {
    // 用户相关数据
    console.log("开始加载用户数据...");
    const userTotalRes = await statisticsApi.getTotalUsers();
    console.log("用户总数:", userTotalRes.data.data);
    totalUsers.value = userTotalRes.data.data;

    const userTypeRes = await statisticsApi.getUserTypeDistribution();
    console.log("用户类型分布:", userTypeRes.data.data);
    userTypeDistribution.value = userTypeRes.data.data;

    const userStatusRes = await statisticsApi.getUserStatusDistribution();
    console.log("用户状态分布:", userStatusRes.data.data);
    userStatusDistribution.value = userStatusRes.data.data;

    const userGenderRes = await statisticsApi.getUserGenderDistribution();
    console.log("用户性别分布:", userGenderRes.data.data);
    userGenderDistribution.value = userGenderRes.data.data;

    const dailyNewUsersRes = await statisticsApi.getDailyNewUsers(
      dateRange.value.startDate,
      dateRange.value.endDate
    );
    console.log("每日新增用户:", dailyNewUsersRes.data.data);
    dailyNewUsers.value = dailyNewUsersRes.data.data;

    // 待办相关数据
    console.log("开始加载待办数据...");
    const todoTotalRes = await statisticsApi.getTotalTodos();
    console.log("待办总数:", todoTotalRes.data.data);
    totalTodos.value = todoTotalRes.data.data;

    const todoStatusRes = await statisticsApi.getTodoStatusDistribution();
    console.log("待办状态分布:", todoStatusRes.data.data);
    todoStatusDistribution.value = todoStatusRes.data.data;

    const todoPriorityRes = await statisticsApi.getTodoPriorityDistribution();
    console.log("待办优先级分布:", todoPriorityRes.data.data);
    todoPriorityDistribution.value = todoPriorityRes.data.data;

    const dailyNewTodosRes = await statisticsApi.getDailyNewTodos(
      dateRange.value.startDate,
      dateRange.value.endDate
    );
    console.log("每日新增待办:", dailyNewTodosRes.data.data);
    dailyNewTodos.value = dailyNewTodosRes.data.data;

    // 宠物相关数据
    console.log("开始加载宠物数据...");
    try {
      const petLevelRes = await statisticsApi.getPetLevelDistribution();
      console.log("宠物等级分布:", petLevelRes.data.data);
      petLevelDistribution.value = petLevelRes.data.data;
    } catch (petError) {
      console.error("加载宠物等级分布失败:", petError);
      petLevelDistribution.value = [];
    }

    try {
      const petEnergyRes = await statisticsApi.getPetEnergyDistribution();
      console.log("宠物活力值分布:", petEnergyRes.data.data);
      petEnergyDistribution.value = petEnergyRes.data.data;
    } catch (petError) {
      console.error("加载宠物活力值分布失败:", petError);
      petEnergyDistribution.value = [];
    }

    try {
      const petMoodRes = await statisticsApi.getPetMoodDistribution();
      console.log("宠物心情值分布:", petMoodRes.data.data);
      petMoodDistribution.value = petMoodRes.data.data;
    } catch (petError) {
      console.error("加载宠物心情值分布失败:", petError);
      petMoodDistribution.value = [];
    }

    try {
      const petIntimacyRes = await statisticsApi.getPetIntimacyDistribution();
      console.log("宠物亲密度分布:", petIntimacyRes.data.data);
      petIntimacyDistribution.value = petIntimacyRes.data.data;
    } catch (petError) {
      console.error("加载宠物亲密度分布失败:", petError);
      petIntimacyDistribution.value = [];
    }

    // 反馈相关数据
    console.log("开始加载反馈数据...");
    try {
      const feedbackStatusRes =
        await statisticsApi.getFeedbackStatusDistribution();
      console.log("反馈状态分布:", feedbackStatusRes.data.data);
      feedbackStatusDistribution.value = feedbackStatusRes.data.data;
    } catch (feedbackError) {
      console.error("加载反馈状态分布失败:", feedbackError);
      feedbackStatusDistribution.value = [];
    }

    // 公告相关数据
    console.log("开始加载公告数据...");
    try {
      const announcementTopRes = await statisticsApi.getAnnouncementTopRatio();
      console.log("公告置顶比例:", announcementTopRes.data.data);
      announcementTopRatio.value = announcementTopRes.data.data;
    } catch (announcementError) {
      console.error("加载公告置顶比例失败:", announcementError);
      announcementTopRatio.value = [];
    }

    // 更新图表
    console.log("更新图表...");
    updateCharts();
  } catch (error) {
    console.error("加载数据失败:", error);
  }
};

// 响应式调整
const handleResize = () => {
  userTypeChart.value?.resize();
  userStatusChart.value?.resize();
  userGenderChart.value?.resize();
  todoStatusChart.value?.resize();
  todoPriorityChart.value?.resize();
  dailyNewUsersChart.value?.resize();
  dailyNewTodosChart.value?.resize();
  petLevelChart.value?.resize();
  petEnergyChart.value?.resize();
  petMoodChart.value?.resize();
  petIntimacyChart.value?.resize();
  feedbackStatusChart.value?.resize();
  announcementTopChart.value?.resize();
};

onMounted(() => {
  initCharts();
  loadData();
  window.addEventListener("resize", handleResize);
});
</script>

<template>
  <div class="dashboard-container">
    <!-- 系统概览 -->
    <el-card shadow="never" class="mb-4">
      <template #header>
        <h3>系统概览</h3>
      </template>
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-title">用户总数</div>
            <div class="stat-value">{{ totalUsers }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-title">待办总数</div>
            <div class="stat-value">{{ totalTodos }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-title">统计周期</div>
            <div class="stat-value">
              {{ dateRange.startDate }} 至 {{ dateRange.endDate }}
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 用户分析模块 -->
    <el-card shadow="never" class="mb-4">
      <template #header>
        <h3>用户分析</h3>
      </template>
      <el-row :gutter="20">
        <el-col :span="8">
          <div id="userTypeChart" class="chart-container" />
        </el-col>
        <el-col :span="8">
          <div id="userStatusChart" class="chart-container" />
        </el-col>
        <el-col :span="8">
          <div id="userGenderChart" class="chart-container" />
        </el-col>
        <el-col :span="24">
          <div id="dailyNewUsersChart" class="chart-container-lg" />
        </el-col>
      </el-row>
    </el-card>

    <!-- 待办事项分析模块 -->
    <el-card shadow="never" class="mb-4">
      <template #header>
        <h3>待办事项分析</h3>
      </template>
      <el-row :gutter="20">
        <el-col :span="12">
          <div id="todoStatusChart" class="chart-container" />
        </el-col>
        <el-col :span="12">
          <div id="todoPriorityChart" class="chart-container" />
        </el-col>
        <el-col :span="24">
          <div id="dailyNewTodosChart" class="chart-container-lg" />
        </el-col>
      </el-row>
    </el-card>

    <!-- 桌宠分析模块 -->
    <el-card shadow="never" class="mb-4">
      <template #header>
        <h3>桌宠分析</h3>
      </template>
      <el-row :gutter="20">
        <el-col :span="6">
          <div id="petLevelChart" class="chart-container" />
        </el-col>
        <el-col :span="6">
          <div id="petEnergyChart" class="chart-container" />
        </el-col>
        <el-col :span="6">
          <div id="petMoodChart" class="chart-container" />
        </el-col>
        <el-col :span="6">
          <div id="petIntimacyChart" class="chart-container" />
        </el-col>
      </el-row>
    </el-card>

    <!-- 反馈与公告模块 -->
    <el-card shadow="never" class="mb-4">
      <template #header>
        <h3>反馈与公告</h3>
      </template>
      <el-row :gutter="20">
        <el-col :span="12">
          <div id="feedbackStatusChart" class="chart-container" />
        </el-col>
        <el-col :span="12">
          <div id="announcementTopChart" class="chart-container" />
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.mb-4 {
  margin-bottom: 20px;
}

.stat-card {
  padding: 20px;
  text-align: center;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.stat-title {
  margin-bottom: 10px;
  font-size: 14px;
  color: #606266;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
}

.chart-container {
  width: 100%;
  height: 300px;
}

.chart-container-lg {
  width: 100%;
  height: 400px;
}

@media (width <= 768px) {
  .chart-container {
    height: 250px;
  }

  .chart-container-lg {
    height: 300px;
  }
}
</style>

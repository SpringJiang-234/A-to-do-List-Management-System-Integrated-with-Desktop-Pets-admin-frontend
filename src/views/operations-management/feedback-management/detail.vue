<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { getFeedbackDetails, type FeedbackDetails } from "@/api/feedback";
import { useDetail } from "./useDetail";

defineOptions({
  name: "FeedbackDetail"
});

const { initToDetail, getParameter } = useDetail();
const router = useRouter();
const route = useRoute();
const detail = ref<FeedbackDetails | null>(null);
const loading = ref(true);

const fetchDetail = async () => {
  const id = route.params.id as string;
  if (!id) {
    ElMessage.error("缺少反馈ID");
    return;
  }
  loading.value = true;
  try {
    const result = await getFeedbackDetails(Number(id));
    if (result.code === 200) {
      detail.value = result.data;
    } else {
      ElMessage.error(result.msg || "获取详情失败");
    }
  } catch (error) {
    ElMessage.error("获取详情失败");
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  router.back();
};

initToDetail();
onMounted(() => {
  fetchDetail();
});
</script>

<template>
  <div class="feedback-detail-container">
    <el-card v-loading="loading">
      <template #header>
        <div class="card-header">
          <span>反馈详情</span>
          <el-button @click="goBack">关闭</el-button>
        </div>
      </template>

      <div v-if="detail" class="detail-content">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="用户ID">
            {{ detail.userId }}
          </el-descriptions-item>
          <el-descriptions-item label="反馈标题">
            {{ detail.title }}
          </el-descriptions-item>
          <el-descriptions-item label="反馈内容">
            <div class="content-text">{{ detail.content }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="处理状态">
            {{ detail.status }}
          </el-descriptions-item>
          <el-descriptions-item label="回复内容">
            <div class="content-text">
              {{ detail.replyContent || "暂无回复" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            {{ detail.createTime }}
          </el-descriptions-item>
          <el-descriptions-item label="修改时间">
            {{ detail.updateTime }}
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <el-empty v-else-if="!loading" description="暂无数据" />
    </el-card>
  </div>
</template>

<style scoped>
.feedback-detail-container {
  padding: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.detail-content {
  padding: 20px 0;
}

.content-text {
  line-height: 1.6;
  word-break: break-word;
  white-space: pre-wrap;
}
</style>

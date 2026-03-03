<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import {
  getDesktopPetDetails,
  type DesktopPetDetails
} from "@/api/desktop-pet";
import { useDetail } from "./useDetail";

defineOptions({
  name: "DesktopPetDetail"
});

const { initToDetail, getParameter } = useDetail();
const router = useRouter();
const route = useRoute();
const detail = ref<DesktopPetDetails | null>(null);
const loading = ref(true);

const fetchDetail = async () => {
  const id = route.params.id as string;
  if (!id) {
    ElMessage.error("缺少桌宠ID");
    return;
  }
  loading.value = true;
  try {
    const result = await getDesktopPetDetails(Number(id));
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
  <div class="desktoppet-detail-container">
    <el-card v-loading="loading">
      <template #header>
        <div class="card-header">
          <span>桌宠详情</span>
          <el-button @click="goBack">关闭</el-button>
        </div>
      </template>

      <div v-if="detail" class="detail-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="用户ID">
            {{ detail.userId }}
          </el-descriptions-item>
          <el-descriptions-item label="桌宠昵称">
            {{ detail.nickname }}
          </el-descriptions-item>
          <el-descriptions-item label="活力值">
            {{ detail.energy }}
          </el-descriptions-item>
          <el-descriptions-item label="心情值">
            {{ detail.mood }}
          </el-descriptions-item>
          <el-descriptions-item label="亲密度">
            {{ detail.intimacy }}
          </el-descriptions-item>
          <el-descriptions-item label="成长值">
            {{ detail.exp }}
          </el-descriptions-item>
          <el-descriptions-item label="成长等级">
            {{ detail.level }}
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            {{ detail.createTime }}
          </el-descriptions-item>
          <el-descriptions-item label="更新时间" :span="2">
            {{ detail.updateTime }}
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <el-empty v-else-if="!loading" description="暂无数据" />
    </el-card>
  </div>
</template>

<style scoped>
.desktoppet-detail-container {
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
</style>

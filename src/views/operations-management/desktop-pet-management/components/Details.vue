<script setup lang="ts">
import dayjs from "dayjs";

defineOptions({
  name: "DesktopPetDetails"
});

const props = defineProps<{
  id?: number;
  userId?: number;
  nickname?: string;
  energy?: number;
  mood?: number;
  intimacy?: number;
  exp?: number;
  level?: number;
  createTime?: string;
  updateTime?: string;
}>();

const formatTime = (time?: string) => {
  return time ? dayjs(time).format("YYYY-MM-DD HH:mm:ss") : "";
};
</script>

<template>
  <el-descriptions :column="2" border>
    <el-descriptions-item label="桌宠ID">
      {{ id }}
    </el-descriptions-item>
    <el-descriptions-item label="用户ID">
      {{ userId }}
    </el-descriptions-item>
    <el-descriptions-item label="桌宠昵称">
      {{ nickname }}
    </el-descriptions-item>
    <el-descriptions-item label="成长等级">
      {{ level }}
    </el-descriptions-item>
    <el-descriptions-item label="能量值">
      {{ energy }}
    </el-descriptions-item>
    <el-descriptions-item label="心情值">
      {{ mood }}
    </el-descriptions-item>
    <el-descriptions-item label="亲密度">
      {{ intimacy }}
    </el-descriptions-item>
    <el-descriptions-item label="经验值">
      {{ exp }}
    </el-descriptions-item>
    <el-descriptions-item label="诞生日">
      {{ formatTime(createTime) }}
    </el-descriptions-item>
    <el-descriptions-item label="最近活跃">
      {{ formatTime(updateTime) }}
    </el-descriptions-item>
  </el-descriptions>
</template>

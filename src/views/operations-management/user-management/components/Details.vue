<script setup lang="ts">
import dayjs from "dayjs";

defineOptions({
  name: "UserDetails"
});

const props = defineProps<{
  id?: number;
  account?: string;
  passwordHash?: string;
  nickname?: string;
  avatar?: string;
  gender?: string;
  birth?: string;
  status?: string;
  type?: string;
  createTime?: string;
  updateTime?: string;
}>();

const formatTime = (time?: string) => {
  return time ? dayjs(time).format("YYYY-MM-DD HH:mm:ss") : "";
};
</script>

<template>
  <el-descriptions :column="2" border>
    <el-descriptions-item label="用户ID">
      {{ id }}
    </el-descriptions-item>
    <el-descriptions-item label="邮箱">
      {{ account }}
    </el-descriptions-item>
    <el-descriptions-item label="昵称">
      {{ nickname }}
    </el-descriptions-item>
    <el-descriptions-item label="性别">
      {{ gender }}
    </el-descriptions-item>
    <el-descriptions-item label="头像">
      <el-image
        v-if="avatar"
        :src="avatar.split('?')[0]"
        style="width: 60px; height: 60px; border-radius: 50%"
        fit="cover"
      />
      <span v-else>无</span>
    </el-descriptions-item>
    <el-descriptions-item label="生日">
      {{ birth }}
    </el-descriptions-item>
    <el-descriptions-item label="状态">
      {{ status }}
    </el-descriptions-item>
    <el-descriptions-item label="类型">
      {{ type }}
    </el-descriptions-item>
    <el-descriptions-item label="创建时间">
      {{ formatTime(createTime) }}
    </el-descriptions-item>
    <el-descriptions-item label="更新时间">
      {{ formatTime(updateTime) }}
    </el-descriptions-item>
  </el-descriptions>
</template>

<script setup lang="ts">
import { ElButton } from "element-plus";

interface Props {
  onAdd?: () => void;
  onImport?: () => void;
  onExport?: () => void;
  onBatchDelete?: () => void;
  onDownloadTemplate?: () => void;
}

defineProps<Props>();
</script>

<template>
  <div class="table-actions">
    <el-button type="primary" @click="onAdd">新增</el-button>
    <el-button @click="onImport">导入 Excel</el-button>
    <el-button @click="onExport">导出 Excel</el-button>
    <el-button @click="onDownloadTemplate">下载模板</el-button>
    <el-button type="danger" @click="onBatchDelete">批量删除</el-button>
  </div>
</template>

<style scoped>
.table-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-start;
  margin: 10px 0;
}
</style>

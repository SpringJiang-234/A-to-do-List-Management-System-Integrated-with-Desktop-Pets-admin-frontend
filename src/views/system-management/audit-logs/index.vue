<script setup lang="ts">
import { useColumns } from "./components/useColumns";
import { ref, onMounted, onActivated, onDeactivated, watch } from "vue";
import { ElMessage } from "element-plus";
import "plus-pro-components/es/components/form/style/css";
import {
  type PlusColumn,
  type FieldValues,
  PlusSearch
} from "plus-pro-components";
import { TABLE_HEIGHT } from "@/config";
import { TableActions } from "@/components/admin-frontend-components/TableActions";
import { exportAuditLog, type AuditLogQuery } from "@/api/audit-logs";
import { usePermissionStoreHook } from "@/store/modules/permission";
import { useRoute } from "vue-router";

defineOptions({
  name: "AuditLogManagement"
});

const route = useRoute();

/**
 * 搜索表单状态
 */
const state = ref<FieldValues>({
  userId: "",
  username: "",
  operation: "",
  module: "",
  ipAddress: "",
  createTime: [],
  updateTime: []
});

/**
 * 搜索参数
 */
const searchParams = ref<AuditLogQuery>({
  userId: undefined,
  username: "",
  operation: "",
  module: "",
  ipAddress: "",
  createTime: undefined,
  updateTime: undefined
});

/**
 * 搜索列
 */
const SearchColumns: PlusColumn[] = [
  {
    label: "操作人ID",
    prop: "userId",
    valueType: "copy",
    fieldProps: {
      placeholder: "请输入操作人ID"
    }
  },
  {
    label: "操作人",
    prop: "username",
    valueType: "copy",
    fieldProps: {
      placeholder: "请输入操作人"
    }
  },
  {
    label: "操作内容",
    prop: "operation",
    valueType: "copy",
    fieldProps: {
      placeholder: "请输入操作内容"
    }
  },
  {
    label: "操作模块",
    prop: "module",
    valueType: "copy",
    fieldProps: {
      placeholder: "请输入操作模块"
    }
  },
  {
    label: "IP地址",
    prop: "ipAddress",
    valueType: "copy",
    fieldProps: {
      placeholder: "请输入IP地址"
    }
  },
  {
    label: "操作时间",
    prop: "createTime",
    valueType: "date-picker",
    fieldProps: {
      type: "datetimerange",
      startPlaceholder: "请选择",
      endPlaceholder: "请选择"
    }
  },
  {
    label: "更新时间",
    prop: "updateTime",
    valueType: "date-picker",
    fieldProps: {
      type: "datetimerange",
      startPlaceholder: "请选择",
      endPlaceholder: "请选择"
    }
  }
];

/**
 * 搜索表单状态改变时触发
 * @param values 搜索表单状态
 */
const handleChange = (values: any) => {
  console.log(values, "change");
};

/**
 * 搜索表单提交时触发
 * @param values 搜索表单状态
 */
const handleSearch = (values: any) => {
  console.log(values, "search");

  searchParams.value = {
    userId: values.userId || undefined,
    username: values.username || "",
    operation: values.operation || "",
    module: values.module || "",
    ipAddress: values.ipAddress || "",
    createTime:
      values.createTime?.[0] && values.createTime?.[1]
        ? {
            start: values.createTime[0],
            end: values.createTime[1]
          }
        : undefined,
    updateTime:
      values.updateTime?.[0] && values.updateTime?.[1]
        ? {
            start: values.updateTime[0],
            end: values.updateTime[1]
          }
        : undefined
  };

  pagination.currentPage = 1;
  fetchAuditLogList();
};

/**
 * 搜索表单重置时触发
 */
const handleRest = () => {
  console.log("handleRest");

  state.value = {
    userId: "",
    username: "",
    operation: "",
    module: "",
    ipAddress: "",
    createTime: [],
    updateTime: []
  };

  searchParams.value = {
    userId: undefined,
    username: "",
    operation: "",
    module: "",
    ipAddress: "",
    createTime: undefined,
    updateTime: undefined
  };

  pagination.currentPage = 1;
  fetchAuditLogList();
};

/**
 * 导出 Excel
 */
const handleExport = async () => {
  try {
    const exportParams = {
      userId: searchParams.value.userId,
      username: searchParams.value.username,
      operation: searchParams.value.operation,
      module: searchParams.value.module,
      ipAddress: searchParams.value.ipAddress,
      createTime: searchParams.value.createTime,
      updateTime: searchParams.value.updateTime
    };
    const blob = await exportAuditLog(exportParams);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `审计日志_${new Date().getTime()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    ElMessage.success("导出成功");
  } catch (error) {
    ElMessage.error("导出失败");
  }
};

const {
  loading,
  columns,
  dataList,
  pagination,
  loadingConfig,
  onSizeChange,
  onCurrentChange,
  fetchAuditLogList,
  tableRef,
  multipleSelection,
  handleSelectionChange
} = useColumns(searchParams);

onMounted(() => {
  console.log("审计日志 - onMounted 触发，执行初始数据查询");
  fetchAuditLogList();
});

onActivated(() => {
  console.log("审计日志 - onActivated 触发");
  const cachePageList = usePermissionStoreHook().cachePageList;
  console.log("审计日志 - cachePageList:", cachePageList);
  console.log(
    "审计日志 - is in cache:",
    cachePageList.includes("AuditLogManagement")
  );
  fetchAuditLogList();
});

onDeactivated(() => {
  console.log("审计日志 - onDeactivated 触发");
});

// 监听路由变化，确保页面切换时刷新数据
watch(
  () => route.path,
  () => {
    console.log("审计日志 - 路由变化，触发数据刷新");
    fetchAuditLogList();
  }
);
</script>

<template>
  <div>
    <!-- 审计日志搜索栏 -->
    <div class="audit-log-container">
      <div>
        <PlusSearch
          v-model="state"
          :columns="SearchColumns"
          :show-number="2"
          label-width="80"
          label-position="right"
          @change="handleChange"
          @search="handleSearch"
          @reset="handleRest"
        />
      </div>

      <!-- 操作按钮 -->
      <TableActions :on-export="handleExport" />

      <!-- 表格 -->
      <div class="table-wrapper">
        <pure-table
          ref="tableRef"
          border
          row-key="id"
          alignWhole="center"
          showOverflowTooltip
          :header-cell-style="{
            backgroundColor: '#e8e8e8',
            color: '#303133',
            fontWeight: '600'
          }"
          :loading="loading"
          :loading-config="loadingConfig"
          :height="TABLE_HEIGHT"
          :data="dataList"
          :columns="columns"
          :pagination="pagination"
          @page-size-change="onSizeChange"
          @page-current-change="onCurrentChange"
          @selection-change="handleSelectionChange"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.audit-log-container {
  margin: 10px;
}

.audit-log-container :deep(.plus-search__unfold) {
  margin-left: 20px !important;
}
</style>

<script setup lang="ts">
import { useColumns } from "./columns";
import { ref, onActivated, onDeactivated } from "vue";
import { ElMessage } from "element-plus";
import "plus-pro-components/es/components/form/style/css";
import {
  type PlusColumn,
  type FieldValues,
  PlusSearch
} from "plus-pro-components";
import { TABLE_HEIGHT } from "@/config";
import { TableActions } from "@/components/admin-frontend-components/TableActions";
import { exportDesktopPet, type DesktopPetQuery } from "@/api/desktop-pet";
import { usePermissionStoreHook } from "@/store/modules/permission";

defineOptions({
  name: "DesktopPetManagement"
});

console.log("桌宠管理 - 组件 setup 开始执行");
console.log("桌宠管理 - 组件挂载");

/**
 * 搜索表单状态
 */
const state = ref<FieldValues>({
  userId: "",
  nickname: "",
  levelMin: "",
  levelMax: "",
  createTime: [],
  updateTime: []
});

/**
 * 搜索参数
 */
const searchParams = ref<DesktopPetQuery>({
  userId: undefined,
  nickname: "",
  level: undefined,
  createTime: undefined,
  updateTime: undefined
});

/**
 * 搜索列
 */
const SearchColumns: PlusColumn[] = [
  {
    label: "用户ID",
    prop: "userId",
    valueType: "copy",
    fieldProps: {
      placeholder: "请输入用户ID"
    }
  },
  {
    label: "桌宠昵称",
    prop: "nickname",
    valueType: "copy",
    fieldProps: {
      placeholder: "桌宠昵称"
    }
  },
  {
    label: "等级范围",
    prop: "levelMin",
    valueType: "copy",
    fieldProps: {
      placeholder: "最小等级"
    }
  },
  {
    label: "至",
    prop: "levelMax",
    valueType: "copy",
    fieldProps: {
      placeholder: "最大等级"
    }
  },
  {
    label: "发布时间",
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
    userId: values.userId || "",
    nickname: values.nickname || "",
    level:
      values.levelMin || values.levelMax
        ? {
            start: values.levelMin || 0,
            end: values.levelMax || 999
          }
        : undefined,
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
  fetchDesktopPetList();
};

/**
 * 搜索表单重置时触发
 */
const handleRest = () => {
  console.log("handleRest");

  state.value = {
    userId: "",
    nickname: "",
    levelMin: "",
    levelMax: "",
    createTime: [],
    updateTime: []
  };

  searchParams.value = {
    userId: undefined,
    nickname: "",
    level: undefined,
    createTime: undefined,
    updateTime: undefined
  };

  pagination.currentPage = 1;
  fetchDesktopPetList();
};

/**
 * 导出 Excel
 */
const handleExport = async () => {
  try {
    const exportParams = {
      userId: searchParams.value.userId,
      nickname: searchParams.value.nickname,
      level: searchParams.value.level,
      createTime: searchParams.value.createTime,
      updateTime: searchParams.value.updateTime
    };
    const blob = await exportDesktopPet(exportParams);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `桌宠数据_${new Date().getTime()}.xlsx`;
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
  fetchDesktopPetList,
  tableRef,
  multipleSelection,
  handleSelectionChange
} = useColumns(searchParams);

onActivated(() => {
  console.log("桌宠管理 - onActivated 触发");
  const cachePageList = usePermissionStoreHook().cachePageList;
  console.log("桌宠管理 - cachePageList:", cachePageList);
  console.log(
    "桌宠管理 - is in cache:",
    cachePageList.includes("DesktopPetManagement")
  );
  fetchDesktopPetList();
});

onDeactivated(() => {
  console.log("桌宠管理 - onDeactivated 触发");
});
</script>

<template>
  <!-- 桌宠管理搜索栏 -->
  <div class="desktoppet-container">
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
</template>

<style scoped>
.desktoppet-container {
  margin: 10px;
}
</style>

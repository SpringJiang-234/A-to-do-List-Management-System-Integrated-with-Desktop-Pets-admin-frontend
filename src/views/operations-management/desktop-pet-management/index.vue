<script setup lang="ts">
import { useColumns } from "./components/columns";
import { ref, onActivated, onDeactivated, watch } from "vue";
import { ElMessage } from "element-plus";
import "plus-pro-components/es/components/form/style/css";
import {
  type PlusColumn,
  type FieldValues,
  PlusSearch
} from "plus-pro-components";
import { TABLE_HEIGHT } from "@/config";
import { TableActions } from "@/components/admin-frontend-components/TableActions";
import Details from "./components/Details.vue";
import UserDetails from "../user-management/components/Details.vue";
import {
  exportDesktopPet,
  getDesktopPetDetails,
  type DesktopPetQuery
} from "@/api/desktop-pet";
import { getUserDetails } from "@/api/user";
import { usePermissionStoreHook } from "@/store/modules/permission";
import { useRoute } from "vue-router";

defineOptions({
  name: "DesktopPetManagement"
});

const route = useRoute();

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
 * 详情对话框状态
 */
const detailDialogVisible = ref(false);
const detailData = ref<{
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
}>({});

/**
 * 查看桌宠详情
 */
const handleDetail = async (row: any) => {
  try {
    const result = await getDesktopPetDetails(row.id);
    if (result.code === 200) {
      const data = result.data;
      detailData.value = {
        id: data.id,
        userId: data.userId,
        nickname: data.nickname,
        energy: data.energy,
        mood: data.mood,
        intimacy: data.intimacy,
        exp: data.exp,
        level: data.level,
        createTime: data.createTime,
        updateTime: data.updateTime
      };
      detailDialogVisible.value = true;
    } else {
      ElMessage.error(result.msg || "获取详情失败");
    }
  } catch (error) {
    ElMessage.error("获取详情失败");
  }
};

/**
 * 用户详情对话框状态
 */
const userDetailDialogVisible = ref(false);
const userDetailData = ref<{
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
}>({});

/**
 * 查看用户详情
 */
const handleUserDetail = async (userId: number) => {
  try {
    const result = await getUserDetails(userId);
    if (result.code === 200) {
      const data = result.data;
      userDetailData.value = {
        id: data.id,
        account: data.account,
        passwordHash: data.passwordHash,
        nickname: data.nickname,
        avatar: data.avatar,
        gender: data.gender,
        birth: data.birth,
        status: data.status,
        type: data.type,
        createTime: data.createTime,
        updateTime: data.updateTime
      };
      userDetailDialogVisible.value = true;
    } else {
      ElMessage.error(result.msg || "获取用户详情失败");
    }
  } catch (error) {
    ElMessage.error("获取用户详情失败");
  }
};

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
} = useColumns(searchParams, handleDetail, handleUserDetail);

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

// 监听路由变化，确保页面切换时刷新数据
watch(
  () => route.path,
  () => {
    console.log("桌宠管理 - 路由变化，触发数据刷新");
    fetchDesktopPetList();
  }
);
</script>

<template>
  <div>
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

      <!-- 桌宠详情对话框 -->
      <el-dialog
        v-model="detailDialogVisible"
        title="桌宠详情"
        width="600px"
        :close-on-click-modal="false"
      >
        <Details
          :id="detailData.id"
          :user-id="detailData.userId"
          :nickname="detailData.nickname"
          :energy="detailData.energy"
          :mood="detailData.mood"
          :intimacy="detailData.intimacy"
          :exp="detailData.exp"
          :level="detailData.level"
          :create-time="detailData.createTime"
          :update-time="detailData.updateTime"
        />
      </el-dialog>

      <!-- 用户详情对话框 -->
      <el-dialog
        v-model="userDetailDialogVisible"
        title="用户详情"
        width="600px"
        :close-on-click-modal="false"
      >
        <UserDetails
          :id="userDetailData.id"
          :account="userDetailData.account"
          :password-hash="userDetailData.passwordHash"
          :nickname="userDetailData.nickname"
          :avatar="userDetailData.avatar"
          :gender="userDetailData.gender"
          :birth="userDetailData.birth"
          :status="userDetailData.status"
          :type="userDetailData.type"
          :create-time="userDetailData.createTime"
          :update-time="userDetailData.updateTime"
        />
      </el-dialog>
    </div>
  </div>
</template>

<style scoped>
.desktoppet-container {
  margin: 10px;
}

.desktoppet-container :deep(.plus-search__unfold) {
  margin-left: 20px !important;
}
</style>

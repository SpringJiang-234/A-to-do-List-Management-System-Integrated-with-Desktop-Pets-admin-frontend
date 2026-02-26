<script setup lang="ts">
import { useColumns } from "./columns";
import { ref, onActivated, onDeactivated, watch, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import "plus-pro-components/es/components/form/style/css";
import "plus-pro-components/es/components/dialog-form/style/css";
import {
  type PlusColumn,
  type FieldValues,
  PlusSearch,
  PlusDialogForm
} from "plus-pro-components";
import { TABLE_HEIGHT } from "@/config";
import { TableActions } from "@/components/admin-frontend-components/TableActions";
import {
  insertUser,
  batchDeleteUser,
  exportUser,
  importUser,
  downloadTemplate,
  type UserDTO,
  type UserQuery
} from "@/api/user";
import { useRoute } from "vue-router";

defineOptions({
  name: "UserManagement"
});

const route = useRoute();

console.log("用户管理 - 组件 setup 开始执行");

/**
 * 搜索表单状态
 */
const state = ref<FieldValues>({
  account: "",
  nickname: "",
  gender: "",
  birth: [],
  status: "",
  type: "",
  createTime: [],
  updateTime: []
});

/**
 * 搜索参数
 */
const searchParams = ref<UserQuery>({
  account: "",
  nickname: "",
  gender: undefined,
  birth: undefined,
  status: undefined,
  type: undefined,
  pageNum: 1,
  pageSize: 15
});

/**
 * 新增用户对话框状态
 */
const dialogVisible = ref(false);
const formData = ref<FieldValues>({});

/**
 * 编辑用户对话框状态
 */
const editDialogVisible = ref(false);
const editFormData = ref<FieldValues>({});
const editId = ref<number | null>(null);

/**
 * 对话框表单列配置
 */
const dialogColumns: PlusColumn[] = [
  {
    label: "邮箱",
    prop: "account",
    valueType: "copy",
    fieldProps: {
      placeholder: "请输入邮箱"
    }
  },
  {
    label: "密码",
    prop: "passwordHash",
    valueType: "copy",
    fieldProps: {
      type: "password",
      placeholder: "请输入密码"
    }
  },
  {
    label: "昵称",
    prop: "nickname",
    valueType: "copy",
    fieldProps: {
      placeholder: "请输入昵称"
    }
  },
  {
    label: "头像",
    prop: "avatar",
    valueType: "copy",
    fieldProps: {
      placeholder: "请输入头像URL"
    }
  },
  {
    label: "性别",
    prop: "gender",
    valueType: "select",
    fieldProps: {
      placeholder: "请选择性别"
    },
    options: [
      {
        label: "男",
        value: "1"
      },
      {
        label: "女",
        value: "2"
      },
      {
        label: "未知",
        value: "3"
      }
    ]
  },
  {
    label: "生日",
    prop: "birth",
    valueType: "date-picker",
    fieldProps: {
      type: "date",
      placeholder: "请选择生日"
    }
  },
  {
    label: "状态",
    prop: "status",
    valueType: "select",
    fieldProps: {
      placeholder: "请选择状态"
    },
    options: [
      {
        label: "正常",
        value: "1"
      },
      {
        label: "已注销",
        value: "2"
      }
    ]
  },
  {
    label: "类型",
    prop: "type",
    valueType: "select",
    fieldProps: {
      placeholder: "请选择类型"
    },
    options: [
      {
        label: "管理员",
        value: "1"
      },
      {
        label: "普通用户",
        value: "2"
      }
    ]
  }
];

/**
 * 搜索列
 */
const SearchColumns: PlusColumn[] = [
  {
    label: "邮箱",
    prop: "account",
    valueType: "copy",
    fieldProps: {
      placeholder: "请输入邮箱"
    }
  },
  {
    label: "昵称",
    prop: "nickname",
    valueType: "copy",
    fieldProps: {
      placeholder: "请输入昵称"
    }
  },
  {
    label: "性别",
    prop: "gender",
    valueType: "select",
    fieldProps: {
      placeholder: "请选择性别"
    },
    options: [
      {
        label: "男",
        value: "1",
        color: "blue"
      },
      {
        label: "女",
        value: "2",
        color: "pink"
      },
      {
        label: "未知",
        value: "3",
        color: "gray"
      }
    ]
  },
  {
    label: "生日",
    prop: "birth",
    valueType: "date-picker",
    fieldProps: {
      type: "daterange",
      startPlaceholder: "请选择",
      endPlaceholder: "请选择"
    }
  },
  {
    label: "状态",
    prop: "status",
    valueType: "select",
    fieldProps: {
      placeholder: "请选择状态"
    },
    options: [
      {
        label: "正常",
        value: "1",
        color: "green"
      },
      {
        label: "已注销",
        value: "2",
        color: "red"
      }
    ]
  },
  {
    label: "类型",
    prop: "type",
    valueType: "select",
    fieldProps: {
      placeholder: "请选择类型"
    },
    options: [
      {
        label: "管理员",
        value: "1",
        color: "yellow"
      },
      {
        label: "普通用户",
        value: "2",
        color: "blue"
      }
    ]
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
    account: values.account || "",
    nickname: values.nickname || "",
    gender: values.gender ? Number(values.gender) : undefined,
    birth:
      values.birth?.[0] && values.birth?.[1]
        ? {
            start: values.birth[0],
            end: values.birth[1]
          }
        : undefined,
    status: values.status ? Number(values.status) : undefined,
    type: values.type ? Number(values.type) : undefined,
    pageNum: 1,
    pageSize: 15
  };

  pagination.currentPage = 1;
  fetchUserList();
};

/**
 * 搜索表单重置时触发
 */
const handleRest = () => {
  console.log("handleRest");

  state.value = {
    account: "",
    nickname: "",
    gender: "",
    birth: [],
    status: "",
    type: "",
    createTime: [],
    updateTime: []
  };

  searchParams.value = {
    account: "",
    nickname: "",
    gender: undefined,
    birth: undefined,
    status: undefined,
    type: undefined,
    pageNum: 1,
    pageSize: 15
  };

  pagination.currentPage = 1;
  fetchUserList();
};

/**
 * 新增用户
 */
const handleAdd = () => {
  formData.value = {
    account: "",
    passwordHash: "",
    nickname: "",
    avatar: "",
    gender: "3",
    birth: undefined,
    status: "1",
    type: "2"
  };
  dialogVisible.value = true;
};

/**
 * 提交新增用户
 */
const handleSubmit = async () => {
  try {
    const formValue = formData.value;
    const userData: UserDTO = {
      account: formValue.account as string,
      passwordHash: formValue.passwordHash as string,
      nickname: formValue.nickname as string,
      avatar: formValue.avatar as string,
      gender: formValue.gender ? Number(formValue.gender) : 3,
      birth: formValue.birth as string,
      status: formValue.status ? Number(formValue.status) : 1,
      type: formValue.type ? Number(formValue.type) : 2
    };
    const result = await insertUser(userData);
    if (result.code === 200) {
      ElMessage.success(result.msg || "添加成功");
      dialogVisible.value = false;
      fetchUserList();
    } else {
      ElMessage.error(result.msg || "添加失败");
    }
  } catch (error) {
    ElMessage.error("添加失败");
  }
};

/**
 * 编辑用户
 */
const handleEdit = (row: any) => {
  // 这里需要根据路由配置来实现编辑功能
  // 暂时使用alert提示
  alert("编辑用户功能需要配置路由");
};

/**
 * 批量删除用户
 */
const handleBatchDelete = async () => {
  if (!multipleSelection.value || multipleSelection.value.length === 0) {
    ElMessage.warning("请先选择要删除的数据");
    return;
  }

  const count = multipleSelection.value.length;
  const ids = multipleSelection.value.map(row => row.id).join(",");

  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${count} 个用户吗？`,
      "批量删除确认",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }
    );

    const result = await batchDeleteUser(ids);
    if (result.code === 200) {
      ElMessage.success("批量删除成功");
      fetchUserList();
    } else {
      ElMessage.error(result.msg || "批量删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("批量删除失败");
    }
  }
};

/**
 * 导出 Excel
 */
const handleExport = async () => {
  try {
    const exportParams = {
      account: searchParams.value.account,
      nickname: searchParams.value.nickname,
      gender: searchParams.value.gender,
      birth: searchParams.value.birth,
      status: searchParams.value.status,
      type: searchParams.value.type,
      pageNum: 1,
      pageSize: 1000
    };
    const blob = await exportUser(exportParams);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `用户数据_${new Date().getTime()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    ElMessage.success("导出成功");
  } catch (error) {
    ElMessage.error("导出失败");
  }
};

/**
 * 导入 Excel
 */
const handleImport = () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".xlsx,.xls";
  input.onchange = async (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      try {
        const result = await importUser(file);
        if (result.code === 200) {
          ElMessage.success(result.msg || "导入成功");
          fetchUserList();
        } else {
          ElMessage.error(result.msg || "导入失败");
        }
      } catch (error) {
        ElMessage.error("导入失败");
      }
    }
  };
  input.click();
};

/**
 * 下载模板
 */
const handleDownloadTemplate = async () => {
  try {
    const blob = await downloadTemplate();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "用户导入模板.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    ElMessage.success("模板下载成功");
  } catch (error) {
    ElMessage.error("模板下载失败");
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
  fetchUserList,
  tableRef,
  multipleSelection,
  handleSelectionChange
} = useColumns(searchParams, handleEdit);

onActivated(() => {
  console.log("用户管理 - onActivated 触发");
  fetchUserList();
});

onDeactivated(() => {
  console.log("用户管理 - onDeactivated 触发");
});

// 监听路由变化，确保页面切换时刷新数据
watch(
  () => route.path,
  () => {
    console.log("用户管理 - 路由变化，触发数据刷新");
    fetchUserList();
  }
);

// 组件初始化时获取数据
onMounted(() => {
  console.log("用户管理 - 组件初始化，触发数据刷新");
  fetchUserList();
});
</script>

<template>
  <!-- 用户管理搜索栏 -->
  <div class="user-container">
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
    <TableActions
      :on-add="handleAdd"
      :on-import="handleImport"
      :on-export="handleExport"
      :on-batch-delete="handleBatchDelete"
      :on-download-template="handleDownloadTemplate"
    />

    <!-- 表格 -->
    <div class="table-wrapper">
      <pure-table
        ref="tableRef"
        border
        row-key="id"
        alignWhole="center"
        showOverflowTooltip
        :loading="loading"
        :loading-config="loadingConfig"
        :height="TABLE_HEIGHT"
        :data="dataList"
        :columns="columns"
        :pagination="pagination"
        :header-cell-style="{
          backgroundColor: '#e8e8e8',
          color: '#303133',
          fontWeight: '600'
        }"
        @page-size-change="onSizeChange"
        @page-current-change="onCurrentChange"
        @selection-change="handleSelectionChange"
      />
    </div>

    <!-- 新增用户对话框 -->
    <PlusDialogForm
      v-model:visible="dialogVisible"
      v-model="formData"
      :dialog="{ title: '新增用户' }"
      :form="{ columns: dialogColumns }"
      @confirm="handleSubmit"
    />
  </div>
</template>

<style scoped>
.user-container {
  margin: 10px;
}
</style>

<script setup lang="ts">
import { useColumns } from "./components/columns";
import {
  ref,
  onActivated,
  onDeactivated,
  watch,
  onMounted,
  computed
} from "vue";
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
  insertFeedback,
  updateFeedback,
  exportFeedback,
  importFeedback,
  batchDeleteFeedback,
  downloadTemplate,
  getFeedbackDetails,
  type FeedbackDTO,
  type FeedbackQuery
} from "@/api/feedback";
import { useRoute } from "vue-router";

defineOptions({
  name: "FeedbackManagement"
});

const route = useRoute();

console.log("反馈管理 - 组件 setup 开始执行");

/**
 * 搜索表单状态
 */
const state = ref<FieldValues>({
  userId: "",
  title: "",
  content: "",
  status: "",
  replyContent: "",
  createTime: [],
  updateTime: []
});

/**
 * 搜索参数
 */
const searchParams = ref<FeedbackQuery>({
  userId: undefined,
  title: "",
  content: "",
  status: undefined,
  replyContent: "",
  createTime: undefined,
  updateTime: undefined
});

/**
 * 新增反馈对话框状态
 */
const dialogVisible = ref(false);
const formData = ref<FieldValues>({});

/**
 * 编辑反馈对话框状态
 */
const editDialogVisible = ref(false);
const editFormData = ref<FieldValues>({});
const editId = ref<number | null>(null);

/**
 * 详情反馈对话框状态
 */
const detailDialogVisible = ref(false);
const detailFormData = ref({
  userId: "",
  title: "",
  content: "",
  status: 1,
  replyContent: ""
});

const statusText = computed(() => {
  const statusMap = {
    1: "未受理",
    2: "已受理",
    3: "已解决"
  };
  return statusMap[detailFormData.value.status] || "";
});

/**
 * 对话框表单列配置
 */
const dialogColumns: PlusColumn[] = [
  {
    label: "用户ID",
    prop: "userId",
    valueType: "copy",
    fieldProps: {
      placeholder: "请输入用户ID"
    }
  },
  {
    label: "反馈标题",
    prop: "title",
    valueType: "copy",
    fieldProps: {
      placeholder: "请输入标题"
    }
  },
  {
    label: "反馈内容",
    prop: "content",
    valueType: "textarea",
    fieldProps: {
      placeholder: "请输入内容",
      rows: 4
    }
  },
  {
    label: "处理状态",
    prop: "status",
    valueType: "select",
    fieldProps: {
      placeholder: "请选择处理状态"
    },
    options: [
      {
        label: "未受理",
        value: 1
      },
      {
        label: "已受理",
        value: 2
      },
      {
        label: "已解决",
        value: 3
      }
    ]
  },
  {
    label: "回复内容",
    prop: "replyContent",
    valueType: "textarea",
    fieldProps: {
      placeholder: "请输入回复内容",
      rows: 4
    }
  }
];

/**
 * 搜索列
 */
const SearchColumns: PlusColumn[] = [
  {
    label: "处理状态",
    prop: "status",
    valueType: "select",
    fieldProps: {
      placeholder: "请选择处理状态"
    },
    options: [
      {
        label: "未受理",
        value: 1,
        color: "blue"
      },
      {
        label: "已受理",
        value: 2,
        color: "yellow"
      },
      {
        label: "已解决",
        value: 3,
        color: "green"
      }
    ]
  },
  {
    label: "创建时间",
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
  },
  {
    label: "用户ID",
    prop: "userId",
    valueType: "copy",
    fieldProps: {
      placeholder: "请输入用户ID"
    }
  },
  {
    label: "反馈标题",
    prop: "title",
    valueType: "copy",
    fieldProps: {
      placeholder: "请输入标题"
    }
  },
  {
    label: "反馈内容",
    prop: "content",
    valueType: "copy",
    fieldProps: {
      placeholder: "请输入内容"
    }
  },
  {
    label: "回复内容",
    prop: "replyContent",
    valueType: "copy",
    fieldProps: {
      placeholder: "请输入回复内容"
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
    userId: values.userId ? Number(values.userId) : undefined,
    title: values.title || "",
    content: values.content || "",
    status: values.status ? Number(values.status) : undefined,
    replyContent: values.replyContent || "",
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
  fetchFeedbackList();
};

/**
 * 搜索表单重置时触发
 */
const handleRest = () => {
  console.log("handleRest");

  state.value = {
    userId: "",
    title: "",
    content: "",
    status: "",
    replyContent: "",
    createTime: [],
    updateTime: []
  };

  searchParams.value = {
    userId: undefined,
    title: "",
    content: "",
    status: undefined,
    replyContent: "",
    createTime: undefined,
    updateTime: undefined
  };

  pagination.currentPage = 1;
  fetchFeedbackList();
};

/**
 * 新增反馈
 */
const handleAdd = () => {
  formData.value = {
    userId: "",
    title: "",
    content: "",
    status: 1,
    replyContent: ""
  };
  dialogVisible.value = true;
};

/**
 * 提交新增反馈
 */
const handleSubmit = async () => {
  try {
    const result = await insertFeedback(formData.value as FeedbackDTO);
    if (result.code === 200) {
      ElMessage.success(result.msg || "新增成功");
      dialogVisible.value = false;
      fetchFeedbackList();
    } else {
      ElMessage.error(result.msg || "新增失败");
    }
  } catch (error) {
    ElMessage.error("新增失败");
  }
};

/**
 * 编辑反馈
 */
const handleEdit = async (row: any) => {
  try {
    const result = await getFeedbackDetails(row.id);
    if (result.code === 200) {
      const data = result.data;
      editId.value = data.id;
      editFormData.value = {
        userId: data.userId,
        title: data.title,
        content: data.content,
        status: data.status === "未受理" ? 1 : data.status === "已受理" ? 2 : 3,
        replyContent: data.replyContent || ""
      };
      editDialogVisible.value = true;
    } else {
      ElMessage.error(result.msg || "获取详情失败");
    }
  } catch (error) {
    ElMessage.error("获取详情失败");
  }
};

/**
 * 详情反馈
 */
const handleDetail = async (row: any) => {
  try {
    const result = await getFeedbackDetails(row.id);
    if (result.code === 200) {
      const data = result.data;
      detailFormData.value = {
        userId: String(data.userId || ""),
        title: data.title || "",
        content: data.content || "",
        status: data.status === "未受理" ? 1 : data.status === "已受理" ? 2 : 3,
        replyContent: data.replyContent || ""
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
 * 提交编辑反馈
 */
const handleEditSubmit = async () => {
  try {
    const data = {
      ...editFormData.value,
      id: editId.value
    } as FeedbackDTO;
    const result = await updateFeedback(data);
    if (result.code === 200) {
      ElMessage.success(result.msg || "编辑成功");
      editDialogVisible.value = false;
      fetchFeedbackList();
    } else {
      ElMessage.error(result.msg || "编辑失败");
    }
  } catch (error) {
    ElMessage.error("编辑失败");
  }
};

/**
 * 批量删除反馈
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
      `确定要删除选中的 ${count} 条反馈吗？`,
      "批量删除确认",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }
    );

    const result = await batchDeleteFeedback(ids);
    if (result.code === 200) {
      ElMessage.success("批量删除成功");
      fetchFeedbackList();
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
      userId: searchParams.value.userId,
      title: searchParams.value.title,
      content: searchParams.value.content,
      status: searchParams.value.status,
      replyContent: searchParams.value.replyContent,
      createTime: searchParams.value.createTime,
      updateTime: searchParams.value.updateTime
    };
    const blob = await exportFeedback(exportParams);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `反馈数据_${new Date().getTime()}.xlsx`;
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
        const result = await importFeedback(file);
        if (result.code === 200) {
          ElMessage.success(result.msg || "导入成功");
          fetchFeedbackList();
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
    link.download = "反馈导入模板.xlsx";
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
  fetchFeedbackList,
  tableRef,
  multipleSelection,
  handleSelectionChange
} = useColumns(searchParams, handleEdit, handleDetail);

onActivated(() => {
  console.log("反馈管理 - onActivated 触发");
  fetchFeedbackList();
});

onDeactivated(() => {
  console.log("反馈管理 - onDeactivated 触发");
});

// 监听路由变化，确保页面切换时刷新数据
watch(
  () => route.path,
  () => {
    console.log("反馈管理 - 路由变化，触发数据刷新");
    fetchFeedbackList();
  }
);

// 组件挂载时初始化数据
onMounted(() => {
  console.log("反馈管理 - onMounted 触发");
  fetchFeedbackList();
});
</script>

<template>
  <div>
    <!-- 反馈管理搜索栏 -->
    <div class="feedback-container">
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

      <!-- 新增反馈对话框 -->
      <PlusDialogForm
        v-model:visible="dialogVisible"
        v-model="formData"
        :dialog="{ title: '新增反馈' }"
        :form="{ columns: dialogColumns }"
        @confirm="handleSubmit"
      />

      <!-- 编辑反馈对话框 -->
      <PlusDialogForm
        v-model:visible="editDialogVisible"
        v-model="editFormData"
        :dialog="{ title: '编辑反馈' }"
        :form="{ columns: dialogColumns }"
        @confirm="handleEditSubmit"
      />

      <!-- 详情反馈对话框 -->
      <el-dialog
        v-model="detailDialogVisible"
        title="反馈详情"
        width="600px"
        :close-on-click-modal="false"
      >
        <el-form :model="detailFormData" label-width="100px">
          <el-form-item label="用户ID">
            <el-input v-model="detailFormData.userId" disabled />
          </el-form-item>
          <el-form-item label="反馈标题">
            <el-input v-model="detailFormData.title" disabled />
          </el-form-item>
          <el-form-item label="反馈内容">
            <el-input
              v-model="detailFormData.content"
              type="textarea"
              :rows="4"
              disabled
            />
          </el-form-item>
          <el-form-item label="处理状态">
            <el-input v-model="statusText" disabled />
          </el-form-item>
          <el-form-item label="回复内容">
            <el-input
              v-model="detailFormData.replyContent"
              type="textarea"
              :rows="4"
              disabled
            />
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<style scoped>
.feedback-container {
  margin: 10px;
}
</style>

<script setup lang="ts">
import { useColumns } from "./columns";
import { ref } from "vue";
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
import { insertAnnouncement, type AnnouncementDTO } from "@/api/announcement";
import { ElMessage } from "element-plus";

/**
 * 搜索表单状态
 */
const state = ref<FieldValues>({
  title: "",
  content: "",
  isTop: "",
  createTime: [],
  updateTime: []
});

/**
 * 新增公告对话框状态
 */
const dialogVisible = ref(false);
const formData = ref<FieldValues>({});

/**
 * 对话框表单列配置
 */
const dialogColumns: PlusColumn[] = [
  {
    label: "标题",
    prop: "title",
    valueType: "copy",
    fieldProps: {
      placeholder: "请输入标题"
    }
  },
  {
    label: "内容",
    prop: "content",
    valueType: "textarea",
    fieldProps: {
      placeholder: "请输入内容",
      rows: 4
    }
  },
  {
    label: "是否置顶",
    prop: "isTop",
    valueType: "radio",
    options: [
      {
        label: "未置顶",
        value: "1"
      },
      {
        label: "已置顶",
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
    label: "标题",
    prop: "title",
    valueType: "copy",
    fieldProps: {
      placeholder: "请输入标题"
    }
  },
  {
    label: "内容",
    prop: "content",
    valueType: "copy",
    fieldProps: {
      placeholder: "请输入内容"
    }
  },
  {
    label: "是否置顶",
    prop: "isTop",
    valueType: "select",
    fieldProps: {
      placeholder: "请选择是否置顶"
    },
    options: [
      {
        label: "未置顶",
        value: "1",
        color: "blue"
      },
      {
        label: "已置顶",
        value: "2",
        color: "red"
      }
    ]
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
};

/**
 * 搜索表单重置时触发
 */
const handleRest = () => {
  console.log("handleRest");
};

/**
 * 新增公告
 */
const handleAdd = () => {
  formData.value = {
    title: "",
    content: "",
    isTop: "1"
  };
  dialogVisible.value = true;
};

/**
 * 提交新增公告
 */
const handleSubmit = async () => {
  try {
    const result = await insertAnnouncement(formData.value as AnnouncementDTO);
    if (result.code === 200) {
      ElMessage.success(result.msg || "新增成功");
      dialogVisible.value = false;
    } else {
      ElMessage.error(result.msg || "新增失败");
    }
  } catch (error) {
    ElMessage.error("新增失败");
  }
};

/**
 * 批量删除公告
 */
const handleBatchDelete = () => {
  console.log("批量删除");
};

/**
 * 导出 Excel
 */
const handleExport = () => {
  console.log("导出 Excel");
};

/**
 * 导入 Excel
 */
const handleImport = () => {
  console.log("导入 Excel");
};

const {
  loading,
  columns,
  dataList,
  pagination,
  loadingConfig,
  onSizeChange,
  onCurrentChange
} = useColumns();
</script>

<template>
  <!-- 公告管理搜索栏 -->
  <div class="announcement-container">
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
    />

    <!-- 表格 -->
    <div>
      <pure-table
        border
        row-key="id"
        alignWhole="center"
        showOverflowTooltip
        :loading="loading"
        :loading-config="loadingConfig"
        :height="TABLE_HEIGHT"
        :data="
          dataList.slice(
            (pagination.currentPage - 1) * pagination.pageSize,
            pagination.currentPage * pagination.pageSize
          )
        "
        :columns="columns"
        :pagination="pagination"
        @page-size-change="onSizeChange"
        @page-current-change="onCurrentChange"
      />
    </div>

    <!-- 新增公告对话框 -->
    <PlusDialogForm
      v-model:visible="dialogVisible"
      v-model="formData"
      :dialog="{ title: '新增公告' }"
      :form="{ columns: dialogColumns }"
      @confirm="handleSubmit"
    />
  </div>
</template>

<style scoped>
.announcement-container {
  margin: 10px;
}
</style>

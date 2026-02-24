<script setup lang="ts">
import { useColumns } from "./columns";
import { ref } from "vue";
import "plus-pro-components/es/components/form/style/css";
import {
  type PlusColumn,
  type FieldValues,
  PlusSearch
} from "plus-pro-components";
import { TABLE_HEIGHT } from "@/config";
import { ElButton } from "element-plus";

const state = ref<FieldValues>({
  title: "",
  content: "",
  isTop: "",
  createTime: [],
  updateTime: []
});

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

const handleChange = (values: any) => {
  console.log(values, "change");
};
const handleSearch = (values: any) => {
  console.log(values, "search");
};
const handleRest = () => {
  console.log("handleRest");
};

const handleAdd = () => {
  console.log("添加公告");
};

const handleBatchDelete = () => {
  console.log("批量删除");
};

const handleExport = () => {
  console.log("导出 Excel");
};

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

    <div class="action-buttons">
      <el-button type="primary" @click="handleAdd">新增</el-button>
      <el-button type="primary" @click="handleImport">导入 Excel</el-button>
      <el-button type="primary" @click="handleExport">导出 Excel</el-button>
      <el-button type="danger" @click="handleBatchDelete">批量删除</el-button>
    </div>

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
  </div>
</template>

<style scoped>
.announcement-container {
  margin: 10px;
}

.action-buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-start;
  margin: 10px 0;
}
</style>

import { tableData } from "./data";
import { clone, delay } from "@pureadmin/utils";
import { ref, onMounted, reactive } from "vue";
import type { PaginationProps, LoadingConfig } from "@pureadmin/table";
import { message } from "@/utils/message";

export function useColumns() {
  const dataList = ref([]);
  const loading = ref(true);
  const select = ref("no");
  const columns: TableColumnList = [
    {
      type: "selection",
      align: "left",
      reserveSelection: true,
      hide: () => (select.value === "no" ? true : false)
    },
    {
      label: "标题",
      prop: "title"
    },
    {
      label: "内容",
      prop: "content"
    },
    {
      label: "是否置顶",
      prop: "isTop"
    },
    {
      label: "发布时间",
      prop: "createTime"
    },
    {
      label: "更新时间",
      prop: "updateTime"
    },
    {
      label: "操作",
      cellRenderer: ({ index, row }) => (
        <>
          <el-button size="small" onClick={() => handleEdit(index + 1, row)}>
            编辑
          </el-button>
          <el-button
            size="small"
            type="danger"
            onClick={() => handleDelete(index + 1, row)}
          >
            删除
          </el-button>
        </>
      )
    }
  ];

  /** 分页配置 */
  const pagination = reactive<PaginationProps>({
    pageSize: 10,
    currentPage: 1,
    pageSizes: [10, 15, 20],
    total: 0,
    align: "right",
    background: true,
    size: "default"
  });

  /** 加载动画配置 */
  const loadingConfig = reactive<LoadingConfig>({
    text: "正在加载第一页...",
    viewBox: "-10, -10, 50, 50",
    spinner: `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `
    // svg: "",
    // background: rgba()
  });

  function onChange(val) {
    pagination.size = val;
  }

  function onSizeChange(val) {
    console.log("onSizeChange", val);
  }

  function onCurrentChange(val) {
    loadingConfig.text = `正在加载第${val}页...`;
    loading.value = true;
    delay(600).then(() => {
      loading.value = false;
    });
  }

  onMounted(() => {
    delay(600).then(() => {
      const newList = [];
      Array.from({ length: 6 }).forEach(() => {
        newList.push(clone(tableData, true));
      });
      newList.flat(Infinity).forEach((item, index) => {
        dataList.value.push({ id: index, ...item });
      });
      pagination.total = dataList.value.length;
      loading.value = false;
    });
  });

  const handleEdit = (index: number, row) => {
    message(`您修改了第 ${index} 行，数据为：${JSON.stringify(row)}`, {
      type: "success"
    });
  };

  const handleDelete = (index: number, row) => {
    message(`您删除了第 ${index} 行，数据为：${JSON.stringify(row)}`);
  };

  return {
    loading,
    columns,
    dataList,
    select,
    pagination,
    loadingConfig,
    onChange,
    onSizeChange,
    onCurrentChange
  };
}

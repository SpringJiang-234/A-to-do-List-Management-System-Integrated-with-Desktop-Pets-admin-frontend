import { ref, onMounted, reactive, type Ref } from "vue";
import type { PaginationProps, LoadingConfig } from "@pureadmin/table";
import { message } from "@/utils/message";
import {
  getAnnouncementPage,
  type AnnouncementQuery,
  type AnnouncementVO
} from "@/api/announcement";
import dayjs from "dayjs";

/** 表格列配置 */
export function useColumns(searchParams?: Ref<AnnouncementQuery>) {
  const dataList = ref<AnnouncementVO[]>([]);
  const loading = ref(true);
  const columns: TableColumnList = [
    {
      type: "selection",
      align: "left",
      reserveSelection: true
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
      prop: "isTop",
      cellRenderer: ({ row }) => {
        return row.isTop === "2" ? "是" : row.isTop === "1" ? "否" : "";
      }
    },
    {
      label: "发布时间",
      prop: "createTime",
      cellRenderer: ({ row }) => {
        return row.createTime
          ? dayjs(row.createTime).format("YYYY-MM-DD HH:mm:ss")
          : "";
      }
    },
    {
      label: "更新时间",
      prop: "updateTime",
      cellRenderer: ({ row }) => {
        return row.updateTime
          ? dayjs(row.updateTime).format("YYYY-MM-DD HH:mm:ss")
          : "";
      }
    },
    {
      label: "操作",
      cellRenderer: ({ index, row }) => (
        <>
          <el-button
            size="small"
            type="info"
            onClick={() => handleDetail(index + 1, row)}
          >
            详情
          </el-button>
          <el-button
            size="small"
            type="warning"
            onClick={() => handleEdit(index + 1, row)}
          >
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
    pageSize: 15,
    currentPage: 1,
    pageSizes: [10, 15, 20],
    total: 0,
    align: "right",
    background: true,
    size: "default",
    hideOnSinglePage: false
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

  /** 分页当前页改变时触发 */
  function onSizeChange(val) {
    pagination.pageSize = val;
    fetchAnnouncementList();
  }

  function onCurrentChange(val) {
    pagination.currentPage = val;
    fetchAnnouncementList();
  }

  /** 获取公告列表数据 */
  async function fetchAnnouncementList() {
    loading.value = true;
    try {
      const params: AnnouncementQuery = {
        pageNum: pagination.currentPage,
        pageSize: pagination.pageSize,
        ...searchParams?.value
      };
      const result = await getAnnouncementPage(params);
      if (result.code === 200) {
        dataList.value = result.data.records;
        pagination.total = result.data.total;
      } else {
        message(result.msg || "获取数据失败", { type: "error" });
      }
    } catch {
      message("获取数据失败", { type: "error" });
    } finally {
      loading.value = false;
    }
  }

  onMounted(() => {
    fetchAnnouncementList();
  });

  const handleDetail = (index: number, row) => {
    message(`您查看了第 ${index} 行的详情，数据为：${JSON.stringify(row)}`, {
      type: "info"
    });
  };

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
    pagination,
    loadingConfig,
    onSizeChange,
    onCurrentChange,
    fetchAnnouncementList
  };
}

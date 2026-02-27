import { ref, reactive, type Ref } from "vue";
import type { PaginationProps, LoadingConfig } from "@pureadmin/table";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import {
  getAnnouncementPage,
  deleteAnnouncement,
  type AnnouncementQuery,
  type AnnouncementVO
} from "@/api/announcement";
import dayjs from "dayjs";

const tableRef = ref();
const multipleSelection = ref<AnnouncementVO[]>([]);

export function useColumns(
  searchParams?: Ref<AnnouncementQuery>,
  onEdit?: (row: AnnouncementVO) => void
  // _onDetail?: (row: AnnouncementVO) => void
) {
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
      prop: "isTop"
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
    console.log("公告管理 - fetchAnnouncementList 开始执行");
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
        console.log("公告管理 - 数据加载成功，共", result.data.total, "条记录");
      } else {
        message(result.msg || "获取数据失败", { type: "error" });
      }
    } catch {
      message("获取数据失败", { type: "error" });
    } finally {
      loading.value = false;
    }
  }

  const handleEdit = (index: number, row: AnnouncementVO) => {
    if (onEdit) {
      onEdit(row);
    }
  };

  const handleDelete = async (index: number, row: AnnouncementVO) => {
    try {
      await ElMessageBox.confirm(
        `确定要删除公告"${row.title}"吗？`,
        "删除确认",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      );

      const result = await deleteAnnouncement(row.id);
      if (result.code === 200) {
        message("删除成功", { type: "success" });
        fetchAnnouncementList();
      } else {
        message(result.msg || "删除失败", { type: "error" });
      }
    } catch (error) {
      if (error !== "cancel") {
        message("删除失败", { type: "error" });
      }
    }
  };

  const handleSelectionChange = (val: AnnouncementVO[]) => {
    multipleSelection.value = val;
  };

  return {
    loading,
    columns,
    dataList,
    pagination,
    loadingConfig,
    onSizeChange,
    onCurrentChange,
    fetchAnnouncementList,
    tableRef,
    multipleSelection,
    handleSelectionChange
  };
}

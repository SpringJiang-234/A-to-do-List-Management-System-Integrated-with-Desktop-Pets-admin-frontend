import { ref, onMounted, reactive, type Ref } from "vue";
import { useDetail } from "./useDetail";
import type { PaginationProps, LoadingConfig } from "@pureadmin/table";
import { message } from "@/utils/message";
import {
  getDesktopPetPage,
  type DesktopPetQuery,
  type DesktopPetVO
} from "@/api/desktop-pet";
import dayjs from "dayjs";

const tableRef = ref();
const multipleSelection = ref<DesktopPetVO[]>([]);

export function useColumns(
  searchParams?: Ref<DesktopPetQuery>,
  onDetail?: (row: DesktopPetVO) => void
) {
  const dataList = ref<DesktopPetVO[]>([]);
  const { toDetail } = useDetail();
  const loading = ref(true);
  const columns: TableColumnList = [
    {
      type: "selection",
      align: "left",
      reserveSelection: true
    },
    {
      label: "用户ID",
      prop: "userId"
    },
    {
      label: "桌宠昵称",
      prop: "nickname"
    },
    {
      label: "成长等级",
      prop: "level"
    },
    {
      label: "诞生日",
      prop: "createTime",
      cellRenderer: ({ row }) => {
        return row.createTime
          ? dayjs(row.createTime).format("YYYY-MM-DD HH:mm:ss")
          : "";
      }
    },
    {
      label: "最近活跃",
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
          <el-button size="small" onClick={() => handleDetail(index + 1, row)}>
            详情
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
    fetchDesktopPetList();
  }

  function onCurrentChange(val) {
    pagination.currentPage = val;
    fetchDesktopPetList();
  }

  /** 获取桌宠列表数据 */
  async function fetchDesktopPetList() {
    loading.value = true;
    try {
      const params: DesktopPetQuery = {
        pageNum: pagination.currentPage,
        pageSize: pagination.pageSize,
        ...searchParams?.value
      };
      const result = await getDesktopPetPage(params);
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
    fetchDesktopPetList();
  });

  const handleDetail = (index: number, row: DesktopPetVO) => {
    if (onDetail) {
      onDetail(row);
    } else {
      const id = row.id.toString();
      const nickname = row.nickname || "桌宠详情";
      toDetail({ id }, nickname);
    }
  };

  // const handleEdit = (index: number, row: DesktopPetVO) => {
  //   if (onEdit) {
  //     onEdit(row);
  //   }
  // };

  // const handleDelete = async (index: number, row: DesktopPetVO) => {
  //   try {
  //     await ElMessageBox.confirm(
  //       `确定要删除桌宠"${row.nickname}"吗？`,
  //       "删除确认",
  //       {
  //         confirmButtonText: "确定",
  //         cancelButtonText: "取消",
  //         type: "warning"
  //       }
  //     );

  //     const result = await deleteDesktopPet(row.id);
  //     if (result.code === 200) {
  //       message("删除成功", { type: "success" });
  //       fetchDesktopPetList();
  //     } else {
  //       message(result.msg || "删除失败", { type: "error" });
  //     }
  //   } catch (error) {
  //     if (error !== "cancel") {
  //       message("删除失败", { type: "error" });
  //     }
  //   }
  // };

  const handleSelectionChange = (val: DesktopPetVO[]) => {
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
    fetchDesktopPetList,
    tableRef,
    multipleSelection,
    handleSelectionChange
  };
}

import { ref, reactive, type Ref } from "vue";
import type { PaginationProps, LoadingConfig } from "@pureadmin/table";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import {
  getUserPage,
  deleteUser,
  type UserQuery,
  type UserVO
} from "@/api/user";

const tableRef = ref();
const multipleSelection = ref<UserVO[]>([]);

export function useColumns(
  searchParams?: Ref<UserQuery>,
  onEdit?: (row: UserVO) => void,
  onDetail?: (row: UserVO) => void
) {
  const dataList = ref<UserVO[]>([]);
  const loading = ref(true);
  const columns: TableColumnList = [
    {
      type: "selection",
      align: "left",
      reserveSelection: true
    },
    {
      label: "邮箱",
      prop: "account"
    },
    {
      label: "昵称",
      prop: "nickname"
    },
    {
      label: "头像",
      prop: "avatar",
      cellRenderer: ({ row }) => {
        return row.avatar ? (
          <img
            src={row.avatar}
            style={{ width: "40px", height: "40px", borderRadius: "50%" }}
          />
        ) : (
          "无"
        );
      }
    },
    {
      label: "性别",
      prop: "gender",
      cellRenderer: ({ row }) => {
        const genderMap = {
          "1": "男",
          "2": "女",
          "3": "未知"
        };
        return genderMap[row.gender] || row.gender;
      }
    },
    {
      label: "生日",
      prop: "birth"
    },
    {
      label: "状态",
      prop: "status",
      cellRenderer: ({ row }) => {
        const statusMap = {
          "1": "正常",
          "2": "已注销"
        };
        return statusMap[row.status] || row.status;
      }
    },
    {
      label: "类型",
      prop: "type",
      cellRenderer: ({ row }) => {
        const typeMap = {
          "1": "管理员",
          "2": "普通用户"
        };
        return typeMap[row.type] || row.type;
      }
    },
    {
      label: "操作",
      width: 200,
      cellRenderer: ({ index, row }) => (
        <>
          <el-button
            size="small"
            type="primary"
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
  });

  /** 分页当前页改变时触发 */
  function onSizeChange(val) {
    pagination.pageSize = val;
    fetchUserList();
  }

  function onCurrentChange(val) {
    pagination.currentPage = val;
    fetchUserList();
  }

  /** 获取用户列表数据 */
  async function fetchUserList() {
    loading.value = true;
    try {
      const params: UserQuery = {
        pageNum: pagination.currentPage,
        pageSize: pagination.pageSize,
        ...searchParams?.value
      };
      const result = await getUserPage(params);
      if (result.code === 200) {
        dataList.value = result.data.records;
        pagination.total = result.data.total;
      } else {
        message(result.msg || "获取数据失败", { type: "error" });
      }
    } catch (error) {
      console.error("获取用户列表失败:", error);
      message("获取数据失败", { type: "error" });
    } finally {
      loading.value = false;
    }
  }

  const handleDetail = (index: number, row: UserVO) => {
    if (onDetail) {
      onDetail(row);
    }
  };

  const handleEdit = (index: number, row: UserVO) => {
    if (onEdit) {
      onEdit(row);
    }
  };

  const handleDelete = async (index: number, row: UserVO) => {
    try {
      await ElMessageBox.confirm(
        `确定要删除用户"${row.account}"吗？`,
        "删除确认",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      );

      const result = await deleteUser(row.id);
      if (result.code === 200) {
        message("删除成功", { type: "success" });
        fetchUserList();
      } else {
        message(result.msg || "删除失败", { type: "error" });
      }
    } catch (error) {
      if (error !== "cancel") {
        message("删除失败", { type: "error" });
      }
    }
  };

  const handleSelectionChange = (val: UserVO[]) => {
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
    fetchUserList,
    tableRef,
    multipleSelection,
    handleSelectionChange
  };
}

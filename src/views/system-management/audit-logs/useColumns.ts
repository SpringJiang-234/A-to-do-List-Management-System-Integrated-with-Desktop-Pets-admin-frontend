import { ref, reactive, type Ref } from "vue";
import type { PaginationProps, LoadingConfig } from "@pureadmin/table";
import { message } from "@/utils/message";
import {
  getAuditLogPage,
  type AuditLogQuery,
  type AuditLogVO
} from "@/api/audit-logs";
import dayjs from "dayjs";

const tableRef = ref();
const multipleSelection = ref<AuditLogVO[]>([]);

export function useColumns(searchParams?: Ref<AuditLogQuery>) {
  const dataList = ref<AuditLogVO[]>([]);
  const loading = ref(true);
  const columns = [
    {
      type: "selection",
      align: "left",
      reserveSelection: true
    },
    {
      label: "操作人ID",
      prop: "userId"
    },
    {
      label: "操作人",
      prop: "username"
    },
    {
      label: "操作内容",
      prop: "operation",
      minWidth: 200
    },
    {
      label: "操作模块",
      prop: "module"
    },
    {
      label: "IP地址",
      prop: "ipAddress"
    },
    {
      label: "操作时间",
      prop: "createTime",
      cellRenderer: ({ row }) => {
        return row.createTime
          ? dayjs(row.createTime).format("YYYY-MM-DD HH:mm:ss")
          : "";
      }
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
    fetchAuditLogList();
  }

  function onCurrentChange(val) {
    pagination.currentPage = val;
    fetchAuditLogList();
  }

  /** 获取审计日志列表数据 */
  async function fetchAuditLogList() {
    loading.value = true;
    try {
      const params: AuditLogQuery = {
        pageNum: pagination.currentPage,
        pageSize: pagination.pageSize,
        ...searchParams?.value
      };
      const result = await getAuditLogPage(params);
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

  const handleSelectionChange = (val: AuditLogVO[]) => {
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
    fetchAuditLogList,
    tableRef,
    multipleSelection,
    handleSelectionChange
  };
}

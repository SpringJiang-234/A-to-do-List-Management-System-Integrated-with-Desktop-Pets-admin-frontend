<script setup lang="ts">
import { useColumns } from "./components/columns";
import { ref, onActivated, onDeactivated, watch, onMounted } from "vue";
import { ElMessage, ElMessageBox, ElUpload, ElIcon } from "element-plus";
import "element-plus/dist/index.css";
import "plus-pro-components/es/components/form/style/css";
import "plus-pro-components/es/components/dialog-form/style/css";
import {
  type PlusColumn,
  type FieldValues,
  PlusSearch,
  PlusDialogForm
} from "plus-pro-components";

// 定义用户表单数据类型
interface UserFormData {
  account: string;
  passwordHash: string;
  nickname: string;
  avatar: string;
  gender: string;
  birth: string | undefined;
  status: string;
  type: string;
}
import { Plus } from "@element-plus/icons-vue";
import { TABLE_HEIGHT } from "@/config";
import { TableActions } from "@/components/admin-frontend-components/TableActions";
import Details from "./components/Details.vue";
import {
  insertUser,
  updateUser,
  exportUser,
  importUser,
  downloadTemplate,
  getUserDetails,
  batchCancelUser,
  uploadAvatar,
  type UserDTO,
  type UserQuery
} from "@/api/user";
import { useRoute } from "vue-router";
import { getToken as getAuthToken } from "@/utils/auth";

// 获取token的函数
const getToken = (): string => {
  const tokenData = getAuthToken();
  return tokenData?.accessToken || "";
};

defineOptions({
  name: "UserManagement"
});

const route = useRoute();

console.log("用户管理 - 组件 setup 开始执行");

/**
 * 头像上传成功处理
 */
const handleAvatarSuccess = async (response: any, uploadFile: any) => {
  console.log("头像上传成功回调:", response);

  // 如果响应为空或已经处理过，则不处理
  if (!response || response === undefined) {
    console.log("忽略空响应或重复调用");
    return;
  }

  if (response.code === 200) {
    // 根据当前打开的对话框，更新对应表单的avatar字段
    if (dialogVisible.value) {
      formData.value.avatar = response.data;
    } else if (editDialogVisible.value) {
      editFormData.value.avatar = response.data;
    }
    ElMessage.success("头像上传成功");
  } else {
    ElMessage.error(response.msg || "头像上传失败");
  }
};

/**
 * 头像上传前验证
 */
const beforeAvatarUpload = (file: File) => {
  const isJPG = file.type === "image/jpeg" || file.type === "image/png";
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isJPG) {
    ElMessage.error("只能上传JPG/PNG图片!");
  }
  if (!isLt2M) {
    ElMessage.error("图片大小不能超过2MB!");
  }
  return isJPG && isLt2M;
};

/**
 * 头像上传失败处理
 */
const handleAvatarError = () => {
  ElMessage.error("头像上传失败，请重试");
};

/**
 * 自定义头像上传处理
 */
const handleAvatarUpload = async (options: any) => {
  try {
    console.log("=== 开始上传头像 ===");
    console.log("完整上传选项:", JSON.stringify(options, null, 2));

    // 检查 options.file 的结构
    const file = options.file;
    console.log("文件对象:", file);
    console.log("文件对象类型:", typeof file);
    console.log("文件对象属性:", Object.keys(file));

    // 尝试获取原始 File 对象
    const actualFile = file.raw || file;
    console.log("实际文件:", actualFile);
    console.log("实际文件类型:", typeof actualFile);
    console.log("是否为File对象:", actualFile instanceof File);

    if (actualFile instanceof File) {
      console.log("File对象信息:");
      console.log("  名称:", actualFile.name);
      console.log("  大小:", actualFile.size);
      console.log("  类型:", actualFile.type);
    } else {
      console.warn("不是File对象:", actualFile);
    }

    // 测试 FormData 构建
    const testFormData = new FormData();
    testFormData.append("file", actualFile);
    console.log("FormData 已创建");

    // 调用上传函数
    console.log("准备调用 uploadAvatar 函数");
    const response = await uploadAvatar(actualFile);
    console.log("上传响应:", response);

    // 检查响应是否存在
    if (!response) {
      ElMessage.error("服务器未返回响应");
      return;
    }

    // 处理响应
    if (response.code === 200) {
      // 根据当前打开的对话框，更新对应表单的avatar字段
      if (dialogVisible.value) {
        formData.value.avatar = response.data;
      } else if (editDialogVisible.value) {
        editFormData.value.avatar = response.data;
      }
      ElMessage.success("头像上传成功");
    } else {
      ElMessage.error(response.msg || "头像上传失败");
    }
  } catch (error) {
    console.error("上传错误:", error);
    console.error("错误详情:", error instanceof Error ? error.message : error);
    console.error("错误堆栈:", error instanceof Error ? error.stack : null);
    ElMessage.error("头像上传失败，请重试");
  } finally {
    console.log("=== 上传流程结束 ===");
  }
};

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
const formData = ref<UserFormData>({
  account: "",
  passwordHash: "",
  nickname: "",
  avatar: "",
  gender: "3",
  birth: undefined,
  status: "1",
  type: "2"
});

/**
 * 编辑用户对话框状态
 */
const editDialogVisible = ref(false);
const editFormData = ref<UserFormData>({
  account: "",
  passwordHash: "",
  nickname: "",
  avatar: "",
  gender: "3",
  birth: undefined,
  status: "1",
  type: "2"
});
const editId = ref<number | null>(null);

/**
 * 详情对话框状态
 */
const detailDialogVisible = ref(false);
const detailData = ref<{
  id?: number;
  account?: string;
  passwordHash?: string;
  nickname?: string;
  avatar?: string;
  gender?: string;
  birth?: string;
  status?: string;
  type?: string;
  createTime?: string;
  updateTime?: string;
}>({});

/**
 * 对话框表单配置已移除，使用原生el-form代替
 */

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
  // 重置表单数据
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
 * 查看用户详情
 */
const handleDetail = async (row: any) => {
  try {
    const result = await getUserDetails(row.id);
    if (result.code === 200) {
      const data = result.data;
      detailData.value = {
        id: data.id,
        account: data.account,
        passwordHash: data.passwordHash,
        nickname: data.nickname,
        avatar: data.avatar,
        gender: data.gender,
        birth: data.birth,
        status: data.status,
        type: data.type,
        createTime: data.createTime,
        updateTime: data.updateTime
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
 * 编辑用户
 */
const handleEdit = async (row: any) => {
  try {
    const result = await getUserDetails(row.id);
    if (result.code === 200) {
      const data = result.data;
      editId.value = data.id;
      // 映射字符串值到数字
      const genderMap: Record<string, string> = { 男: "1", 女: "2", 未知: "3" };
      const statusMap: Record<string, string> = { 正常: "1", 已注销: "2" };
      const typeMap: Record<string, string> = { 管理员: "1", 普通用户: "2" };

      editFormData.value = {
        account: data.account,
        passwordHash: data.passwordHash,
        nickname: data.nickname,
        avatar: data.avatar,
        gender: genderMap[data.gender || "未知"] || "3",
        birth: data.birth,
        status: statusMap[data.status || "正常"] || "1",
        type: typeMap[data.type || "普通用户"] || "2"
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
 * 提交编辑用户
 */
const handleEditSubmit = async () => {
  try {
    const formValue = editFormData.value;
    const userData: UserDTO = {
      id: editId.value,
      account: formValue.account as string,
      passwordHash: formValue.passwordHash as string,
      nickname: formValue.nickname as string,
      avatar: formValue.avatar as string,
      gender: formValue.gender ? Number(formValue.gender) : 3,
      birth: formValue.birth as string,
      status: formValue.status ? Number(formValue.status) : 1,
      type: formValue.type ? Number(formValue.type) : 2
    };
    const result = await updateUser(userData);
    if (result.code === 200) {
      ElMessage.success(result.msg || "修改成功");
      editDialogVisible.value = false;
      fetchUserList();
    } else {
      ElMessage.error(result.msg || "修改失败");
    }
  } catch (error) {
    ElMessage.error("修改失败");
  }
};

/**
 * 批量注销用户
 */
const handleBatchDelete = async () => {
  if (!multipleSelection.value || multipleSelection.value.length === 0) {
    ElMessage.warning("请先选择要注销的数据");
    return;
  }

  const count = multipleSelection.value.length;
  const ids = multipleSelection.value.map(row => row.id).join(",");

  try {
    await ElMessageBox.confirm(
      `确定要注销选中的 ${count} 个用户吗？`,
      "批量注销确认",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }
    );

    const result = await batchCancelUser(ids);
    if (result.code === 200) {
      ElMessage.success(result.msg || "批量注销成功");
      fetchUserList();
    } else {
      ElMessage.error(result.msg || "批量注销失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("批量注销失败");
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
} = useColumns(searchParams, handleEdit, handleDetail);

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
  <div>
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
        batch-delete-text="批量注销"
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
      <el-dialog
        v-model="dialogVisible"
        title="新增用户"
        width="600px"
        :close-on-click-modal="false"
      >
        <el-form :model="formData" label-width="80px">
          <el-form-item label="邮箱" prop="account">
            <el-input v-model="formData.account" placeholder="请输入邮箱" />
          </el-form-item>
          <el-form-item label="密码" prop="passwordHash">
            <el-input
              v-model="formData.passwordHash"
              type="password"
              placeholder="请输入密码"
            />
          </el-form-item>
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model="formData.nickname" placeholder="请输入昵称" />
          </el-form-item>
          <el-form-item label="头像">
            <div class="avatar-upload-container">
              <el-upload
                class="avatar-uploader"
                :http-request="handleAvatarUpload"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
              >
                <img
                  v-if="formData.avatar"
                  :src="formData.avatar"
                  class="avatar"
                />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              </el-upload>
              <div class="avatar-tip">支持 JPG、PNG 格式，大小不超过 2MB</div>
            </div>
          </el-form-item>
          <el-form-item label="性别">
            <el-select v-model="formData.gender" placeholder="请选择性别">
              <el-option label="男" value="1" />
              <el-option label="女" value="2" />
              <el-option label="未知" value="3" />
            </el-select>
          </el-form-item>
          <el-form-item label="生日">
            <el-date-picker
              v-model="formData.birth"
              type="date"
              placeholder="请选择生日"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="formData.status" placeholder="请选择状态">
              <el-option label="正常" value="1" />
              <el-option label="已注销" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="类型">
            <el-select v-model="formData.type" placeholder="请选择类型">
              <el-option label="管理员" value="1" />
              <el-option label="普通用户" value="2" />
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handleSubmit">确定</el-button>
          </span>
        </template>
      </el-dialog>

      <!-- 编辑用户对话框 -->
      <el-dialog
        v-model="editDialogVisible"
        title="编辑用户"
        width="600px"
        :close-on-click-modal="false"
      >
        <el-form :model="editFormData" label-width="80px">
          <el-form-item label="邮箱" prop="account">
            <el-input v-model="editFormData.account" placeholder="请输入邮箱" />
          </el-form-item>
          <el-form-item label="密码" prop="passwordHash">
            <el-input
              v-model="editFormData.passwordHash"
              type="password"
              placeholder="请输入密码"
            />
          </el-form-item>
          <el-form-item label="昵称" prop="nickname">
            <el-input
              v-model="editFormData.nickname"
              placeholder="请输入昵称"
            />
          </el-form-item>
          <el-form-item label="头像">
            <div class="avatar-upload-container">
              <el-upload
                class="avatar-uploader"
                :http-request="handleAvatarUpload"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                :on-error="handleAvatarError"
              >
                <img
                  v-if="editFormData.avatar"
                  :src="editFormData.avatar"
                  class="avatar"
                />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              </el-upload>
              <div class="avatar-tip">支持 JPG、PNG 格式，大小不超过 2MB</div>
            </div>
          </el-form-item>
          <el-form-item label="性别">
            <el-select v-model="editFormData.gender" placeholder="请选择性别">
              <el-option label="男" value="1" />
              <el-option label="女" value="2" />
              <el-option label="未知" value="3" />
            </el-select>
          </el-form-item>
          <el-form-item label="生日">
            <el-date-picker
              v-model="editFormData.birth"
              type="date"
              placeholder="请选择生日"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="editFormData.status" placeholder="请选择状态">
              <el-option label="正常" value="1" />
              <el-option label="已注销" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="类型">
            <el-select v-model="editFormData.type" placeholder="请选择类型">
              <el-option label="管理员" value="1" />
              <el-option label="普通用户" value="2" />
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="editDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handleEditSubmit">确定</el-button>
          </span>
        </template>
      </el-dialog>

      <!-- 用户详情对话框 -->
      <el-dialog
        v-model="detailDialogVisible"
        title="用户详情"
        width="600px"
        :close-on-click-modal="false"
      >
        <Details
          :id="detailData.id"
          :account="detailData.account"
          :password-hash="detailData.passwordHash"
          :nickname="detailData.nickname"
          :avatar="detailData.avatar"
          :gender="detailData.gender"
          :birth="detailData.birth"
          :status="detailData.status"
          :type="detailData.type"
          :create-time="detailData.createTime"
          :update-time="detailData.updateTime"
        />
      </el-dialog>
    </div>
  </div>
</template>

<style scoped>
.user-container {
  margin: 10px;
}

.user-container :deep(.plus-search__unfold) {
  margin-left: 20px !important;
}

.avatar-upload-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.avatar-uploader .avatar {
  display: block;
  width: 178px;
  height: 178px;
  object-fit: cover;
  border-radius: 50%;
}

.avatar-uploader .el-upload {
  position: relative;
  margin-bottom: 10px;
  overflow: hidden;
  cursor: pointer;
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  width: 178px;
  height: 178px;
  font-size: 28px;
  line-height: 178px;
  color: #8c939d;
  text-align: center;
}

.avatar-tip {
  font-size: 12px;
  color: #909399;
}
</style>

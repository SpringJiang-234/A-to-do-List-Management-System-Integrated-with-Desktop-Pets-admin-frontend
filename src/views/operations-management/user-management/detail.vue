<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { getUserDetails, updateUser, insertUser } from "@/api/user";
import { UserDTO, UserDetails } from "@/api/user";
import { ElMessage, type FormItemRule } from "element-plus";

const props = defineProps<{
  id?: number;
}>();

const emit = defineEmits<{
  (e: "success"): void;
  (e: "close"): void;
}>();

const loading = ref(false);
const isEdit = ref(false);
const formRef = ref();

const formData = reactive<UserDTO>({
  id: undefined,
  account: undefined,
  passwordHash: undefined,
  nickname: undefined,
  avatar: undefined,
  gender: 3, // 默认为未知
  birth: undefined,
  status: 1, // 默认为正常
  type: 2 // 默认为普通用户
});

const rules = reactive<Record<string, FormItemRule[]>>({
  account: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { type: "email", message: "请输入正确的邮箱格式", trigger: "blur" }
  ],
  passwordHash: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 20, message: "密码长度在6-20之间", trigger: "blur" }
  ],
  nickname: [
    { required: true, message: "请输入昵称", trigger: "blur" },
    { min: 2, max: 20, message: "昵称长度在2-20之间", trigger: "blur" }
  ]
});

const loadData = async (id?: number) => {
  if (id) {
    isEdit.value = true;
    loading.value = true;
    try {
      const res = await getUserDetails(id);
      if (res.code === 200) {
        const details = res.data as UserDetails;
        Object.assign(formData, details);
      } else {
        ElMessage.error(res.msg);
      }
    } catch (error) {
      ElMessage.error("获取用户详情失败");
    } finally {
      loading.value = false;
    }
  } else {
    isEdit.value = false;
    Object.assign(formData, {
      id: undefined,
      account: undefined,
      passwordHash: undefined,
      nickname: undefined,
      avatar: undefined,
      gender: 3,
      birth: undefined,
      status: 1,
      type: 2
    });
  }
};

const submit = async () => {
  if (!formRef.value) return;

  const valid = await formRef.value.validate();
  if (!valid) return;

  loading.value = true;
  try {
    let res;
    if (isEdit.value) {
      res = await updateUser(formData);
    } else {
      res = await insertUser(formData);
    }

    if (res.code === 200) {
      ElMessage.success(isEdit.value ? "修改成功" : "添加成功");
      emit("success");
      emit("close");
    } else {
      ElMessage.error(res.msg);
    }
  } catch (error) {
    ElMessage.error(isEdit.value ? "修改失败" : "添加失败");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (props.id) {
    loadData(props.id);
  }
});
</script>

<template>
  <div class="user-detail">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-position="left"
      label-width="100px"
    >
      <el-form-item label="邮箱" prop="account">
        <el-input v-model="formData.account" placeholder="请输入邮箱" />
      </el-form-item>

      <el-form-item label="密码" prop="passwordHash">
        <el-input
          v-model="formData.passwordHash"
          type="password"
          placeholder="请输入密码"
          :disabled="isEdit"
        />
      </el-form-item>

      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="formData.nickname" placeholder="请输入昵称" />
      </el-form-item>

      <el-form-item label="头像">
        <el-input v-model="formData.avatar" placeholder="请输入头像URL" />
      </el-form-item>

      <el-form-item label="性别">
        <el-radio-group v-model="formData.gender">
          <el-radio :value="1">男</el-radio>
          <el-radio :value="2">女</el-radio>
          <el-radio :value="3">未知</el-radio>
        </el-radio-group>
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
        <el-radio-group v-model="formData.status">
          <el-radio :value="1">正常</el-radio>
          <el-radio :value="2">已注销</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="类型">
        <el-radio-group v-model="formData.type">
          <el-radio :value="1">管理员</el-radio>
          <el-radio :value="2">普通用户</el-radio>
        </el-radio-group>
      </el-form-item>

      <div class="flex justify-end mt-4">
        <el-button @click="emit('close')">取消</el-button>
        <el-button type="primary" :loading="loading" @click="submit">
          {{ isEdit ? "保存修改" : "添加" }}
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<style scoped>
.user-detail {
  padding: 20px;
}
</style>

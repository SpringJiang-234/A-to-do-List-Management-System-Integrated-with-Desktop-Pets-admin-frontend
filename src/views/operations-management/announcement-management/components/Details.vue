<script setup lang="ts">
import { ref, watch, computed } from "vue";
import Vditor from "./Vditor.vue";

defineOptions({
  name: "Markdown"
});

const props = defineProps<{
  title?: string;
  content?: string;
  mode?: "detail" | "edit";
}>();

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();

const title = ref(props.title || "");
const text = ref(props.content || "");

const isEdit = computed(() => props.mode === "edit");

watch(
  () => props.title,
  newVal => {
    title.value = newVal || "";
  }
);

watch(
  () => props.content,
  newVal => {
    text.value = newVal || "";
  }
);

defineExpose({
  title,
  text
});
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <!-- 公告标题 -->
        <el-input
          v-model="title"
          placeholder="请输入公告标题"
          :readonly="!isEdit"
        />
      </div>
    </template>
    <Vditor
      v-model="text"
      :options="{
        height: 560,
        outline: { enable: true, position: 'right' },
        readonly: !isEdit
      }"
    />
    <div v-if="isEdit" class="dialog-footer">
      <el-button @click="emit('cancel')">取消</el-button>
      <el-button type="primary" @click="emit('confirm')">确定</el-button>
    </div>
  </el-card>
</template>

<style scoped>
.dialog-footer {
  margin-top: 20px;
  text-align: right;
}
</style>

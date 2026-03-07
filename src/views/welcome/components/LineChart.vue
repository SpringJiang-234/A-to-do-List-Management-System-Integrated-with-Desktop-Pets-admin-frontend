<template>
  <BaseChart :options="chartOptions" :width="width" :height="height" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import BaseChart from "./BaseChart.vue";
import type { ECOption } from "@/utils/echarts"; // 导入配置类型

const props = defineProps<{
  xAxisData: string[]; // x 轴标签数组
  series: Array<{ name: string; data: number[] }>; // 多个系列
  title?: string;
  width?: string;
  height?: string;
}>();

const chartOptions = computed<ECOption>(() => ({
  title: props.title ? { text: props.title, left: "center" } : undefined,
  tooltip: { trigger: "axis" },
  xAxis: { type: "category", data: props.xAxisData },
  yAxis: { type: "value" },
  series: props.series.map(s => ({
    name: s.name,
    type: "line",
    data: s.data,
    smooth: true
  })),
  grid: { containLabel: true }
}));
</script>

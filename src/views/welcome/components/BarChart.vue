<template>
  <BaseChart :options="chartOptions" :width="width" :height="height" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import BaseChart from "./BaseChart.vue";
import type { ECOption } from "@/utils/echarts";

const props = defineProps<{
  data: Array<{ category: string; value: number }>;
  title?: string;
  width?: string;
  height?: string;
}>();

const chartOptions = computed<ECOption>(() => ({
  title: props.title ? { text: props.title, left: "center" } : undefined,
  tooltip: { trigger: "axis" },
  xAxis: {
    type: "category",
    data: props.data.map(item => item.category)
  },
  yAxis: { type: "value" },
  series: [
    {
      name: props.title || "柱状图",
      type: "bar",
      data: props.data.map(item => item.value),
      barWidth: "60%"
    }
  ],
  grid: { containLabel: true }
}));
</script>

<template>
  <BaseChart :options="chartOptions" :width="width" :height="height" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import BaseChart from "./BaseChart.vue";
import type { ECOption } from "@/utils/echarts";

// 输入数据格式：每个类别对应一组五数概括 [min, Q1, median, Q3, max]
const props = defineProps<{
  data: Array<{
    category: string;
    values: [number, number, number, number, number];
  }>;
  title?: string;
  width?: string;
  height?: string;
}>();

const chartOptions = computed<ECOption>(() => {
  if (!props.data || props.data.length === 0) {
    return {
      title: props.title ? { text: props.title, left: "center" } : undefined,
      graphic: {
        type: "text",
        left: "center",
        top: "center",
        style: {
          text: "暂无数据",
          fontSize: 16,
          fill: "#999"
        }
      }
    };
  }

  return {
    title: props.title ? { text: props.title, left: "center" } : undefined,
    tooltip: { trigger: "item" },
    xAxis: {
      type: "category",
      data: props.data.map(item => item.category)
    },
    yAxis: { type: "value" },
    series: [
      {
        name: props.title || "箱型图",
        type: "boxplot",
        data: props.data.map(item => item.values)
      }
    ],
    grid: { containLabel: true }
  };
});
</script>

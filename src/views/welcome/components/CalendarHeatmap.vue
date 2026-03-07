<template>
  <BaseChart :options="chartOptions" :width="width" :height="height" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import BaseChart from "./BaseChart.vue";
import type { ECOption } from "@/utils/echarts";

const props = defineProps<{
  data: Array<[string, number]>; // 格式：['2026-03-01', 8]
  range?: [string, string]; // 可选，日历范围，默认自动从数据中计算
  title?: string;
  width?: string;
  height?: string;
  backgroundColor?: string;
}>();

const chartOptions = computed<ECOption>(() => {
  const currentYear = new Date().getFullYear();
  const yearStart = `${currentYear}-01-01`;
  const yearEnd = `${currentYear}-12-31`;

  const dates = props.data.map(item => item[0]);
  const minDate = dates.length
    ? dates.reduce((a, b) => (a < b ? a : b))
    : yearStart;
  const maxDate = dates.length
    ? dates.reduce((a, b) => (a > b ? a : b))
    : yearEnd;

  return {
    title: props.title ? { text: props.title, left: "center" } : undefined,
    tooltip: {},
    visualMap: {
      min: 0,
      max: Math.max(...props.data.map(item => item[1]), 1),
      calculable: true,
      orient: "horizontal",
      left: "center",
      inRange: {
        color: ["#ffffff", "#c6e48b", "#7bc96f", "#239a3b", "#196127"]
      }
    },
    calendar: {
      range: props.range || [yearStart, yearEnd],
      cellSize: ["auto", 20]
    },
    series: [
      {
        name: props.title || "日历热力图",
        type: "heatmap",
        coordinateSystem: "calendar",
        data: props.data
      }
    ],
    backgroundColor: props.backgroundColor
  };
});
</script>

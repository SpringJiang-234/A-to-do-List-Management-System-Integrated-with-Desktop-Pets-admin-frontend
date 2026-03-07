<template>
  <BaseChart :options="chartOptions" :width="width" :height="height" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import BaseChart from "./BaseChart.vue";
import type { ECOption } from "@/utils/echarts";
import { getSeriesColor, ThemeType } from "./color";
import { useEpThemeStoreHook } from "@/store/modules/epTheme";

const props = defineProps<{
  xAxisData: string[];
  series: Array<{ name: string; data: number[] }>;
  title?: string;
  width?: string;
  height?: string;
}>();

const epThemeStore = useEpThemeStoreHook();
const currentTheme = computed<ThemeType>(() => {
  return epThemeStore.epTheme as ThemeType;
});

const chartOptions = computed<ECOption>(() => ({
  title: props.title ? { text: props.title, left: "center" } : undefined,
  tooltip: { trigger: "axis" },
  xAxis: { type: "category", data: props.xAxisData },
  yAxis: { type: "value" },
  series: props.series.map((s, seriesIndex) => ({
    name: s.name,
    type: "line",
    data: s.data,
    smooth: true,
    itemStyle: {
      color: getSeriesColor(currentTheme.value, seriesIndex)
    },
    lineStyle: {
      color: getSeriesColor(currentTheme.value, seriesIndex)
    }
  })),
  grid: { containLabel: true }
}));
</script>

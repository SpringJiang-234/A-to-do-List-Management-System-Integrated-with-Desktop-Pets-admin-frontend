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
  data: Array<{ category: string; value: number }>;
  title?: string;
  width?: string;
  height?: string;
}>();

const epThemeStore = useEpThemeStoreHook();
const currentTheme = computed<ThemeType>(() => {
  return epThemeStore.epTheme as ThemeType;
});

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
        data: props.data.map((item, index) => ({
          value: item.value,
          itemStyle: {
            color: getSeriesColor(currentTheme.value, index)
          }
        })),
        barWidth: "60%"
      }
    ],
    grid: { containLabel: true }
  };
});
</script>

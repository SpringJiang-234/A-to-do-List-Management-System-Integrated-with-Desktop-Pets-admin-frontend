<template>
  <BaseChart :options="chartOptions" :width="width" :height="height" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import BaseChart from "./BaseChart.vue";
import type { ECOption } from "@/utils/echarts";
import { getSeriesColors, ThemeType } from "./color";
import { useEpThemeStoreHook } from "@/store/modules/epTheme";

const props = defineProps<{
  data: Array<{ name: string; value: number }>;
  title?: string;
  shape?: string;
  width?: string;
  height?: string;
}>();

const epThemeStore = useEpThemeStoreHook();
const currentTheme = computed<ThemeType>(() => {
  return epThemeStore.epTheme as ThemeType;
});

const chartOptions = computed<ECOption>(() => ({
  title: props.title ? { text: props.title, left: "center" } : undefined,
  tooltip: { show: true },
  series: [
    {
      type: "wordCloud",
      data: props.data.map((item, index) => ({
        ...item,
        textStyle: {
          color: getSeriesColors(currentTheme.value)[
            index % getSeriesColors(currentTheme.value).length
          ]
        }
      })),
      shape: props.shape || "circle",
      sizeRange: [12, 60],
      rotationRange: [0, 0],
      emphasis: {
        textStyle: {
          fontWeight: "bold",
          color: "#000"
        }
      }
    }
  ]
}));
</script>

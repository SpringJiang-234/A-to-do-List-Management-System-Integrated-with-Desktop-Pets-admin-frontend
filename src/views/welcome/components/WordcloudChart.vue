<template>
  <BaseChart :options="chartOptions" :width="width" :height="height" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import BaseChart from "./BaseChart.vue";
import type { ECOption } from "@/utils/echarts";

const props = defineProps<{
  data: Array<{ name: string; value: number }>;
  title?: string;
  shape?: string; // 形状，可选 'circle', 'cardioid', 'diamond' 等
  width?: string;
  height?: string;
}>();

const chartOptions = computed<ECOption>(() => ({
  title: props.title ? { text: props.title, left: "center" } : undefined,
  tooltip: { show: true },
  series: [
    {
      type: "wordCloud",
      data: props.data,
      shape: props.shape || "circle",
      sizeRange: [12, 60], // 字体大小范围
      rotationRange: [0, 0], // 旋转范围，设为 [0,0] 不旋转
      textStyle: {
        color: () => {
          // 随机颜色
          return (
            "rgb(" +
            [
              Math.round(Math.random() * 160),
              Math.round(Math.random() * 160),
              Math.round(Math.random() * 160)
            ].join(",") +
            ")"
          );
        }
      },
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

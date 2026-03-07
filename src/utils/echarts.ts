// utils/echarts.ts
import * as echarts from "echarts/core";

// 导入图表类型（官方图表）
import {
  BarChart,
  LineChart,
  PieChart,
  BoxplotChart,
  HeatmapChart
} from "echarts/charts";
// 导入词云图——注意：这里只需要导入副作用，不需要 {}
import "echarts-wordcloud";

// 导入组件
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  CalendarComponent,
  VisualMapComponent,
  DatasetComponent,
  TransformComponent
} from "echarts/components";

// 导入特性与渲染器
import { LabelLayout, UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";

// 注册组件（注意：这里不需要注册 WordcloudChart，因为上面 import 时已自动注册）
echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  CalendarComponent,
  VisualMapComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  LineChart,
  PieChart,
  BoxplotChart,
  HeatmapChart,
  // 注意：WordcloudChart 不需要也不能放在这里
  LabelLayout,
  UniversalTransition,
  CanvasRenderer
]);

// 导出配置好的 echarts 实例
export default echarts;

// ---------- TypeScript 类型导出 ----------
import type { ComposeOption } from "echarts/core";
import type {
  BarSeriesOption,
  LineSeriesOption,
  PieSeriesOption,
  BoxplotSeriesOption,
  HeatmapSeriesOption
} from "echarts/charts";
import type {
  TitleComponentOption,
  TooltipComponentOption,
  LegendComponentOption,
  GridComponentOption,
  CalendarComponentOption,
  VisualMapComponentOption,
  DatasetComponentOption
} from "echarts/components";
// 词云的类型定义（从 echarts-wordcloud 的类型定义中提取）
interface WordCloudTextStyle {
  color?: string;
  fontStyle?: string;
  fontWeight?: string | number;
  fontFamily?: string;
  fontSize?: number | string;
  align?: string;
  verticalAlign?: string;
  opacity?: number;
  lineHeight?: number;
  backgroundColor?:
    | string
    | { image: HTMLImageElement | HTMLCanvasElement | string };
  borderColor?: string;
  borderWidth?: number;
  borderType?: string;
  borderDashOffset?: number;
  borderRadius?: number | number[];
  padding?: number | number[];
  width?: number | string;
  height?: number;
  textBorderColor?: string;
  textBorderWidth?: number;
  textBorderType?: string;
  textBorderDashOffset?: number;
  textShadowBlur?: number;
  textShadowColor?: string;
  textShadowOffsetX?: number;
  textShadowOffsetY?: number;
}

interface WorldCloudDataItem {
  name?: string;
  value?: number | number[];
  textStyle?: WordCloudTextStyle;
  emphasis?: {
    textStyle?: WordCloudTextStyle;
  };
}

interface WordcloudSeriesOption {
  mainType?: "series";
  type?: "wordCloud";
  silent?: boolean;
  blendMode?: string;
  cursor?: string;
  width?: number | string;
  height?: number | string;
  top?: number | string;
  right?: number | string;
  bottom?: number | string;
  left?: number | string;
  textStyle?: WordCloudTextStyle | { color?: (params?: any) => string };
  emphasis?: {
    focus?: "self" | "series" | "none";
    blurScope?: "coordinateSystem" | "global" | "series";
    textStyle?: WordCloudTextStyle;
  };
  shape?: string;
  maskImage?: HTMLImageElement | HTMLCanvasElement;
  sizeRange?: number[];
  rotationRange?: number[];
  rotationStep?: number;
  gridSize?: number;
  drawOutOfBound?: boolean;
  layoutAnimation?: boolean;
  data?: WorldCloudDataItem[];
}

// 组合所有可能的配置项类型
export type ECOption = ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
  | PieSeriesOption
  | BoxplotSeriesOption
  | HeatmapSeriesOption
  | WordcloudSeriesOption // 这里使用从插件导入的类型
  | TitleComponentOption
  | TooltipComponentOption
  | LegendComponentOption
  | GridComponentOption
  | CalendarComponentOption
  | VisualMapComponentOption
  | DatasetComponentOption
>;

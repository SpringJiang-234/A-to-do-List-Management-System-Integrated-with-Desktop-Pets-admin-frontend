<template>
  <div>
    <div class="about-container">
      <h1 class="about-title">关于我们</h1>
      <div class="about-card">
        <div class="about-section">
          <h2 class="section-title">系统介绍</h2>
          <p class="section-content">
            在快节奏的现代学习与工作生活中，时间管理已成为一项不可或缺的能力，而传统的待办事项管理软件往往反馈较为冰冷、缺乏情感互动，使用户在持续应对繁多任务的过程中容易感到疲惫。因此，如何在规划与执行计划时提供更多积极反馈与情感激励，从而使用户在高效管理时间的同时也能获得心灵上的慰藉与支持，成为一个值得深入探索的方向。
          </p>
          <p class="section-content">
            在此背景下，本课题设计并实现了一款融合桌宠的待办事项管理系统（简称：系统）。该系统可为用户提供一个功能完善的待办事项管理模块，丰富的任务属性设置与多时间尺度视图可帮助用户清晰规划、灵活调整日程；为用户提供一个可动态反映任务完成情况的桌宠管家，以生动形象陪伴用户工作学习，并通过个性化提醒与激励增强用户的执行动力与情感联结；为用户提供多样化的数据统计功能，实现对用户待办完成情况的定量分析与可视化呈现，生成直观的统计报告，辅助用户定期复盘、优化时间管理策略。
          </p>
          <p class="section-content">
            总体而言，本系统不只是一个高效的时间管理工具，更是一个融合理性与情感的陪伴式助手，它既帮助用户建立起有序的生活节奏，也在日常的交互中注入一份温暖的关怀，使人们在繁忙事务中感受到鼓舞与支持，从而实现更有温度、更可持续的自我管理。
          </p>
        </div>
        <div class="about-section">
          <h2 class="section-title">当前版本</h2>
          <p class="section-content">v1.0.0</p>
        </div>
        <div class="about-section">
          <h2 class="section-title">技术支持</h2>
          <p class="section-content">联系微信：jiangchunxiao5020</p>
        </div>
        <div class="about-section">
          <h2 class="section-title">开发基础</h2>
          <p class="section-content">
            本系统基于 Pure Admin 开发，感谢开源社区的贡献。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about-container {
  box-sizing: border-box;
  width: 95%;
  padding: 20px;
  margin: 0;
  font-family: Arial, sans-serif;
}

.about-title {
  margin-bottom: 30px;
  font-size: 24px;
  color: #333;
  text-align: center;
}

.about-card {
  box-sizing: border-box;
  width: 100%;
  padding: 30px;
  margin: 0 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgb(0 0 0 / 10%);
}

.about-section {
  padding-bottom: 20px;
  margin-bottom: 25px;
  border-bottom: 1px solid #eaeaea;
}

.about-section:last-child {
  padding-bottom: 0;
  margin-bottom: 0;
  border-bottom: none;
}

.section-title {
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: bold;
  color: #555;
}

.section-content {
  margin-bottom: 5px;
  line-height: 1.5;
  color: #333;
}

.about-section:nth-child(1) .section-content {
  text-indent: 2em;
}

.section-content ul {
  padding-left: 20px;
  margin: 0;
}

.section-content li {
  margin-bottom: 5px;
}

.section-desc {
  margin: 0;
  font-size: 12px;
  color: #999;
}
</style>

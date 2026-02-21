# texts.config.ts UI 文案

定义话题中所有 UI 界面显示的文本内容。

类型：`TextsConfig`（`src/core/types/base.ts`）

## 必填字段

```typescript
interface TextsConfig {
  gameTitle: string;           // 游戏标题（显示在标题栏和开始界面）
  gameSubtitle?: string;       // 副标题（可选）
  startButton: string;         // 开始按钮文字
  continueButton?: string;     // 继续游戏按钮（可选）
  restartButton: string;       // 重新开始按钮
  confirmButton: string;       // 通用确认按钮
  cancelButton: string;        // 通用取消按钮

  statsPanelTitle: string;     // 属性面板标题
  logPanelTitle: string;       // 日志面板标题

  ageLabel: string;            // 时间/年龄标签
  stageLabel: string;          // 阶段标签
  turnLabel: string;           // 回合标签

  events: { ... };             // 事件相关文案
  endings: { ... };            // 结局相关文案
  messages: { ... };           // 提示信息
  custom?: Record<string, string>;  // 话题特有文案
}
```

## events 字段

事件弹窗的标签文案：

```typescript
events: {
  opportunityLabel: '机遇',     // OPPORTUNITY 类事件的 badge
  challengeLabel: '挑战',       // CHALLENGE 类事件的 badge
  dailyLabel: '日常',           // DAILY 类事件的 badge
  specialLabel: '特殊',         // SPECIAL 类事件的 badge
  stageLabel: '阶段',           // STAGE 类事件的 badge
  choicePrefix: '你选择了',      // 选择后的日志前缀
  effectPrefix: '结果',          // 效果描述前缀
}
```

## endings 字段

结局界面的文案：

```typescript
endings: {
  gameOverTitle: '游戏结束',
  scoreLabel: '综合评分',
  summaryLabel: '人生总结',
}
```

## messages 字段

系统消息文案：

```typescript
messages: {
  loading: '加载中...',
  saving: '保存中...',
  error: '发生错误',
  confirmQuit: '确定要退出吗？未保存的进度将丢失。',
  newGame: '开始新游戏',
}
```

## custom 字段

话题特有的文案，不受标准接口约束：

```typescript
custom: {
  advisorTitle: '导师',
  semesterLabel: '学期',
  paperCount: '已发表论文',
  // 任意键值对
}
```

在组件中使用：

```typescript
const texts = useTexts();
const advisorTitle = texts.custom?.advisorTitle ?? '导师';
```

## 最小化示例

只需改关键几个字段即可完成话题差异化：

```typescript
export const textsConfig: TextsConfig = {
  gameTitle: '外卖骑手',        // 最显眼的位置
  startButton: '开始配送',      // 第一次点击的按钮
  restartButton: '重新出发',    // 游戏结束后的按钮
  turnLabel: '天',              // 区分时间单位
  // ... 其他字段保持默认值
};
```

## 参考实现

- `src/topics/life/texts.config.ts`
- `src/topics/research/texts.config.ts`（含大量 `custom` 字段示例）

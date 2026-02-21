# 引擎层

引擎层负责游戏机制的确定性逻辑，位于 `src/engine/`，包含三个模块。

## EndingEngine（src/engine/endingEngine.ts）

负责结局检查和评价。

### 核心方法

```typescript
// 检查硬结局（每次 Effect 应用后调用）
// 返回触发的结局定义，或 null（未触发）
checkHardEnding(player: Player): EndingDefinition | null

// 计算软结局分数并匹配结局（maxTurn 到达时调用）
evaluateSoftEnding(player: Player): EndingDefinition

// 综合评价玩家表现（返回 S/A/B/C/D/F 等级）
evaluatePlayer(player: Player): { grade: string; score: number }
```

### 评价逻辑

默认软结局评分：对各属性归一化（`value / bounds.max`），加权平均：

```typescript
// 各属性等权重求和（简化示意）
const score = Object.entries(definitions).reduce((sum, [key, def]) => {
  const value = player.attributes[key] ?? 0;
  const normalized = value / def.bounds.max;
  const weighted = def.isInverted ? (1 - normalized) : normalized;
  return sum + weighted;
}, 0) / definitions.length;
```

**自定义评价**：如果话题需要特殊的评价逻辑（如 research 话题考虑论文数量），需要在 `endingEngine.ts` 中按 `topicId` 添加分支逻辑，或通过 `TopicPackage` 扩展传入自定义评价函数。

---

## TurnEngine（src/engine/turnEngine.ts）

负责回合推进和 Tag 冷却管理。

### 核心方法

```typescript
// 推进一个回合（年龄+1，冷却-1）
advanceTurn(): void

// 获取当前不在冷却中的可用 Tag 列表
getAvailableTags(): string[]

// 触发事件后设置 Tag 冷却
setCooldown(tag: string, turns: number): void

// 检查某个 Tag 是否可用（不在冷却中）
isTagAvailable(tag: string): boolean

// 获取所有 Tag 的冷却状态（调试用）
getCooldownStatus(): Record<string, number>
```

### 冷却机制

```typescript
// 内部状态
const tagCooldowns = new Map<string, number>();

// 触发 CHALLENGE 事件后
setCooldown('CHALLENGE', 2);  // 设置 2 回合冷却

// 每回合结束时
tagCooldowns.forEach((remaining, tag) => {
  tagCooldowns.set(tag, Math.max(0, remaining - 1));
});
```

**冷却基于 Tag 分类**，不是事件的具体文字——这确保了 AI 每次生成不同文字的事件时，冷却机制仍然正常工作。

---

## EventSelector（src/engine/eventSelector.ts）

根据玩家当前状态智能选择本回合的事件类型（Tag）。

### 核心方法

```typescript
// 智能选择事件类型（考虑玩家状态和权重）
selectSmartEventType(player: Player, availableTags: string[]): string

// 从可用 Tag 中随机选择（无权重）
selectRandomAvailableTag(availableTags: string[]): string
```

### 动态权重算法

```typescript
// 根据玩家状态动态调整权重（简化示意）
function getTagWeights(player: Player): Record<string, number> {
  const base = {
    DAILY: 40,
    OPPORTUNITY: 15,
    CHALLENGE: 15,
    SPECIAL: 5,
  };

  const health = player.attributes.health ?? 100;
  const stress = player.attributes.stress ?? 0;

  // 健康低时：CHALLENGE 权重降低（已经够苦了）
  if (health < 30) base.CHALLENGE *= 0.5;

  // 压力高时：OPPORTUNITY 权重增加（给玩家一些希望）
  if (stress > 70) base.OPPORTUNITY *= 1.5;

  return base;
}
```

**设计意图**：让玩家感觉"世界在回应我的状态"。当角色处境困难时，避免雪上加霜；处境顺利时，给予更多挑战。

---

## 引擎定制

### 评价权重

修改 `endingEngine.ts` 中的属性权重配置，改变软结局的评分倾向（体现话题的价值取向）。

### 冷却配置

修改 `turnEngine.ts` 中的默认冷却回合数，调整事件节奏。

### 权重算法

修改 `eventSelector.ts` 中的 `getTagWeights()`，基于话题特有属性调整事件频率。

**注意**：引擎改动会影响**所有话题**的游戏机制，需谨慎评估影响范围。

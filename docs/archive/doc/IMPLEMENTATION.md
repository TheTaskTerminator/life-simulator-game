# 🛠️ 实现方案

本文档详细说明人生模拟器文字游戏的技术实现方案、开发计划和架构设计。

## 📋 项目概述

### 项目目标

创建一个基于 React + TypeScript 的人生模拟器文字游戏，通过 AI 生成丰富的事件内容，让玩家体验不同的人生轨迹。

### 核心功能

1. **人生阶段系统** - 从出生到老去的完整人生历程
2. **属性系统** - 多维度属性管理
3. **事件系统** - AI 驱动的随机事件生成
4. **选择系统** - 影响人生轨迹的关键选择
5. **职业系统** - 多种职业路径和发展
6. **教育系统** - 教育路径选择
7. **人际关系系统** - 恋爱、结婚、家庭
8. **生活系统** - 买房、买车、理财
9. **成就系统** - 完成各种人生目标

## 🏗️ 技术架构

### 技术栈选择

#### 前端框架

- **React 19.2.0** - 现代化 UI 框架
- **TypeScript 5.8.2** - 类型安全
- **Vite 6.2.0** - 快速构建工具

#### UI 组件

- **Lucide React** - 图标库
- **Tailwind CSS** - 样式框架（可选）

#### AI 服务

- **SiliconFlow API** - 默认 AI 服务
- **OpenAI API** - 备选方案
- 支持多提供商切换

#### 状态管理

- **React Hooks** - useState, useEffect, useCallback, useMemo
- **自定义 Hooks** - 封装业务逻辑

#### 数据持久化

- **localStorage** - 本地存储
- **JSON 格式** - 存档数据

### 架构设计

参考修仙游戏项目的模块化架构：

```
life-simulator-game/
├── components/          # UI 组件层（纯展示）
├── views/              # 视图层（业务逻辑 + UI）
├── features/           # 功能模块（可复用 Hooks）
├── hooks/              # 通用 Hooks
├── services/           # 业务逻辑服务层
├── utils/              # 工具函数
├── config/             # 配置文件
└── types.ts            # 类型定义
```

## 📐 详细实现方案

### 1. 数据结构设计

#### 核心数据类型

```typescript
// 玩家数据
interface Player {
  name: string;
  age: number;
  stage: LifeStage;
  
  // 核心属性
  attributes: {
    health: number;        // 健康 0-100
    intelligence: number;  // 智力 0-100
    charm: number;         // 魅力 0-100
    wealth: number;        // 财富（无上限）
    happiness: number;     // 幸福度 0-100
    stress: number;        // 压力 0-100
  };
  
  // 状态信息
  education: EducationLevel;
  career: Career | null;
  careerLevel: CareerLevel;
  maritalStatus: MaritalStatus;
  partner: Person | null;
  children: Person[];
  parents: Person[];
  friends: Person[];
  
  // 资产
  properties: Property[];
  vehicles: Vehicle[];
  investments: Investment[];
  
  // 游戏状态
  achievements: Achievement[];
  currentEvent: Event | null;
  eventHistory: Event[];
  choices: Choice[];
  
  // 元数据
  startDate: number;
  lastSaveDate: number;
}

// 人生阶段
enum LifeStage {
  CHILDHOOD = 'childhood',      // 0-6岁
  STUDENT = 'student',           // 7-18岁
  YOUNG_ADULT = 'young_adult',  // 19-25岁
  ADULT = 'adult',              // 26-40岁
  MIDDLE_AGE = 'middle_age',    // 41-60岁
  ELDERLY = 'elderly'           // 61+岁
}

// 教育水平
enum EducationLevel {
  PRIMARY = 'primary',          // 小学
  MIDDLE = 'middle',            // 初中
  HIGH = 'high',                // 高中
  BACHELOR = 'bachelor',        // 大学
  MASTER = 'master',            // 研究生
  DOCTOR = 'doctor'             // 博士
}

// 职业
interface Career {
  id: string;
  name: string;
  category: CareerCategory;
  educationRequired: EducationLevel;
  baseSalary: number;
  maxLevel: number;
  description: string;
}

enum CareerCategory {
  BLUE_COLLAR = 'blue_collar',  // 蓝领
  WHITE_COLLAR = 'white_collar', // 白领
  ENTREPRENEUR = 'entrepreneur', // 创业
  FREELANCE = 'freelance'       // 自由职业
}

// 事件
interface Event {
  id: string;
  type: EventType;
  title: string;
  description: string;
  choices: Choice[];
  conditions?: EventCondition[];
  effects?: EventEffect[];
  aiGenerated: boolean;
}

enum EventType {
  OPPORTUNITY = 'opportunity',  // 机遇
  CHALLENGE = 'challenge',      // 挑战
  DAILY = 'daily',              // 日常
  SPECIAL = 'special',           // 特殊
  STAGE = 'stage'               // 阶段事件
}

// 选择
interface Choice {
  id: string;
  text: string;
  effects: EventEffect[];
  requirements?: ChoiceRequirement[];
}

// 人物
interface Person {
  id: string;
  name: string;
  type: PersonType;
  relationship: RelationshipType;
  attributes: {
    intelligence: number;
    charm: number;
    wealth: number;
  };
}

enum PersonType {
  PARENT = 'parent',
  SIBLING = 'sibling',
  FRIEND = 'friend',
  PARTNER = 'partner',
  CHILD = 'child',
  COLLEAGUE = 'colleague'
}
```

### 2. 核心系统实现

#### 2.1 人生阶段系统

**实现位置**: `services/stageService.ts`

```typescript
// 判断当前阶段
export function getCurrentStage(age: number): LifeStage {
  if (age <= 6) return LifeStage.CHILDHOOD;
  if (age <= 18) return LifeStage.STUDENT;
  if (age <= 25) return LifeStage.YOUNG_ADULT;
  if (age <= 40) return LifeStage.ADULT;
  if (age <= 60) return LifeStage.MIDDLE_AGE;
  return LifeStage.ELDERLY;
}

// 检查阶段转换
export function checkStageTransition(
  player: Player,
  newAge: number
): LifeStage | null {
  const currentStage = getCurrentStage(player.age);
  const newStage = getCurrentStage(newAge);
  
  if (currentStage !== newStage) {
    return newStage;
  }
  return null;
}

// 生成阶段事件
export function generateStageEvent(
  stage: LifeStage,
  player: Player
): Event {
  // 根据阶段生成特定事件
  // 可以调用 AI 服务生成
}
```

#### 2.2 事件系统

**实现位置**: `services/eventService.ts`, `services/aiService.ts`

```typescript
// 事件生成服务
export class EventService {
  // 根据年龄和属性生成事件
  async generateEvent(
    player: Player,
    eventType?: EventType
  ): Promise<Event> {
    // 1. 检查是否有预设事件
    const presetEvent = this.checkPresetEvents(player);
    if (presetEvent) return presetEvent;
    
    // 2. 调用 AI 生成事件
    const aiEvent = await this.generateAIEvent(player, eventType);
    return aiEvent;
  }
  
  // AI 生成事件
  private async generateAIEvent(
    player: Player,
    eventType?: EventType
  ): Promise<Event> {
    const prompt = this.buildEventPrompt(player, eventType);
    const response = await aiService.generateEvent(prompt);
    return this.parseAIResponse(response);
  }
  
  // 构建事件提示词
  private buildEventPrompt(
    player: Player,
    eventType?: EventType
  ): string {
    return `
生成一个适合当前玩家状态的人生事件。

玩家信息：
- 年龄: ${player.age}岁
- 阶段: ${player.stage}
- 健康: ${player.attributes.health}
- 智力: ${player.attributes.intelligence}
- 魅力: ${player.attributes.charm}
- 财富: ${player.attributes.wealth}
- 幸福度: ${player.attributes.happiness}
- 压力: ${player.attributes.stress}
- 教育: ${player.education}
- 职业: ${player.career?.name || '无'}
- 婚姻: ${player.maritalStatus}

事件类型: ${eventType || '随机'}

要求：
1. 事件要符合当前年龄和阶段
2. 提供2-4个选择
3. 每个选择要有明确的影响
4. 事件要真实、有趣、有代入感

返回 JSON 格式：
{
  "title": "事件标题",
  "description": "事件描述",
  "type": "事件类型",
  "choices": [
    {
      "text": "选择文本",
      "effects": {
        "health": 0,
        "intelligence": 0,
        "charm": 0,
        "wealth": 0,
        "happiness": 0,
        "stress": 0
      }
    }
  ]
}
    `;
  }
}
```

#### 2.3 属性系统

**实现位置**: `utils/attributeUtils.ts`

```typescript
// 属性计算
export function calculateAttributes(player: Player): PlayerAttributes {
  const base = player.attributes;
  
  // 教育加成
  const educationBonus = getEducationBonus(player.education);
  
  // 职业加成
  const careerBonus = getCareerBonus(player.career, player.careerLevel);
  
  // 资产加成
  const propertyBonus = getPropertyBonus(player.properties);
  
  // 关系加成
  const relationshipBonus = getRelationshipBonus(player);
  
  return {
    health: Math.min(100, base.health + educationBonus.health),
    intelligence: Math.min(100, base.intelligence + educationBonus.intelligence),
    charm: Math.min(100, base.charm + relationshipBonus.charm),
    wealth: base.wealth,
    happiness: Math.min(100, base.happiness + relationshipBonus.happiness),
    stress: Math.max(0, base.stress - relationshipBonus.stressReduction)
  };
}

// 应用事件效果
export function applyEventEffects(
  player: Player,
  effects: EventEffect[]
): Player {
  const updated = { ...player };
  
  effects.forEach(effect => {
    if (effect.type === 'attribute') {
      updated.attributes[effect.attribute] += effect.value;
    } else if (effect.type === 'wealth') {
      updated.attributes.wealth += effect.value;
    } else if (effect.type === 'event') {
      // 触发后续事件
    }
  });
  
  // 限制属性范围
  updated.attributes.health = Math.max(0, Math.min(100, updated.attributes.health));
  updated.attributes.happiness = Math.max(0, Math.min(100, updated.attributes.happiness));
  updated.attributes.stress = Math.max(0, Math.min(100, updated.attributes.stress));
  
  return updated;
}
```

#### 2.4 职业系统

**实现位置**: `services/careerService.ts`

```typescript
// 职业服务
export class CareerService {
  // 获取可用职业
  getAvailableCareers(player: Player): Career[] {
    return CAREERS.filter(career => {
      // 检查教育要求
      if (!this.meetsEducationRequirement(player, career)) {
        return false;
      }
      
      // 检查其他要求
      if (career.requirements) {
        return this.checkRequirements(player, career.requirements);
      }
      
      return true;
    });
  }
  
  // 职业发展
  advanceCareer(player: Player): Player {
    if (!player.career) return player;
    
    const updated = { ...player };
    const career = player.career;
    const currentLevel = player.careerLevel;
    
    // 检查是否可以升级
    if (this.canAdvance(player, career, currentLevel)) {
      updated.careerLevel = this.getNextLevel(currentLevel);
      updated.attributes.wealth += this.getSalaryIncrease(career, currentLevel);
    }
    
    return updated;
  }
  
  // 计算收入
  calculateIncome(player: Player): number {
    if (!player.career) return 0;
    
    const baseSalary = player.career.baseSalary;
    const levelMultiplier = this.getLevelMultiplier(player.careerLevel);
    const experienceBonus = this.getExperienceBonus(player);
    
    return baseSalary * levelMultiplier + experienceBonus;
  }
}
```

### 3. UI 组件设计

#### 3.1 主游戏视图

**实现位置**: `views/GameView.tsx`

```typescript
export default function GameView() {
  const { player, setPlayer } = useGameState();
  const { handleAgeUp, handleEventChoice } = useGameHandlers();
  
  return (
    <div className="game-container">
      <GameHeader player={player} />
      <StatsPanel player={player} />
      <EventModal 
        event={player.currentEvent}
        onChoice={handleEventChoice}
      />
      <ActionBar 
        onAgeUp={handleAgeUp}
        onViewCareer={() => {}}
        onViewRelationships={() => {}}
      />
      <LogPanel logs={player.eventHistory} />
    </div>
  );
}
```

#### 3.2 事件弹窗

**实现位置**: `components/EventModal.tsx`

```typescript
interface EventModalProps {
  event: Event | null;
  onChoice: (choice: Choice) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function EventModal({
  event,
  onChoice,
  isOpen,
  onClose
}: EventModalProps) {
  if (!event) return null;
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>
        <h2>{event.title}</h2>
        <EventTypeBadge type={event.type} />
      </ModalHeader>
      <ModalBody>
        <p>{event.description}</p>
        <ChoiceList 
          choices={event.choices}
          onChoice={onChoice}
        />
      </ModalBody>
    </Modal>
  );
}
```

### 4. 状态管理

**实现位置**: `hooks/useGameState.ts`

```typescript
export function useGameState() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  
  // 加载存档
  useEffect(() => {
    const saved = loadGame();
    if (saved) {
      setPlayer(saved);
      setGameStarted(true);
    }
  }, []);
  
  // 自动保存
  useEffect(() => {
    if (player && gameStarted) {
      saveGame(player);
    }
  }, [player, gameStarted]);
  
  // 年龄增长
  const handleAgeUp = useCallback(() => {
    if (!player) return;
    
    const updated = {
      ...player,
      age: player.age + 1
    };
    
    // 检查阶段转换
    const newStage = checkStageTransition(player, updated.age);
    if (newStage) {
      updated.stage = newStage;
      // 触发阶段事件
    }
    
    // 更新属性（自然变化）
    updated.attributes = applyAgeEffects(updated.attributes, updated.age);
    
    setPlayer(updated);
  }, [player]);
  
  return {
    player,
    setPlayer,
    gameStarted,
    setGameStarted,
    handleAgeUp
  };
}
```

## 🗓️ 开发计划

### 第一阶段：基础框架（1-2周）

- [ ] 项目初始化
- [ ] 基础架构搭建
- [ ] 类型定义
- [ ] 基础 UI 组件
- [ ] 状态管理

### 第二阶段：核心系统（2-3周）

- [ ] 属性系统
- [ ] 事件系统（基础）
- [ ] 人生阶段系统
- [ ] 选择系统
- [ ] AI 集成

### 第三阶段：功能系统（3-4周）

- [ ] 教育系统
- [ ] 职业系统
- [ ] 人际关系系统
- [ ] 生活系统
- [ ] 成就系统

### 第四阶段：优化完善（2-3周）

- [ ] UI/UX 优化
- [ ] 事件丰富化
- [ ] 平衡性调整
- [ ] 性能优化
- [ ] 测试和修复

## 🔧 技术细节

### AI 集成

参考修仙游戏的 AI 配置系统：

```typescript
// config/aiConfig.ts
export function getAIConfig() {
  const provider = import.meta.env.VITE_AI_PROVIDER || 'siliconflow';
  const apiKey = import.meta.env.VITE_AI_KEY;
  const model = import.meta.env.VITE_AI_MODEL || 'Qwen/Qwen2.5-72B-Instruct';
  
  return {
    provider,
    apiKey,
    model,
    apiUrl: getProviderUrl(provider)
  };
}
```

### 数据持久化

```typescript
// utils/gameUtils.ts
const SAVE_KEY = 'life-simulator-save';

export function saveGame(player: Player): void {
  const data = {
    player,
    timestamp: Date.now(),
    version: '1.0.0'
  };
  localStorage.setItem(SAVE_KEY, JSON.stringify(data));
}

export function loadGame(): Player | null {
  const data = localStorage.getItem(SAVE_KEY);
  if (!data) return null;
  
  try {
    const parsed = JSON.parse(data);
    return parsed.player;
  } catch {
    return null;
  }
}
```

### 事件生成策略

1. **预设事件**: 关键节点使用预设事件（阶段转换、重要选择）
2. **AI 生成**: 日常事件使用 AI 生成
3. **混合模式**: 预设模板 + AI 填充细节

## 📊 性能优化

### 1. 事件缓存

```typescript
// 缓存 AI 生成的事件
const eventCache = new Map<string, Event>();

export async function generateEvent(player: Player): Promise<Event> {
  const cacheKey = generateCacheKey(player);
  
  if (eventCache.has(cacheKey)) {
    return eventCache.get(cacheKey)!;
  }
  
  const event = await aiService.generateEvent(player);
  eventCache.set(cacheKey, event);
  
  return event;
}
```

### 2. 组件优化

- 使用 `React.memo` 优化组件渲染
- 使用 `useCallback` 和 `useMemo` 优化计算
- 懒加载大型组件

### 3. 数据优化

- 只保存必要的数据
- 定期清理历史数据
- 压缩存档数据

## 🧪 测试策略

### 单元测试

- 属性计算函数
- 事件生成逻辑
- 职业发展逻辑

### 集成测试

- 完整游戏流程
- 存档/读档功能
- AI 事件生成

### 用户测试

- 游戏平衡性
- 事件多样性
- 用户体验

## 🚀 部署方案

### 开发环境

- Vite 开发服务器
- 热重载支持
- 开发工具集成

### 生产环境

- Vite 构建
- Vercel 部署（推荐）
- GitHub Pages 备选

## 📝 后续扩展

### 可能的扩展功能

1. **多人模式**: 与其他玩家互动
2. **排行榜**: 比较不同人生轨迹
3. **自定义事件**: 玩家创建事件
4. **更多职业**: 扩展职业系统
5. **更多阶段**: 细化人生阶段
6. **可视化**: 人生轨迹图表

---

**提示**: 这是一个渐进式开发计划，可以根据实际情况调整优先级和时间安排。


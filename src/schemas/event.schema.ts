import { z } from 'zod';

/**
 * AI 事件输出 Schema
 * 用于校验 AI 生成的事件数据
 */
export const AIEventSchema = z.object({
  title: z.string()
    .min(5, '标题至少5个字符')
    .max(50, '标题最多50个字符'),

  description: z.string()
    .min(50, '描述至少50个字符')
    .max(500, '描述最多500个字符'),

  type: z.enum(['opportunity', 'challenge', 'daily', 'special', 'stage'],
    { message: '事件类型必须是 opportunity/challenge/daily/special/stage 之一' }
  ),

  choices: z.array(
    z.object({
      text: z.string()
        .min(5, '选项文本至少5个字符')
        .max(100, '选项文本最多100个字符'),

      effects: z.record(
        z.string(),
        z.number().int('效果值必须是整数').min(-30, '效果值不能小于-30').max(30, '效果值不能大于30')
      ).refine(
        (effects) => Object.keys(effects).length > 0,
        { message: '至少需要一个效果' }
      ),
    })
  ).min(2, '至少需要2个选项').max(4, '最多4个选项'),
});

/**
 * AI 选择后果输出 Schema
 */
export const AIConsequenceSchema = z.object({
  description: z.string()
    .min(20, '后果描述至少20个字符')
    .max(200, '后果描述最多200个字符'),

  effects: z.array(
    z.object({
      type: z.enum(['attribute', 'wealth']),

      attribute: z.enum(['health', 'intelligence', 'charm', 'happiness', 'stress']).optional(),

      value: z.number().int('效果值必须是整数'),
    })
  ).min(1, '至少需要一个效果'),
}).refine(
  (data) => {
    // 校验：如果是 attribute 类型，必须有 attribute 字段
    return data.effects.every((effect) => {
      if (effect.type === 'attribute') {
        return effect.attribute !== undefined;
      }
      return true;
    });
  },
  { message: 'attribute 类型的效果必须指定 attribute 字段' }
);

/**
 * 效果值校验 Schema（用于校验单个效果）
 */
export const EffectValueSchema = z.object({
  type: z.enum(['attribute', 'wealth']),
  attribute: z.enum(['health', 'intelligence', 'charm', 'happiness', 'stress', 'wealth']).optional(),
  value: z.number().int(),
}).refine(
  (data) => {
    // 属性效果值范围：-30 到 30
    if (data.type === 'attribute' && data.attribute) {
      return data.value >= -30 && data.value <= 30;
    }
    // 财富效果值范围：-5000 到 5000
    if (data.type === 'wealth' || data.attribute === 'wealth') {
      return data.value >= -5000 && data.value <= 5000;
    }
    return true;
  },
  { message: '效果值超出允许范围' }
);

// 类型导出
export type AIEventInput = z.infer<typeof AIEventSchema>;
export type AIConsequenceInput = z.infer<typeof AIConsequenceSchema>;

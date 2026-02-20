import { z } from 'zod';

/**
 * 后果效果 Schema
 * 用于校验 AI 生成的后果效果
 */

// 单个效果的结构
export const ConsequenceEffectSchema = z.object({
  type: z.enum(['attribute', 'wealth', 'event', 'relationship']),

  // 属性效果时必填
  attribute: z.enum(['health', 'intelligence', 'charm', 'happiness', 'stress']).optional(),

  // 效果值
  value: z.number().int('效果值必须是整数'),

  // 关系/事件效果时的目标
  target: z.string().optional(),
});

// 后果响应结构
export const ConsequenceResponseSchema = z.object({
  description: z.string()
    .min(20, '后果描述至少20个字符')
    .max(300, '后果描述最多300个字符'),

  effects: z.array(ConsequenceEffectSchema)
    .min(1, '至少需要一个效果')
    .max(5, '最多5个效果'),
});

// 带校验的效果 Schema
export const ValidatedEffectSchema = ConsequenceEffectSchema.refine(
  (data) => {
    // 如果是 attribute 类型，必须指定 attribute 字段
    if (data.type === 'attribute' && !data.attribute) {
      return false;
    }

    // 属性效果值范围：-30 到 30
    if (data.type === 'attribute' && data.attribute) {
      if (data.value < -30 || data.value > 30) {
        return false;
      }
    }

    // 财富效果值范围：-5000 到 5000
    if (data.type === 'wealth') {
      if (data.value < -5000 || data.value > 5000) {
        return false;
      }
    }

    return true;
  },
  { message: '效果数据不符合约束' }
);

// 类型导出
export type ConsequenceEffect = z.infer<typeof ConsequenceEffectSchema>;
export type ConsequenceResponse = z.infer<typeof ConsequenceResponseSchema>;

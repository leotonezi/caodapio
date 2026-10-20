import { z } from 'zod'

const itemSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  targetGrams: z.number().positive(),
})

const proteinItemSchema = itemSchema.extend({
  fraction: z.number().min(0).max(1),
})

export const planSchema = z.object({
  version: z.number().int().positive(),
  validFrom: z.string(),
  validTo: z.string(),
  vetName: z.string().min(1),
  categories: z.object({
    carb: z.object({
      items: z.array(itemSchema).min(1),
    }),
    protein: z.object({
      items: z.array(proteinItemSchema).min(1).max(2),
    }),
    vegetables: z.object({
      targetGrams: z.number().positive(),
      minTypes: z.number().int().positive(),
      maxTypes: z.number().int().positive(),
      items: z.array(itemSchema).min(1),
    }),
    lard: z.object({
      targetGrams: z.number().nonnegative(),
    }),
    foodDog: z.object({
      fullDoseGrams: z.number().nonnegative(),
    }),
    treats: z.object({
      limitGrams: z.number().nonnegative(),
    }),
    forbiddenFoods: z.array(z.string().min(1)),
  }),
})

export type Item = z.infer<typeof itemSchema>
export type ProteinItem = z.infer<typeof proteinItemSchema>
export type Plan = z.infer<typeof planSchema>

export function validatePlan(doc: unknown): Plan {
  return planSchema.parse(doc)
}

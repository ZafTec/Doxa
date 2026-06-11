import {z} from "zod";

export const createItemSchema = z.object({
    brand: z.string(),
    categoryId: z.string(),
    description: z.string(),
})

export const createItemVariantSchema = z.object({
    itemId: z.string(),
    price: z.coerce.number().min(0),
    color: z.string(),
    stockQuantity: z.coerce.number().min(0),
})

export const getItemQuerySchema = z.object({
    category: z.string().optional().transform((s) => s?.split(',')),
    brand: z.string().optional().transform(s => s?.split(',')),
    pageSize: z.coerce.number().min(1).optional(),
    pageNumber: z.coerce.number().min(0).optional(),
})

export type CreateItemDto = z.infer<typeof createItemSchema>
export type ItemQueryDto = z.infer<typeof getItemQuerySchema>
export type CreateItemVariantDto = z.infer<typeof createItemVariantSchema>
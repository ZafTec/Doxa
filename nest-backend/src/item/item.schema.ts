import {z} from "zod";

export const createItemSchema = z.object({
    brand: z.string(),
    categoryId: z.string(),
    description: z.string(),
})

export const getItemQuerySchema = z.object({
    category: z.string().optional().transform((s) => s?.split(',')),
    brand: z.string().optional().transform(s => s?.split(',')),
    pageSize: z.coerce.number().min(1).optional(),
    pageNumber: z.coerce.number().min(0).optional(),
})

export type CreateItemDto = z.infer<typeof createItemSchema>
export type ItemQueryDto = z.infer<typeof getItemQuerySchema>
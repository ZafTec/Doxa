import {z} from "zod";

export const createItemSchema = z.object({
    Brand: z.string(),
    CategoryId: z.number(),
    Description: z.string(),
})

export type CreateItemDto = z.infer<typeof createItemSchema>
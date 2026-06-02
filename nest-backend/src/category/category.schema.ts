import {z} from "zod";

export const createCategorySchema = z.object({
    Name: z.string(),
})

export type CreateCategoryDto = z.infer<typeof createCategorySchema>
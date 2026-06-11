import {z} from "zod"

export const createAssetSchema = z.object({
    itemVariantId: z.string(),
    urls: z.array(z.string())
})

export type CreateAssetDto = z.infer<typeof createAssetSchema>
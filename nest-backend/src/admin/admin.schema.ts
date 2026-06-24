import {z} from "zod"

export const getAdminAccessTokenQuery = z.object({
    code: z.string()
})

export type GetAdminAccessTokenQueryDto = z.infer<typeof getAdminAccessTokenQuery>


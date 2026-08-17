import { z } from 'zod';

export const createAdminUserSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  role: z.enum(['SUPER_ADMIN', 'EDITOR']).default('EDITOR'),
});

export const updateAdminUserRoleSchema = z.object({
  role: z.enum(['SUPER_ADMIN', 'EDITOR']),
});

export type CreateAdminUserDto = z.infer<typeof createAdminUserSchema>;
export type UpdateAdminUserRoleDto = z.infer<typeof updateAdminUserRoleSchema>;

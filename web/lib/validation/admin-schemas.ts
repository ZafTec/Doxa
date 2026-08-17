import { z } from "zod";
import { emailSchema } from "./schemas";

export const createItemSchema = z.object({
  brand: z.string().min(1, "Brand is required"),
  categoryId: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
});

export const createItemVariantSchema = z.object({
  color: z.string().min(1, "Color is required"),
  price: z.coerce.number().min(0, "Price must be 0 or more"),
  stockQuantity: z.coerce.number().int().min(0, "Stock must be 0 or more"),
});

export const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export const createAdminUserSchema = z.object({
  email: emailSchema,
  name: z.string().optional(),
  role: z.enum(["SUPER_ADMIN", "EDITOR"]),
});

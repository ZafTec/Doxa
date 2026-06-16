import { z } from "zod";

/**
 * Shared zod schemas. Authentication schemas were removed — v1 ships as a
 * guest-only storefront. Re-add login/signup when the backend grows an auth
 * module and we wire a customer dashboard.
 */

export const emailSchema = z.string().email("Enter a valid email address");

export const quantitySchema = z
  .number()
  .int("Quantity must be a whole number")
  .min(1, "Quantity must be at least 1")
  .max(99, "Quantity is too large");

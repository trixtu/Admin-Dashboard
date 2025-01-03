import { z, ZodType } from "zod";
import { BrandFormData, CategoryFormData } from "./forms";
import {
  descriptionFormat,
  nameFormat,
  seoFormat,
  slugFormat,
} from "@/lib/regex";

export const brandValidationSchema: ZodType<BrandFormData> = z.object({
  name: z.string().regex(nameFormat, {
    message: "Brand name is required",
  }),
  seo: z.string().regex(seoFormat, { message: "Invalid SEO address." }),
  logo: z.string().optional(),
  banner: z.string().optional(),
  status: z.enum(["draft", "publish"]),
  user_id: z.string().optional().nullable(),
});

export const categoryValidationSchema: ZodType<CategoryFormData> = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  image: z.string().optional(),
  status: z.enum(["draft", "publish"]),
  user_id: z.string().optional().nullable(),
  parentId: z.string().optional().nullable(),
  category: z.string().optional()
});

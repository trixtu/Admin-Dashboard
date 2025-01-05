import { string, z, ZodType } from "zod";
import {
  BrandFormData,
  CategoryFormData,
  OptionFormData,
  ValueFormData,
} from "./forms";
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
});

export const optionValidationSchema: ZodType<OptionFormData> = z.object({
  name: z.string().min(1, "Name is required"),
  productId: z.string().optional(),
  isColor: z.boolean().default(false),
  separateImages: z.boolean().default(false),
  asFilters: z.boolean().default(false),
  user_id: z.string().optional().nullable(),
});

export const valueOptionValidationSchema: ZodType<ValueFormData> = z.object({
  value: z.string().min(1, "Value is required"),
  additionalPrice: z
    .number()
    .nonnegative("Price cannot be negative")
    .optional(),
  metadata: z.record(z.any()).optional(),
  optionId: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid Option ID format"),
});

export type BrandFormData = {
  _id?: string;
  name: string;
  seo: string;
  logo?: string;
  banner?: string;
  status: "draft" | "publish";
  user_id?: string | null | undefined;
  createdAt?: string;
};

export type CategoryFormData = {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  status: "draft" | "publish" | "archive";
  user_id?: string | null | undefined;
  parentId?: string | null | undefined;
  createdAt?: string;
};

export type OptionFormData = {
  _id?: string;
  name: string;
  products?: string[];
  isColor?: boolean;
  separateImages?: boolean;
  asFilters?: boolean;
  user_id?: string | null | undefined;
  createdAt?: Date;
  updatedAt?: Date;
};

export type ValueFormData = {
  _id?: string;
  value: string;
  additionalPrice?: number;
  metadata?: Record<string, any>;
  optionId: string;
  user_id?: string | null | undefined;
  createdAt?: Date;
  updatedAt?: Date;
};

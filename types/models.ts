import { Types } from "mongoose";
import { Document } from "mongoose";

export type Image = {
  url: string;
};

export type TypeBrandModel = {
  _id: string;
  name: string;
  seo: string;
  logo: string;
  banner: string;
  user_id: string;
  status: "draft" | "publish";
  createdAt: Date;
};

export type TypeCategoryModel = {
  _id: string;
  name: string;
  description?: string;
  slug: string;
  image?: string;
  user_id: string;
  parentId?: string;
  subcategories: TypeCategoryModel[];
  status: "draft" | "publish" | "archive";
  createdAt: Date;
};

export type TypeOptionModel = {
  name: string;
  products?: Types.ObjectId[];
  isColor?: boolean;
  separateImages?: boolean;
  asFilters?: boolean;
  user_id: string;
  createdAt?: Date;
  updatedAt?: Date;
};
export type TypeValueModel = {
  value: string;
  additionalPrice?: number;
  metadata?: Record<string, any>;
  optionId: Types.ObjectId;
  user_id: string;
  createdAt?: Date;
  updatedAt?: Date;
};

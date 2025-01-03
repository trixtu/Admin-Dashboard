export type BrandFormData = {
  _id?: string;
  name: string;
  seo: string;
  logo?:string;
  banner?:string;
  status: "draft" | "publish" ;
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
  category?: string;
};
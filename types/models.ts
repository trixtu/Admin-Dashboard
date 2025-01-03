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
  status: "draft" | "publish" | "archive";
  createdAt: Date;
  category: TypeCategoryModel;
};

import { TypeCategoryModel } from "@/types/models";
import mongoose, { model, Model, Schema } from "mongoose";

//2. type model
type CategoryModel = Model<TypeCategoryModel>;

// 3. Create schema
const schema = new Schema<TypeCategoryModel, CategoryModel>(
  {
    name: {
      type: String,
      required: true,
      maxLength: 255,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: false,
      maxLength: 255,
      lowercase: true,
    },
    slug: {
      type: String,
      required: true,
      maxLength: 255,
      unique: true,
      lowercase: true,
    },
    image: {
      type: String,
      required: false,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null, // Null pentru categoriile principale
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "publish"],
      default: "draft",
    },
    user_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// 4. create the model
const Category: CategoryModel =
  mongoose.models.Category ||
  model<TypeCategoryModel, CategoryModel>("Category", schema);

export default Category;

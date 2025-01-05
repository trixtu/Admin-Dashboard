import { TypeOptionModel } from "@/types/models";
import mongoose, { Model, Schema, model } from "mongoose";

//2. type model
type OptionModel = Model<TypeOptionModel>;

// 3. Create schema
const schema = new Schema<TypeOptionModel, OptionModel>(
  {
    name: { type: String, required: true },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    isColor: { type: Boolean, default: false },
    separateImages: { type: Boolean, default: false },
    asFilters: { type: Boolean, default: false },
    user_id: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

// 4. create the model
const Option: OptionModel =
  mongoose.models.Option || model<TypeOptionModel, OptionModel>("Option", schema);

export default Option;

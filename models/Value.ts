import { TypeValueModel } from "@/types/models";
import mongoose, { Model, Schema, model } from "mongoose";

//2. type model
type ValueModel = Model<TypeValueModel>;

// 3. Create schema
const OptionValueSchema = new Schema<TypeValueModel, ValueModel>(
  {
    value: {
      type: String,
      required: true,
    },
    additionalPrice: {
      type: Number,
      default: 0,
    },
    metadata: {
      type: Object, // Obiect pentru stocarea datelor suplimentare
      default: {},
    },
    optionId: {
      type: Schema.Types.ObjectId,
      ref: "Option",
      required: true,
    },
    user_id: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true, // Adaugă câmpurile createdAt și updatedAt
  }
);

// 4. create the model
const Value: ValueModel =
  mongoose.models.Value ||
  model<TypeValueModel, ValueModel>("Value", OptionValueSchema);

export default Value;

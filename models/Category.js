import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { strict: false }
);

const Category =
  mongoose.models.category || mongoose.model("category", categorySchema);

export default Category;

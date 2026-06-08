import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
    category_id: String,
    category: String,
    color: String,
    icon: String
    },
    {
        timestamps: true,
        collection: "categories"
    }
)

const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);

export default Category;
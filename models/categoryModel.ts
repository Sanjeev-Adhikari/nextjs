import mongoose from "mongoose";

export interface CategoryData {
    categoryName: string;
}

const categorySchema = new mongoose.Schema<CategoryData>({
    categoryName: {
        type: String,
        required: true,
    },
});

export const Category = mongoose.models.Category || mongoose.model<CategoryData>("Category", categorySchema);
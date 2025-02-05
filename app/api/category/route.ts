import connectDB from "@/db/dbConection";
import { Category, CategoryData } from "@/models/categoryModel";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  await connectDB();
  const { categoryName } = await req.json() as CategoryData;

  if (!categoryName) {
    return NextResponse.json({ error: "category name is required" }, { status: 400 });
  }
  const createCategory = await Category.create({ categoryName });
  return NextResponse.json({
    message: "category created successfully",
    data: createCategory,
  });
}

export async function GET() {
  await connectDB();
  const categories = await Category.find();
  return NextResponse.json({
    message: "categories fetched successfully",
    data: categories,
  });
}



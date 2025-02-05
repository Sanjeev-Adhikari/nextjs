import connectDB from "@/db/dbConection";
import { Category } from "@/models/categoryModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    await connectDB();
    const id = (await params).id;
    const singleCategory = await Category.findById(id);
    if (!singleCategory) {
        return NextResponse.json({ error: "category not found" }, { status: 404 });
    }
    return NextResponse.json({
        message: "single category fetched successfully",
        data: singleCategory,
    });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    await connectDB();
    const { id } = (await params);
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json({ error: "category not found" }, { status: 404 });
    }
    await category.deleteOne();
    return NextResponse.json({ message: "category deleted successfully" });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    await connectDB();
    const { id } = (await params);
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json({ error: "category not found" }, { status: 404 });
    }
    const { categoryName } = await req.json();
    if (!categoryName) {
      return NextResponse.json({ error: "category name is required" }, { status: 400 });
    }
    await category.updateOne({ categoryName });
    return NextResponse.json({ message: "category updated successfully" , data: category });
}


  
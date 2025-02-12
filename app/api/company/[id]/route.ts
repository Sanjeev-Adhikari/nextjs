import connectDB from "@/db/dbConection";
import { Company } from "@/models/companyModel";
import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary } from "@/services/cloudinary";
import { deleteFromCloudinary } from "@/services/cloudinary";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const id = (await params).id;
  try {
    const singleCompany = await Company.findById(id);
    if (!singleCompany) {
      return NextResponse.json({ error: "company not found" }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      message: "single company fetched successfully",
      data: singleCompany,
    });
  } catch (error) {
    console.log("error while creating company");
    return NextResponse.json({ error: "Failed to create company" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  const company = await Company.findById(id);
  if (!company) {
    return NextResponse.json({ error: "company not found" }, { status: 404 });
  }

  try {
    if (company.companyLogo && company.imagePdf) {
      await deleteFromCloudinary(company.companyLogo);
      await deleteFromCloudinary(company.imagePdf);
    }
    await company.deleteOne();

    return NextResponse.json({ success: true, message: "company deleted successfully" });
  } catch (error) {
    console.error("Error deleting company:", error);
    return NextResponse.json({ error: "Failed to delete company" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;

  const company = await Company.findById(id);
  if (!company) {
    return NextResponse.json({ error: "company not found" }, { status: 404 });
  }
  try {
    const formData = await req.formData();
    const companyLogo = formData.get("companyLogo") as File;
    const companyName = formData.get("companyName") as string;
    const companyDescription = formData.get("companyDescription") as string;
    const category = formData.get("category") as string;
    const imagePdf = formData.get("imagePdf") as File

    // Validate fields
    if (!companyName) {
      return NextResponse.json({ error: "company name is required" }, { status: 400 });
    }
    if (!companyDescription) {
      return NextResponse.json({ error: "company description is required" }, { status: 400 });
    }
    if (!category) {
      return NextResponse.json({ error: "category is required" }, { status: 400 });
    }

    if (company.companyName) company.companyName = companyName;
    if (company.companyDescription) company.companyDescription = companyDescription;
    if (company.category) company.category = category;

    if (companyLogo) {
      if (company.companyLogo) {
        await deleteFromCloudinary(company.companyLogo);
      }
      const newLogoUrl = await uploadToCloudinary(companyLogo);
      company.companyLogo = newLogoUrl;
    }
    if (imagePdf) {
      if (company.imagePdf) {
        await deleteFromCloudinary(company.imagePdf);
      }
      const newPdfUrl = await uploadToCloudinary(imagePdf);
      company.imagePdf = newPdfUrl;
    }
    await company.save();
    return NextResponse.json({ success: true, message: "company updated successfully", data: company });
  } catch (error) {
    console.error("Error updating company:", error);
    return NextResponse.json({ error: "Failed to update company" }, { status: 500 });
  }
}


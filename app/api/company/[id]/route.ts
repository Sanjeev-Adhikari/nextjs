import connectDB from "@/db/dbConection";
import { Company } from "@/models/comapnyModel";
import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary }   from "@/services/cloudinary";
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
    // Delete the company's image from Cloudinary
    if (company.companyLogo) {
      await deleteFromCloudinary(company.companyLogo);
      console.log("company logo deleted successfully");
    }

    // Delete the company from the database
    await company.deleteOne();

    return NextResponse.json({ message: "company deleted successfully" });
  } catch (error) {
    console.error("Error deleting company:", error);
    return NextResponse.json({ error: "Failed to delete company" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
  
      // Update the company object
      company.companyName = companyName;
      company.companyDescription = companyDescription;
      company.category = category;
  
      if (companyLogo) {
        // Delete the old image from Cloudinary if a new image is provided
        if (company.companyLogo) {
          await deleteFromCloudinary(company.companyLogo);
          console.log("company logo deleted successfully");
        }
  
        // Upload the new image to Cloudinary
        const newLogoUrl = await uploadToCloudinary(companyLogo, "logolab");
        company.companyLogo = newLogoUrl;
      }
  
      // Save the updated company object
      await company.save();
  
      return NextResponse.json({ message: "company updated successfully", data: company });
    } catch (error) {
      console.error("Error updating company:", error);
      return NextResponse.json({ error: "Failed to update company" }, { status: 500 });
    }
}
  

import connectDB from "@/db/dbConection";
import { Company } from "@/models/companyModel";
import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary } from "@/services/cloudinary";

export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const formData = await req.formData()
    const companyLogo = formData.get("companyLogo") as File
    const companyName = formData.get("companyName") as string
    const companyDescription = formData.get("companyDescription") as string
    const category = formData.get("category") as string
    const imagePdf = formData.get("imagePdf") as File

    console.log("logsss", companyLogo, imagePdf)
    // Validate required fields
        if (!companyName || !companyLogo || !companyDescription ||  !category || !imagePdf) {
      return NextResponse.json({ error: "please provide the required fields" }, { status: 400 });
    }


    // Upload company logo to Cloudinary
    const imageUrl = await uploadToCloudinary(companyLogo);
    const pdfUrl = await uploadToCloudinary(imagePdf)

    // Create company with the uploaded logo URL
    const createCompany = await Company.create({
      companyName,
      companyLogo: imageUrl,
      companyDescription,
      category,
      imagePdf: pdfUrl
    });

    return NextResponse.json({
      success: true,
      message: "Company created successfully",
      data: createCompany,
    });
  } catch (error) {
    console.error("Error creating company:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the company" },
      { status: 500 }
    );
  }
}

export async function GET() {
  await connectDB();
  const companies = await Company.find();
  return NextResponse.json({
    success: true,
    message: "Companies fetched successfully",
    data: companies,
  });
}


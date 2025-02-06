import connectDB from "@/db/dbConection";
import { Testimonial } from "@/models/testimonialModel";
import { uploadToCloudinary } from "@/services/cloudinary";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    await connectDB();
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const rating = formData.get("rating") ? Number(formData.get("rating")) : undefined;
    const testimonial = formData.get("testimonial") as string;
    const imageUrl = formData.get("imageUrl") as File;

    if(!name || !testimonial || !imageUrl) {
        return NextResponse.json({ message: "Please fill all the fields" });
    }

    const picUrl = await uploadToCloudinary(imageUrl);
    const newTestimonial = await Testimonial.create({ name, rating, testimonial, imageUrl: picUrl });
     return NextResponse.json({
          message: "Testimonial created successfully",
          data: newTestimonial
        });
}

export async function GET(req: NextRequest) {
    await connectDB();
    const testimonials = await Testimonial.find({});
    return NextResponse.json({
        message: "Testimonials fetched successfully",
        data: testimonials
    });
}
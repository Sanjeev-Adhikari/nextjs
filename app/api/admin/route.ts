import connectDB from "@/db/dbConection";
import { Category } from "@/models/categoryModel";
import { Company } from "@/models/companyModel";
import { Contact } from "@/models/contactModel";
import { Testimonial } from "@/models/testimonialModel";
import { NextResponse } from "next/server";


export async function GET(request: Request) {
    await connectDB();
    const totalWorks = await Company.countDocuments();
    const totalTestimonials = await Testimonial.countDocuments();
    const totalInbox = await Contact.countDocuments();
    const totalCategories = await Category.countDocuments();

    if (!totalWorks) {
        return NextResponse.json({
            message: "No any works found"
        })
    }

    if (!totalTestimonials) {
        return NextResponse.json({
            message: "No any testimonials found"
        })
    }

    if (!totalInbox) {
        return NextResponse.json({
            message: "No any inbox found"
        })
    }
    if (!totalCategories) {
        return NextResponse.json({
            message: "No any categories found"
        })
    }

    return NextResponse.json({
        success: true,
        message: "Dasboard data fetched successfully",
        data: {
            totalWorks,
            totalTestimonials,
            totalInbox,
            totalCategories
        }
    })
}
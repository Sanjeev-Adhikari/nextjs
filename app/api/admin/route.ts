import connectDB from "@/db/dbConection";
import { Company } from "@/models/comapnyModel";
import { Contact } from "@/models/contactModel";
import { Testimonial } from "@/models/testimonialModel";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    await connectDB();
    const totalWorks = await Company.countDocuments();
    const totalTestimonials = await Testimonial.countDocuments();
    const totalInbox = await Contact.countDocuments();

    if(!totalWorks){
        return NextResponse.json({
            message: "No any works found"
        })
    }

    if(!totalTestimonials){
        return NextResponse.json({
            message: "No any testimonials found"
        })
    }

    if(!totalInbox){
        return NextResponse.json({
            message: "No any inbox found"
        })
    }

    return NextResponse.json({
        success: true,
        message: "Dasboard data fetched successfully",
        data: {
            totalWorks,
            totalTestimonials,
            totalInbox
        }
    })
}
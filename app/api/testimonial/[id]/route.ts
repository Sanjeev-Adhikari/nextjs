import connectDB from "@/db/dbConection";
import { Testimonial } from "@/models/testimonialModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest, { params }: { params: Promise<{ id: string }> }) {
    await connectDB();
    const {id} = (await params);
    try {
        const singleTestimonial = await Testimonial.findById(id);
        if(!singleTestimonial) {            
            return NextResponse.json({ message: "Testimonial not found" });
        }
        return NextResponse.json({
            message: "Testimonial fetched successfully",
            data: singleTestimonial
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Testimonial not found" });
    }
}
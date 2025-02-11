import connectDB from "@/db/dbConection";
import { Testimonial } from "@/models/testimonialModel";
import { deleteFromCloudinary, uploadToCloudinary } from "@/services/cloudinary";
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
            success: true,
            message: "Testimonial fetched successfully",
            data: singleTestimonial
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: true, message: "Testimonial not found" });
    }
}

export async function DELETE(req:NextRequest, { params }: { params: Promise<{ id: string }> }) {
    await connectDB();
    const {id} = (await params);
    const testimonial = await Testimonial.findById(id);

    if(!testimonial) {
        return NextResponse.json({ message: "Testimonial not found" }, { status: 404 });
    }
    try {
        if(testimonial.imageUrl) {
            await deleteFromCloudinary(testimonial.imageUrl);
            console.log("testimonial image deleted successfully");
        }
        await testimonial.deleteOne();
        return NextResponse.json({ success: true, message: "Testimonial deleted successfully" }, { status:  200});
    } catch (error) {
        console.error("Error deleting testimonial:", error);
        return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 500 });
    }
}

// export async function PUT(req:NextRequest, { params }: { params: Promise<{ id: string }> }) {
//     await connectDB();
//     const {id} = (await params);
//     const updateTestimonial = await Testimonial.findById(id);

//     if(!updateTestimonial) {
//         return NextResponse.json({ message: "Testimonial not found" }, { status: 404 });
//     }
//     try {
//         const formData = await req.formData();
//         const name = formData.get("name") as string;
//         const rating = formData.get("rating") ? Number(formData.get("rating")) : undefined;
//         const testimonial = formData.get("testimonial") as string;
//         const imageUrl = formData.get("imageUrl") as File;
        

//         if(name) updateTestimonial.name = name;
//          if (rating) updateTestimonial.rating = rating;
//         if(testimonial) updateTestimonial.testimonial = testimonial;
        

//         console.log("imageUrl", imageUrl)
//         if(imageUrl) {
//             if(updateTestimonial.imageUrl) {
//                 await deleteFromCloudinary(updateTestimonial.imageUrl);
//                 console.log("testimonial image deleted successfully");
//             }
//             const picUrl = await uploadToCloudinary(imageUrl);
//             updateTestimonial.imageUrl = picUrl;
//             await updateTestimonial.save();
//             return NextResponse.json({
//                 success: true,
//                 message: "Testimonial updated successfully",
//                 data: updateTestimonial
//             });
//         }
        
    
//     } catch (error) {
//         console.error("Error updating testimonial:", error);
//         return NextResponse.json({ error: "Failed to update testimonial" }, { status: 500 });
//     }
// }


export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    await connectDB();
    const { id } = (await params);
    const updateTestimonial = await Testimonial.findById(id);
    
    if (!updateTestimonial) {
        return NextResponse.json({ message: "Testimonial not found" }, { status: 404 });
    }
    
    try {
        const formData = await req.formData();
        let hasUpdates = false;
        
        // Handle text fields
        const name = formData.get("name") as string | null;
        const rating = formData.get("rating") ? Number(formData.get("rating")) : null;
        const testimonial = formData.get("testimonial") as string | null;
        const imageUrl = formData.get("imageUrl") as File | null;
        
        // Only update fields that were sent
        if (name !== null) {
            updateTestimonial.name = name;
            hasUpdates = true;
        }
        
        if (rating !== null) {
            updateTestimonial.rating = rating;
            hasUpdates = true;
        }
        
        if (testimonial !== null) {
            updateTestimonial.testimonial = testimonial;
            hasUpdates = true;
        }
        
        // Handle image update if provided
        if (imageUrl && imageUrl instanceof File) {
            if (updateTestimonial.imageUrl) {
                await deleteFromCloudinary(updateTestimonial.imageUrl);
                console.log("testimonial image deleted successfully");
            }
            const picUrl = await uploadToCloudinary(imageUrl);
            updateTestimonial.imageUrl = picUrl;
            hasUpdates = true;
        }
        
        if (hasUpdates) {
            await updateTestimonial.save();
            return NextResponse.json({
                success: true,
                message: "Testimonial updated successfully",
                data: updateTestimonial
            });
        } else {
            return NextResponse.json({
                success: false,
                message: "No updates provided"
            }, { status: 400 });
        }
        
    } catch (error) {
        console.error("Error updating testimonial:", error);
        return NextResponse.json({ 
            success: false,
            error: "Failed to update testimonial" 
        }, { status: 500 });
    }
}
import mongoose from "mongoose";

export interface TestimonialData {
    name: string;
    rating: number;
    testimonial: string;
    imageUrl: string;
}

const testimonialSchema = new mongoose.Schema<TestimonialData>({
    name: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        max: 5,
        min: 1,
    },
    testimonial: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    }
});                                 
export const Testimonial = mongoose.models.Testimonial || mongoose.model<TestimonialData>("Testimonial", testimonialSchema);
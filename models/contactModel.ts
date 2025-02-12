import mongoose from "mongoose";

export interface ContactData {
    name: string;
    email: string;
    phone: number;
    message: string;
    companyName: string;
    address: string;
}

const contactSchema = new mongoose.Schema<ContactData>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    companyName: {
        type: String,
        required: true,
    }
});
export const Contact = mongoose.models.Contact || mongoose.model<ContactData>("Contact", contactSchema);
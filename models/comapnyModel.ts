import mongoose from "mongoose";

export interface CompanyData {
    companyName: string;
    companyLogo: string;
    companyDescription: string;
    category: string;
    imagePdf: string
}

const companySchema = new mongoose.Schema<CompanyData>({
    companyName: {
        type: String,
        required: true,
    },
    companyLogo: {
        type: String,
        required: true,
    },
    companyDescription: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    imagePdf: {
        type: String,
        required: true
        
    }
});
companySchema.index({ companyName: 1 }, { unique: true });
export const Company = mongoose.models.Company || mongoose.model<CompanyData>("Company", companySchema);
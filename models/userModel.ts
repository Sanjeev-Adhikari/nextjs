import mongoose from "mongoose";
interface UserData {
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,        
    }
});

export const User = mongoose.models.User || mongoose.model<UserData>("User", userSchema);
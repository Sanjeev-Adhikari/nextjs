import connectDB from "@/db/dbConection";
import { User } from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    await connectDB();
  const {email, password} = await req.json();
    if(!email || !password) {
        return NextResponse.json({ message: "Please fill all the fields" });
    }
    try {
        const user = await User.findOne({ email });
        if(!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        
        return NextResponse.json({
            message: "User authenticated successfully",
            data: user
        });
    }
    catch (error) {
        console.error("Error authenticating user:", error);
        return NextResponse.json({ message: "Error authenticating user" }, { status: 500 });
    }
}
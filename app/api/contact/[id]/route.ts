import { Contact } from "@/models/contactModel";
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = (await params);
    try {
        const contact = await Contact.findById(id);
        if (!contact) return NextResponse.json({ message: "No contact found" });
        return NextResponse.json({
            message: "Single contact details found",
            data: contact,
        });
    } catch (error) {
        console.log("Error while fetching contact details", error);
        return NextResponse.json({ message: "Error while fetching contact details" });
    }
}
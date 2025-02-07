// contactHandler.js

import { Contact } from '@/models/contactModel'
import { NextRequest, NextResponse } from 'next/server';

import connectDB from '@/db/dbConection';
import { transporter } from '@/lib/nodemailer';
import { SEND_TO, SMTP_MAIL } from '@/config/env';

export async function POST(req:  NextRequest) {
  await connectDB();
  const { name, email, phone, message, companyName, address } = await req.json();

  if (!name || !email || !phone || !message || !companyName || !address) {
    return NextResponse.json({ message: 'Please fill all the fields' });
  }
  const createContact = await Contact.create({ name, email, phone, message, companyName, address });
  // Send email
  const mailOptions = {
    from: SMTP_MAIL,
    to: SEND_TO,
    replyTo: email,
    subject: 'Inquiry from website',
    text: `
      New contact form submission:

      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      Message: ${message}
      Company Name: ${companyName}
      Address: ${address}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }

  return NextResponse.json({
    message: 'Contact created successfully',
    data: createContact,
  });
}

export async function GET(req: NextRequest) {
    const contacts = await Contact.find({});
    if(!contacts) return NextResponse.json({message: "No contacts found"}, {status: 404});
    return NextResponse.json({
        message: "All inquiries fetched successfully",
        data: contacts,
    });
}
import nodemailer from "nodemailer";
import { SMTP_MAIL, SMTP_MAIL_PASS } from "@/config/env";

export const transporter = nodemailer.createTransport({
  service: "zoho",
  auth: {
    user: SMTP_MAIL,
    pass: SMTP_MAIL_PASS,
  },
});
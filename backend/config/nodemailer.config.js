import nodemailer from "nodemailer";
import { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } from "./constant";

export const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT, // production - 465 | development - 587
    secure: false, // for production - true | development - false
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
    },
})
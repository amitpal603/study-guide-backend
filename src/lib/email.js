import nodemailer from "nodemailer";

export const sendEmail = async (email, subject, html) => {

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("Email env are not available");
    return;
  }

  const HOST = process.env.SMTP_HOST;
  const USER = process.env.SMTP_USER;
  const PORT = Number(process.env.SMTP_PORT);
  const PASS = process.env.SMTP_PASS;
  const FROM = process.env.EMAIL_FROM;

  const transporter = nodemailer.createTransport({
    host: HOST,
    port: PORT,
    secure: false,
    auth: {
      user: USER,
      pass: PASS
    }
  });

  await transporter.sendMail({
    from: FROM,
    to: email,       // ✅ recipient
    subject: subject,
    html: html       // ✅ email content
  });
};
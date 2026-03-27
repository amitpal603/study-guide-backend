import { google } from "googleapis";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oAuth2Client.setCredentials({
   refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

export async function sendMail1(email, otp) {
  try {
    const accessTokenResponse = await oAuth2Client.getAccessToken();
    const accessToken =
      typeof accessTokenResponse === "string"
        ? accessTokenResponse
        : accessTokenResponse?.token;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.GOOGLE_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: accessToken, // ✅ IMPORTANT FIX
      },
    });

    await transporter.sendMail({
      from: `OTP Service <${process.env.GOOGLE_USER}>`,
      to: email,
      subject: "OTP Verification Code :",
      text: `Your Verification Code : ${otp}`,
    });
    console.log(" Email sent:");
  } catch (err) {
    console.error("Error:", err);
  }
}
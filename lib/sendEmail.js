import nodemailer from "nodemailer";
import nodemailerSendgrid from "nodemailer-sendgrid";

const transporter = nodemailer.createTransport(
  nodemailerSendgrid({
    apiKey: process.env.SENDGRID_API_KEY,
  })
);

export default async function sendEmail({ to, subject, text }) {
  try {
    await transporter.sendMail({
      // TODO: Update this once I bought a domain (https://app.sendgrid.com/settings/sender_auth/domain/create)
      from: "your-verified-email@example.com",
      to,
      subject,
      text,
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.error(
      "Error sending email:",
      error.code,
      error.response.body.errors
    );
  }
}

import bcryptjs from "bcryptjs";
import db from "../../../lib/db";
import crypto from "crypto";
import sendEmail from "../../../lib/sendEmail";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const hashedPassword = await bcryptjs.hash(password, 10);

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const { rows } = await db.query(
      `INSERT INTO users (email, password_hash, verification_token, verified)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email`,
      [email, hashedPassword, verificationToken, false]
    );

    // TODO: Change URL in production
    const verificationLink = `http://localhost:3000/verify?token=${verificationToken}`;
    await sendEmail({
      to: email,
      subject: "Verify Your Email",
      text: `Please click the following link to verify your email: ${verificationLink}`,
    });

    res.status(201).json({
      message: "Signup successful. Check your email for verification.",
    });
  } catch (error) {
    if (error.code === "23505") {
      res.status(409).json({ error: "Email already exists" });
    } else {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

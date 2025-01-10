import bcryptjs from "bcryptjs";
import db from "../../../lib/db";

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
    const { rows } = await db.query(
      `INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email`,
      [email, hashedPassword]
    );

    res.status(201).json({ user: rows[0] });
  } catch (error) {
    if (error.code === "23505") {
      res.status(409).json({ error: "Email already exists" });
    } else {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

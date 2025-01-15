import db from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: "Verification token is required" });
  }

  try {
    const { rows } = await db.query(
      `SELECT id FROM users WHERE verification_token = $1 AND verified = $2`,
      [token, false]
    );

    if (!rows.length) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    await db.query(
      `UPDATE users SET verified = $1, verification_token = $2 WHERE id = $3`,
      [true, null, rows[0].id]
    );

    res.status(200).json({ message: "Email successfully verified" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

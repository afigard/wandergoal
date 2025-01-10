import authMiddleware from "../../../lib/middleware/auth";
import db from "../../../lib/db";

async function handler(req, res) {
  const userId = req.user.userId;

  try {
    const { rows } = await db.query(
      `SELECT id, email, created_at FROM users WHERE id = $1`,
      [userId]
    );
    res.status(200).json({ user: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default authMiddleware(handler);

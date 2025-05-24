import db from "../db";

export async function handleGuestUser(guestId) {
  const placeholderEmail = `guest-${guestId}@placeholder.com`;
  const placeholderPassword = "GUEST_USER";

  // Check if the guest user already exists
  let guestUser = await db.query("SELECT * FROM users WHERE id = $1", [
    guestId,
  ]);

  if (!guestUser.rows.length) {
    // Create a new guest user in the database
    const result = await db.query(
      "INSERT INTO users (id, email, password_hash, created_at, verified) VALUES ($1, $2, $3, NOW(), $4) RETURNING *",
      [guestId, placeholderEmail, placeholderPassword, false]
    );
    return result.rows[0];
  }

  return guestUser.rows[0];
}

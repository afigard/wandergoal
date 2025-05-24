const pool = require("../../lib/db");

export default async function handler(req, res) {
  const { guestId } = req.query;

  try {
    // Query for the latest travel plan for the user
    const travelPlanResult = await pool.query(
      `
      SELECT id, target_countries, target_age, current_age, residence, created_at
      FROM travel_plans
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 1
      `,
      [guestId]
    );

    if (travelPlanResult.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "No travel plans found" });
    }

    const lastPlan = travelPlanResult.rows[0];

    // Query for the visited countries linked to the last travel plan
    const visitedCountriesResult = await pool.query(
      `
      SELECT country
      FROM visited_countries
      WHERE travel_plan_id = $1
      `,
      [lastPlan.id]
    );

    const visitedCountries = visitedCountriesResult.rows.map(
      (row) => row.country
    );

    // Send back the last plan with the visited countries
    res.status(200).json({
      success: true,
      lastPlan: {
        ...lastPlan,
        visitedCountries,
      },
    });
  } catch (error) {
    console.error("Error fetching last travel plan:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

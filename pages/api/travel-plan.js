const pool = require("../../lib/db");

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { targetCountries, targetAge, currentAge, residence, visited } =
      req.body;

    try {
      const travelPlanResult = await pool.query(
        "INSERT INTO travel_plans (target_countries, target_age, current_age, residence) VALUES ($1, $2, $3, $4) RETURNING id",
        [targetCountries, targetAge, currentAge, residence]
      );

      const travelPlanId = travelPlanResult.rows[0].id;

      const visitedInsertPromises = visited.map((country) =>
        pool.query(
          "INSERT INTO visited_countries (travel_plan_id, country) VALUES ($1, $2)",
          [travelPlanId, country]
        )
      );

      await Promise.all(visitedInsertPromises);

      res.status(201).json({ message: "Travel plan created successfully!" });
    } catch (error) {
      console.error("Error saving travel plan:", error);
      res.status(500).json({ error: "Failed to save travel plan" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

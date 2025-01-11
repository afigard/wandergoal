const pool = require("../../lib/db");

// Helper function: Haversine formula to calculate distance
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRadians = (degree) => (degree * Math.PI) / 180;

  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const {
      targetCountries,
      targetAge,
      currentAge,
      residence,
      visited,
      userId,
    } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    try {
      // Create the travel plan in the travel_plans table
      const travelPlanResult = await pool.query(
        "INSERT INTO travel_plans (target_countries, target_age, current_age, residence, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        [targetCountries, targetAge, currentAge, residence, userId]
      );

      const travelPlanId = travelPlanResult.rows[0].id;

      // Get residence country info
      const residenceResult = await pool.query(
        "SELECT latitude, longitude FROM countries WHERE name = $1",
        [residence]
      );
      if (!residenceResult.rows.length) {
        return res.status(400).json({ error: "Residence country not found" });
      }
      const { latitude: resLat, longitude: resLon } = residenceResult.rows[0];

      // Get all unvisited countries
      const unvisitedResult = await pool.query(
        `SELECT id, name, latitude, longitude
         FROM countries
         WHERE name != $1 AND name NOT IN (${visited.map(
           (_, i) => `$${i + 2}`
         )})`,
        [residence, ...visited]
      );

      const unvisitedCountries = unvisitedResult.rows;

      // Calculate distances from residence
      const distances = unvisitedCountries.map((country) => ({
        name: country.name,
        distance: calculateDistance(
          resLat,
          resLon,
          country.latitude,
          country.longitude
        ),
      }));

      // Sort countries by proximity
      distances.sort((a, b) => a.distance - b.distance);

      // Generate trips based on user inputs
      const yearsAvailable = targetAge - currentAge;
      const tripInterval = Math.floor((yearsAvailable * 12) / targetCountries); // in months
      const trips = distances
        .slice(0, targetCountries)
        .map((country, index) => ({
          travelPlanId, // Include travelPlanId in each trip object
          userId, // Include userId in each trip object
          country: country.name,
          startDate: new Date(
            new Date().setMonth(new Date().getMonth() + tripInterval * index)
          ),
        }));

      // Save trips to the database with the travel_plan_id
      const tripInsertPromises = trips.map((trip) =>
        pool.query(
          `INSERT INTO trips (travel_plan_id, user_id, country_name, start_date)
           VALUES ($1, $2, $3, $4)`,
          [trip.travelPlanId, trip.userId, trip.country, trip.startDate]
        )
      );
      await Promise.all(tripInsertPromises);

      // Insert visited countries into the visited_countries table
      const visitedInsertPromises = visited.map((country) =>
        pool.query(
          "INSERT INTO visited_countries (travel_plan_id, country) VALUES ($1, $2)",
          [travelPlanId, country]
        )
      );
      await Promise.all(visitedInsertPromises);

      res.status(201).json({ trips });
    } catch (error) {
      console.error("Error generating travel plan:", error);
      res.status(500).json({ error: "Failed to generate travel plan" });
    }
  } else if (req.method === "GET") {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    try {
      // Retrieve travel plan for the user
      const travelPlanResult = await pool.query(
        `SELECT id, target_countries, target_age, current_age, residence
         FROM travel_plans
         WHERE user_id = $1`,
        [userId]
      );

      const travelPlan = travelPlanResult.rows[0];
      if (!travelPlan) {
        return res.status(404).json({ error: "Travel plan not found" });
      }

      // Retrieve trips for the user using the travel_plan_id
      const tripsResult = await pool.query(
        `SELECT country_name AS country, start_date AS "startDate"
         FROM trips
         WHERE travel_plan_id = $1
         ORDER BY start_date ASC`,
        [travelPlan.id]
      );

      const trips = tripsResult.rows;

      // Retrieve visited countries for the user
      const visitedResult = await pool.query(
        `SELECT country
         FROM visited_countries
         WHERE travel_plan_id = $1`,
        [travelPlan.id]
      );

      const visitedCountries = visitedResult.rows.map((row) => row.country);

      res.status(200).json({ travelPlan, trips, visitedCountries });
    } catch (error) {
      console.error("Error fetching travel plan:", error);
      res.status(500).json({ error: "Failed to fetch travel plan" });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

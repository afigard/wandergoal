const pool = require("../../lib/db");
const { handleGuestUser } = require("../../lib/utils/guestUser");
const { kmeans } = require("ml-kmeans");
import excludedCountries from "../../lib/constants/excludedCountries.json";

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

const countryToFlagEmoji = (countryCode) => {
  return countryCode
    .toUpperCase()
    .split("")
    .map((char) =>
      String.fromCodePoint(char.charCodeAt(0) + 0x1f1e6 - "A".charCodeAt(0))
    )
    .join("");
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const {
      targetCountries,
      targetAge,
      currentAge,
      residence,
      visited,
      guestId,
    } = req.body;

    if (!guestId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    try {
      // Ensure the guest user exists in the database and create one if it doesn't
      await handleGuestUser(guestId);

      // Create the travel plan in the travel_plans table
      const travelPlanResult = await pool.query(
        "INSERT INTO travel_plans (target_countries, target_age, current_age, residence, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        [targetCountries, targetAge, currentAge, residence, guestId]
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

      if (targetCountries <= 0) {
        return res
          .status(400)
          .json({ error: "No more countries to plan trips for." });
      }

      const unvisitedResult = await pool.query(
        `SELECT id, name, latitude, longitude
         FROM countries
         WHERE name != $1 AND name NOT IN (${visited.map(
           (_, i) => `$${i + 2}`
         )}) AND name NOT IN (${excludedCountries.map(
          (country, i) => `$${i + visited.length + 2}`
        )})`,
        [residence, ...visited, ...excludedCountries]
      );

      const unvisitedCountries = unvisitedResult.rows;

      // Calculate distances from residence
      const distances = unvisitedCountries.map((country) => ({
        ...country,
        distance: calculateDistance(
          resLat,
          resLon,
          country.latitude,
          country.longitude
        ),
      }));

      // Sort countries by proximity
      distances.sort((a, b) => a.distance - b.distance);

      // Limit countries to the remaining target countries
      const limitedCountries = distances.slice(0, targetCountries);

      // Cluster countries for trips
      const clusterCountriesWithProximity = (
        countries,
        maxClusters,
        distanceThreshold
      ) => {
        // Helper to calculate pairwise distances
        const calculatePairwiseDistances = (countries) =>
          countries.map((a) =>
            countries.map((b) =>
              calculateDistance(
                a.latitude,
                a.longitude,
                b.latitude,
                b.longitude
              )
            )
          );

        const distancesMatrix = calculatePairwiseDistances(countries);

        // Group countries based on distance threshold
        const clusters = [];
        const visited = new Set();

        countries.forEach((country, i) => {
          if (!visited.has(i)) {
            const cluster = [country];
            visited.add(i);

            countries.forEach((otherCountry, j) => {
              if (
                i !== j &&
                !visited.has(j) &&
                distancesMatrix[i][j] <= distanceThreshold
              ) {
                cluster.push(otherCountry);
                visited.add(j);
              }
            });

            clusters.push(cluster);
          }
        });

        // If clusters exceed maxClusters, apply k-means on cluster centroids to merge
        if (clusters.length > maxClusters) {
          const centroids = clusters.map((cluster) => {
            const avgLat =
              cluster.reduce((sum, c) => sum + c.latitude, 0) / cluster.length;
            const avgLon =
              cluster.reduce((sum, c) => sum + c.longitude, 0) / cluster.length;
            return [avgLat, avgLon];
          });

          // Perform k-means clustering
          const kmeansResult = kmeans(centroids, maxClusters);

          // Map k-means cluster indices to original clusters
          const mergedClusters = Array.from({ length: maxClusters }, () => []);
          kmeansResult.clusters.forEach((clusterIndex, index) => {
            mergedClusters[clusterIndex].push(...clusters[index]);
          });

          return mergedClusters.filter((c) => c.length > 0);
        }

        return clusters;
      };

      const totalMonths = (targetAge - currentAge) * 12;
      const maxTrips = Math.min(targetCountries, totalMonths);
      const tripIntervalMonths = Math.floor(totalMonths / maxTrips);

      // Clustered trips
      const clusteredTrips = clusterCountriesWithProximity(
        limitedCountries,
        maxTrips,
        250
      );

      const baseDate = new Date();
      baseDate.setMonth(baseDate.getMonth() + 1);

      // Maximum countries allowed per trip
      const maxCountriesPerTrip = Math.max(
        3,
        Math.ceil(targetCountries / totalMonths) + 1
      );

      let tripMonthOffset = 0;

      const trips = clusteredTrips.flatMap((cluster, clusterIndex) => {
        const chunkedClusters = [];

        // Break down large clusters into smaller chunks
        for (let i = 0; i < cluster.length; i += maxCountriesPerTrip) {
          chunkedClusters.push(cluster.slice(i, i + maxCountriesPerTrip));
        }

        // Create trips for each chunk
        return chunkedClusters.map((chunk, chunkIndex) => {
          const tentativeStartDate = new Date(baseDate);
          tentativeStartDate.setMonth(
            tentativeStartDate.getMonth() + tripMonthOffset
          );

          // Determine trip duration based on number of countries
          let tripDuration, targetWeekday;
          if (chunk.length === 1) {
            tripDuration = 2; // 1 night, 2-day trip
            targetWeekday = 6; // Saturday
          } else if (chunk.length === 2) {
            tripDuration = 4;
            targetWeekday = 5; // Friday
          } else {
            tripDuration = 7;
            targetWeekday = 1; // Monday
          }

          // Adjust start date to the next occurrence of targetWeekday
          const adjustedStartDate = new Date(tentativeStartDate);
          while (adjustedStartDate.getDay() !== targetWeekday) {
            adjustedStartDate.setDate(adjustedStartDate.getDate() + 1);
          }

          // Calculate end date based on trip duration
          const endDate = new Date(adjustedStartDate);
          endDate.setDate(adjustedStartDate.getDate() + tripDuration - 1);

          // Increment offset for each trip
          tripMonthOffset += tripIntervalMonths;

          return {
            travelPlanId,
            guestId,
            countries: chunk.map(
              (c) => `${c.name} ${countryToFlagEmoji(c.id)}`
            ),
            tripDates: { start: adjustedStartDate, end: endDate },
          };
        });
      });

      // Save trips to the database
      const tripInsertPromises = trips.map((trip) =>
        pool.query(
          `INSERT INTO trips (travel_plan_id, user_id, country_name, start_date, end_date)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            trip.travelPlanId,
            trip.guestId,
            trip.countries.join(", "),
            trip.tripDates.start,
            trip.tripDates.end,
          ]
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
    const { guestId } = req.query;

    if (!guestId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    try {
      // Retrieve all travel plans for the user
      const travelPlansResult = await pool.query(
        `SELECT id, target_countries, target_age, current_age, residence, created_at,
                ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at ASC) AS plan_number
         FROM travel_plans
         WHERE user_id = $1
         ORDER BY created_at DESC`,
        [guestId]
      );

      const travelPlans = travelPlansResult.rows;

      if (!travelPlans.length) {
        return res.status(404).json({ error: "No travel plans found" });
      }

      // Retrieve trips and visited countries for each travel plan
      const detailedPlans = await Promise.all(
        travelPlans.map(async (plan) => {
          const tripsResult = await pool.query(
            `SELECT country_name AS country, start_date AS "startDate", end_date AS "endDate"
             FROM trips
             WHERE travel_plan_id = $1
             ORDER BY start_date ASC`,
            [plan.id]
          );

          const visitedResult = await pool.query(
            `SELECT country
             FROM visited_countries
             WHERE travel_plan_id = $1`,
            [plan.id]
          );

          return {
            ...plan,
            trips: tripsResult.rows,
            visitedCountries: visitedResult.rows.map((row) => row.country),
          };
        })
      );

      res.status(200).json({ travelPlans: detailedPlans });
    } catch (error) {
      console.error("Error fetching travel plans:", error);
      res.status(500).json({ error: "Failed to fetch travel plans" });
    }
  } else if (req.method === "DELETE") {
    const { planId } = req.query;

    if (!planId) {
      return res.status(400).json({ error: "Plan ID is required" });
    }

    try {
      // Delete associated trips first (to maintain referential integrity)
      await pool.query("DELETE FROM trips WHERE travel_plan_id = $1", [planId]);

      // Delete visited countries associated with the travel plan
      await pool.query(
        "DELETE FROM visited_countries WHERE travel_plan_id = $1",
        [planId]
      );

      // Delete the travel plan itself
      await pool.query("DELETE FROM travel_plans WHERE id = $1", [planId]);

      res.status(200).json({ message: "Travel plan deleted successfully" });
    } catch (error) {
      console.error("Error deleting travel plan:", error);
      res.status(500).json({ error: "Failed to delete travel plan" });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

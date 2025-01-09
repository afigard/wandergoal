export default async function handler(req, res) {
  if (req.method === "POST") {
    const { targetCountries, targetAge, currentAge, residence, visited } =
      req.body;

    // Simulate trip generation (replace with actual logic)
    const trips = generateTrips(
      targetCountries,
      targetAge,
      currentAge,
      residence,
      visited
    );

    return res.status(200).json({ trips });
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}

// A mock function to generate trips (replace with your real trip logic)
function generateTrips(
  targetCountries,
  targetAge,
  currentAge,
  residence,
  visited
) {
  // Simulating a basic trip list
  return [
    { date: "2025-01-12", location: "Budapest" },
    { date: "2025-01-20", location: "Prague" },
  ];
}

export default function handler(req, res) {
  if (req.method === "POST") {
    const { targetCountries, targetAge, currentAge, residence, visited } =
      req.body;
    const trips = [
      { date: "2025-01-12", location: "Budapest" },
      { date: "2025-01-20", location: "Prague" },
    ]; // Replace with real logic later
    res.status(200).json({ trips });
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}

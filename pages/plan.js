import { useState, useEffect } from "react";
import Header from "../components/Header";
import TravelPlan from "../components/TravelPlan";

export default function Plan() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      console.error("User not logged in");
      return;
    }

    const fetchTrips = async () => {
      try {
        const response = await fetch(`/api/travel-plan?userId=${userId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch trips");
        }

        const data = await response.json();
        setTrips(data.trips || []);
      } catch (error) {
        console.error("Error fetching trips:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <Header />
      <h1 className="text-3xl font-bold mb-6 text-center">Your Travel Plan</h1>
      {loading ? <p>Loading trips...</p> : <TravelPlan trips={trips} />}
    </div>
  );
}

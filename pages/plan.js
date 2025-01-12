import { useState, useEffect } from "react";
import Header from "../components/Header";
import TravelPlan from "../components/TravelPlan";

export default function Plan() {
  const [travelPlans, setTravelPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      console.error("User not logged in");
      return;
    }

    const fetchTravelPlans = async () => {
      try {
        const response = await fetch(`/api/travel-plan?userId=${userId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch travel plans");
        }

        const data = await response.json();
        setTravelPlans(data.travelPlans || []);
      } catch (error) {
        console.error("Error fetching travel plans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTravelPlans();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <Header />
      <h1 className="text-3xl font-bold mb-6 text-center">My Travel Plans</h1>
      {loading ? (
        <p>Loading travel plans...</p>
      ) : (
        travelPlans.map((plan) => (
          <div key={plan.id} className="mb-8 border p-4 rounded shadow">
            <h2 className="text-2xl font-semibold mb-4">
              Travel Plan #{plan.plan_number}
            </h2>

            <h3 className="text-xl font-medium mt-4 mb-2">Details:</h3>
            <p>Target Countries: {plan.target_countries}</p>
            <p>Target Age: {plan.target_age}</p>
            <p>Current Age: {plan.current_age}</p>
            <p>Residence: {plan.residence}</p>
            <p>
              Visited Countries:
              <ul className="list-disc list-inside">
                {plan.visitedCountries.length > 0 ? (
                  plan.visitedCountries.map((country, idx) => (
                    <li key={idx}>{country}</li>
                  ))
                ) : (
                  <li>No countries visited yet.</li>
                )}
              </ul>
            </p>
            <p>
              Creation Date: {new Date(plan.created_at).toLocaleDateString()}
            </p>

            <h3 className="text-xl font-medium mt-4 mb-2">
              Recommended Trips:
            </h3>
            {plan.trips.length > 0 ? (
              <TravelPlan trips={plan.trips} />
            ) : (
              <p>No trips planned yet.</p>
            )}
          </div>
        ))
      )}
    </div>
  );
}

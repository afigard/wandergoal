import { useState, useEffect } from "react";
import TravelPlan from "../components/travel/TravelPlan";
import experiencesData from "../lib/constants/experiences.json";
import { format } from "date-fns";

function downloadTXT(plan) {
  // Format travel plan details
  let txtContent = `Travel Plan #${plan.plan_number}\n`;
  txtContent += `Created On: ${format(
    new Date(plan.created_at),
    "MMMM dd, yyyy"
  )}\n`;
  txtContent += `Target: ${plan.target_countries} ${
    plan.target_countries === 1 ? "country" : "countries"
  } in ${plan.target_age - plan.current_age} ${
    plan.target_age - plan.current_age === 1 ? "year" : "years"
  }\n`;
  txtContent += `Residence: ${plan.residence}\n`;
  txtContent += `Visited Countries: ${plan.visitedCountries.join(", ")}\n\n`;

  // Add recommended trips
  txtContent += `Recommended Trips:\n`;
  plan.trips.forEach((trip) => {
    txtContent += `\n📍 ${trip.country}\n`;
    txtContent += `   - Start Date: ${format(
      new Date(trip.startDate),
      "yyyy-MM-dd"
    )}\n`;
    txtContent += `   - End Date: ${format(
      new Date(trip.endDate),
      "yyyy-MM-dd"
    )}\n`;

    // Extract individual country names
    const countryNames = trip.country
      .split(",")
      .map((c) => c.trim().replace(/\s[^\p{L}]+/gu, ""));

    // Gather experiences for all countries
    const experiences = countryNames.flatMap(
      (cleanCountry) => experiencesData[cleanCountry] || []
    );

    if (experiences.length > 0) {
      txtContent += `   - Recommended Experience${
        experiences.length > 1 ? "s" : ""
      }:\n`;
      experiences.forEach((exp) => {
        txtContent += `     ${exp}\n`;
      });
    } else {
      txtContent += `   - Recommended Experience: No recommendations available.\n`;
    }
  });

  // Add a friendly closing note with a trademark
  txtContent += `\n---\nBrought to you by WanderGoal™ 💚 Explore the world your way!\n`;

  // Convert to Blob and trigger download
  const blob = new Blob([txtContent], { type: "text/plain;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `Travel_Plan_${plan.plan_number}.txt`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function Plan() {
  const [travelPlans, setTravelPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);

  useEffect(() => {
    const guestId = localStorage.getItem("guestId");

    if (!guestId) {
      console.error("User not logged in");
      setLoading(false);
      setError("User not logged in");
      return;
    }

    const fetchTravelPlans = async () => {
      try {
        const response = await fetch(`/api/travel-plan?guestId=${guestId}`);

        if (!response.ok) {
          if (response.status === 404) {
            setTravelPlans([]);
            return;
          }
          throw new Error(`Failed to fetch travel plans: ${response.status}`);
        }

        const data = await response.json();
        setTravelPlans(data.travelPlans || []);
      } catch (error) {
        console.error("Error fetching travel plans:", error);
        setError(error.message);
        setTravelPlans([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTravelPlans();
  }, []);

  const deleteTravelPlan = async () => {
    if (!planToDelete) return;

    try {
      const response = await fetch(`/api/travel-plan/?planId=${planToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete travel plan.");
      }

      setTravelPlans(travelPlans.filter((plan) => plan.id !== planToDelete));
    } catch (error) {
      console.error("Error deleting travel plan:", error);
    } finally {
      setShowModal(false);
      setPlanToDelete(null);
    }
  };

  const [expandedCountries, setExpandedCountries] = useState({});

  const toggleVisitedCountries = (planId) => {
    setExpandedCountries((prev) => ({
      ...prev,
      [planId]: !prev[planId],
    }));
  };

  return (
    <div className="bg-neutral-50 dark:bg-neutral-950 min-h-screen flex flex-col">
      <main className="flex-grow w-[90%] max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-green-600">
          My Travel Plans
        </h1>
        {loading ? (
          <p className="text-center text-neutral-600 dark:text-neutral-400">
            Loading travel plans...
          </p>
        ) : error ? (
          <p className="text-center text-red-500">Error: {error}</p>
        ) : travelPlans.length > 0 ? (
          travelPlans.map((plan) => (
            <div
              key={plan.id}
              className="mb-8 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 p-6 rounded-lg shadow-md"
            >
              {/* Row for title, date, and download button */}
              <div className="flex items-center justify-between">
                {/* Travel Plan title and date */}
                <div>
                  <h2 className="text-2xl font-semibold text-green-700">
                    Travel Plan #{plan.plan_number}
                  </h2>
                  <p className="text-neutral-500">
                    Created on{" "}
                    {format(new Date(plan.created_at), "MMMM dd, yyyy")}
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                  <button
                    className="p-2 rounded-full shadow flex items-center justify-center"
                    title="Download"
                    onClick={() => downloadTXT(plan)}
                  >
                    📥
                  </button>

                  <button
                    className="p-2 rounded-full shadow flex items-center justify-center"
                    title="Delete"
                    onClick={() => {
                      setShowModal(true);
                      setPlanToDelete(plan.id);
                    }}
                  >
                    ❌
                  </button>
                </div>
              </div>

              {/* Details Section */}
              <div className="mt-4">
                <h3 className="text-xl font-medium mb-2 text-green-600">
                  Details:
                </h3>
                <p className="text-neutral-700 dark:text-neutral-300 font-medium">
                  Target: {plan.target_countries}{" "}
                  {plan.target_countries === 1 ? "country" : "countries"} in{" "}
                  {plan.target_age - plan.current_age}{" "}
                  {plan.target_age - plan.current_age === 1 ? "year" : "years"}
                </p>
                <p className="text-neutral-700 dark:text-neutral-300">
                  Residence: {plan.residence}
                </p>

                {/* Visited Countries Toggle */}
                <div>
                  <button
                    onClick={() => toggleVisitedCountries(plan.id)}
                    className="flex items-center text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 focus:outline-none"
                  >
                    <svg
                      className={`mr-1 w-3 h-3 transform transition-transform ${
                        expandedCountries[plan.id] ? "rotate-90" : ""
                      }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <polygon points="5,3 15,10 5,17" />
                    </svg>
                    Visited Countries ({plan.visitedCountries.length}/195)
                  </button>

                  {/* Show countries only if expanded */}
                  {expandedCountries[plan.id] && (
                    <ul className="list-disc list-inside text-neutral-700 dark:text-neutral-300">
                      {plan.visitedCountries.length > 0 ? (
                        plan.visitedCountries.map((country, idx) => (
                          <li key={idx}>{country}</li>
                        ))
                      ) : (
                        <li>No countries visited yet.</li>
                      )}
                    </ul>
                  )}
                </div>

                {/* Recommended Trips Section */}
                <h3 className="text-xl font-medium mt-4 mb-2 text-green-600">
                  Recommended Trips:
                </h3>
                {plan.trips.length > 0 ? (
                  <TravelPlan trips={plan.trips} />
                ) : (
                  <p className="text-neutral-500">No trips planned yet.</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-neutral-500">
            You don't have any travel plans yet. Start planning your next
            adventure!
          </p>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black dark:bg-white bg-opacity-50 dark:bg-opacity-50">
          <div className="bg-white dark:bg-black p-4 rounded-lg shadow-lg w-[90%] max-w-xs sm:max-w-sm text-center">
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">
              Delete Travel Plan?
            </h2>
            <p className="text-neutral-700 dark:text-neutral-300 mt-2">
              This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-center gap-4">
              <button
                className="bg-neutral-300 dark:bg-neutral-700 px-4 py-2 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-400 dark:hover:bg-neutral-600"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 dark:bg-red-400 px-4 py-2 rounded-lg text-white dark:text-black hover:bg-red-700 dark:hover:bg-red-300"
                onClick={deleteTravelPlan}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
